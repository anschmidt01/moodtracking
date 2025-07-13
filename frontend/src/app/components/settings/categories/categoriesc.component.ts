import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Category {
  id: number;
  text: string;
  emoji?: string;
  color?: string;
  type: 'mood' | 'activity';
}

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  moods: Category[] = [];
  activities: Category[] = [];

  newMoodEmoji = '';
  newMoodText = '';
  newActivity = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.http.get<Category[]>('http://localhost:3000/categories').subscribe({
      next: (data) => {
        this.moods = data.filter(c => c.type === 'mood');
        this.activities = data.filter(c => c.type === 'activity');
      },
      error: (err) => console.error('Fehler beim Laden der Kategorien:', err)
    });
  }

  addMood(): void {
    if (this.newMoodEmoji.trim() && this.newMoodText.trim()) {
      const newCategory: Omit<Category, 'id'> = {
        text: this.newMoodText.trim(),
        emoji: this.newMoodEmoji.trim(),
        color: '#d4edda',
        type: 'mood'
      };

      this.http.post<Category>('http://localhost:3000/categories', newCategory).subscribe({
        next: (created) => {
          this.moods.push(created);
          this.newMoodEmoji = '';
          this.newMoodText = '';
        },
        error: (err) => console.error('Fehler beim Hinzufügen:', err)
      });
    }
  }

  removeMood(mood: Category): void {
    this.http.delete(`http://localhost:3000/categories/${mood.id}`).subscribe({
      next: () => {
        this.moods = this.moods.filter(m => m.id !== mood.id);
      },
      error: (err) => console.error('Fehler beim Löschen:', err)
    });
  }

  addActivity(): void {
    if (this.newActivity.trim()) {
      const newCategory: Omit<Category, 'id'> = {
        text: this.newActivity.trim(),
        type: 'activity'
      };

      this.http.post<Category>('http://localhost:3000/categories', newCategory).subscribe({
        next: (created) => {
          this.activities.push(created);
          this.newActivity = '';
        },
        error: (err) => console.error('Fehler beim Hinzufügen:', err)
      });
    }
  }

  removeActivity(activity: Category): void {
    this.http.delete(`http://localhost:3000/categories/${activity.id}`).subscribe({
      next: () => {
        this.activities = this.activities.filter(a => a.id !== activity.id);
      },
      error: (err) => console.error('Fehler beim Löschen:', err)
    });
  }
}
