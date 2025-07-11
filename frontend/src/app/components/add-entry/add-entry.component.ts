import { Component, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoodService, MoodEntry } from 'src/app/services/mood.service';
import { CategoryService, Category } from 'src/app/services/category.service';

@Component({
  selector: 'app-add-entry',
  standalone: false,
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent implements OnInit {
  moodOptions: Category[] = [];
  activityOptions: Category[] = [];

  selectedEmotion = signal<string | null>(null);
  selectedActivities = signal<string[]>([]);
  note = signal<string>('');

  @Output() entrySaved = new EventEmitter<any>();

  constructor(
    private moodService: MoodService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.moodOptions = cats.filter(c => c.type === 'mood');
        this.activityOptions = cats.filter(c => c.type === 'activity');
      },
      error: (err) => {
        console.error('Fehler beim Laden der Kategorien:', err);
      }
    });
  }

  getEmotionColor(index: number): string {
    const colors = ['#fde2e2', '#f8d7da', '#fff3cd', '#d4edda', '#d1e7dd'];
    return colors[index % colors.length];
  }

  selectEmotion(emotion: string) {
    this.selectedEmotion.set(emotion);
  }

  toggleActivity(activity: string) {
    const current = this.selectedActivities();
    if (current.includes(activity)) {
      this.selectedActivities.set(current.filter(a => a !== activity));
    } else {
      this.selectedActivities.set([...current, activity]);
    }
  }

  onNoteInput(event: Event) {
    const target = event.target as HTMLTextAreaElement | null;
    if (target) {
      this.note.set(target.value);
    }
  }

  saveEntry() {
    if (!this.selectedEmotion()) {
      alert('Bitte gib an wie du dich heute fühlst.');
      return;
    }

    const entry: MoodEntry = {
      mood: this.selectedEmotion() as string,
      activities: this.selectedActivities(),
      notes: this.note().trim(),
      date: new Date().toISOString(),
    };

    this.moodService.saveMood(entry).subscribe({
      next: (response) => {
        console.log('In DB gespeichert:', response);
        alert('Eintrag erfolgreich gespeichert!');
        this.selectedEmotion.set(null);
        this.selectedActivities.set([]);
        this.note.set('');
      },
      error: (err) => {
        console.error('Fehler beim Speichern:', err);
        alert('Fehler beim Speichern des Eintrags.');
      }
    });
  }
}
