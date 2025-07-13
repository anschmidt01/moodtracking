import { Component, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoodService } from 'src/app/services/mood.service';
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

  selectedEmotion = signal<number | null>(null);
  selectedActivities = signal<number[]>([]);
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

  selectEmotion(id: number) {
    this.selectedEmotion.set(id);
  }

  toggleActivity(id: number) {
    const current = this.selectedActivities();
    if (current.includes(id)) {
      this.selectedActivities.set(current.filter(a => a !== id));
    } else {
      this.selectedActivities.set([...current, id]);
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

    const entry = {
      mood_id: this.selectedEmotion() as number,
      activity_ids: this.selectedActivities(),
      notes: this.note().trim(),
      date: new Date().toISOString().split('T')[0],
    };
    console.log('Eintrag wird gesendet:', entry);

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
