import { Component, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { MoodService } from 'src/app/services/mood.service';
import { CategoryService, Category } from 'src/app/services/category.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-entry',
  standalone: false,
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent {
  categories = signal<Category[]>([]);

  moodOptions = computed(() =>
    this.categories().filter(c => c.type === 'mood')
  );

  activityOptions = computed(() =>
    this.categories().filter(c => c.type === 'activity')
  );

  selectedEmotion = signal<number | null>(null);
  selectedActivities = signal<number[]>([]);
  note = signal<string>('');

  constructor(
    private moodService: MoodService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    // Observable in Signal umwandeln
    const categories$ = this.categoryService.getCategories();
    categories$.subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Fehler beim Laden:', err)
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
      date: new Date().toISOString(),
    };

    this.moodService.saveMood(entry).subscribe({
      next: () => {
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
