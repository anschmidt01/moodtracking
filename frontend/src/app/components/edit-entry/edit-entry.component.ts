import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoodService, MoodEntry } from 'src/app/services/mood.service';
import { CategoryService, Category } from 'src/app/services/category.service';

@Component({
  selector: 'app-edit-entry',
  standalone: false,
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.scss']
})
export class EditEntryComponent implements OnInit {
  entry!: MoodEntry;
  emotions: Category[] = [];
  activities: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private moodService: MoodService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.emotions = categories.filter(c => c.type === 'mood');
        this.activities = categories.filter(c => c.type === 'activity');

        this.moodService.getMoods().subscribe({
          next: (entries) => {
            const found = entries.find(e => e.id === id);
            if (!found) {
              alert('Eintrag nicht gefunden.');
              this.router.navigate(['/history']);
              return;
            }
            this.entry = found;
          }
        });
      },
      error: (err) => console.error('Fehler beim Laden der Kategorien:', err)
    });
  }

  isSelectedMood(mood: Category): boolean {
    return this.entry.mood?.id === mood.id;
  }

  selectMood(mood: Category): void {
    this.entry.mood = mood;
  }

  isActivitySelected(activity: Category): boolean {
    return this.entry.activities.some(a => a.id === activity.id);
  }

  toggleActivity(activity: Category): void {
    if (this.isActivitySelected(activity)) {
      this.entry.activities = this.entry.activities.filter(a => a.id !== activity.id);
    } else {
      this.entry.activities = [...this.entry.activities, activity];
    }
  }

  save(): void {
    const payload = {
      date: this.entry.date,
      notes: this.entry.notes,
      mood_id: this.entry.mood.id,
      activity_ids: this.entry.activities.map(a => a.id)
    };

    this.moodService.updateMood(this.entry.id, payload).subscribe({
      next: () => {
        alert('Eintrag aktualisiert!');
        this.router.navigate(['/history']);
      },
      error: (err) => console.error('Fehler beim Speichern:', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/history']);
  }
}
