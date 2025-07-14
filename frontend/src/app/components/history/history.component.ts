import { Component, signal, computed, OnInit } from '@angular/core';
import { MoodService, MoodEntry } from 'src/app/services/mood.service';
import { CategoryService, Category } from 'src/app/services/category.service';

@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  entries = signal<MoodEntry[]>([]);
  categoryMap = new Map<number, Category>();
  groupMode = signal<'day' | 'month' | 'week'>('day');
  filterInput = signal<string>('');
  filterValue = signal<string>('');

  constructor(
    private moodService: MoodService, 
    private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        cats.forEach(c => this.categoryMap.set(c.id, c));
        this.loadEntries();
      },
      error: (err) => console.error('Fehler beim Laden der Kategorien:', err)
    });
  }
  loadEntries(): void {
    this.moodService.getMoods().subscribe({
      next: (data) => {
        const sorted = data.sort((a, b) => b.id - a.id);
        this.entries.set(sorted);
      },
      error: (err) => console.error('Fehler beim Laden der Einträge:', err)
    });
  }
  
 // Computed Labels
 chartLabels = computed(() => {
  const grouped: { [key: string]: number } = {};

  this.entries().forEach(entry => {
    const dateObj = new Date(entry.date);
    let key = '';

    if (this.groupMode() === 'day') {
      key = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
    } else if (this.groupMode() === 'month') {
      key = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
    } else if (this.groupMode() === 'week') {
      const janFirst = new Date(dateObj.getFullYear(), 0, 1);
      const days = Math.floor((dateObj.getTime() - janFirst.getTime()) / (24 * 60 * 60 * 1000));
      const week = Math.ceil((days + janFirst.getDay() + 1) / 7);
      key = `${dateObj.getFullYear()}-W${week.toString().padStart(2, '0')}`;
    }

    if (this.filterValue() && !key.startsWith(this.filterValue())) return;

    grouped[key] = (grouped[key] || 0) + 1;
  });

  return Object.keys(grouped).sort();
});

// Computed Data
chartData = computed(() => {
  const grouped: { [key: string]: number } = {};

  this.entries().forEach(entry => {
    const dateObj = new Date(entry.date);
    let key = '';

    if (this.groupMode() === 'day') {
      key = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
    } else if (this.groupMode() === 'month') {
      key = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
    } else if (this.groupMode() === 'week') {
      const janFirst = new Date(dateObj.getFullYear(), 0, 1);
      const days = Math.floor((dateObj.getTime() - janFirst.getTime()) / (24 * 60 * 60 * 1000));
      const week = Math.ceil((days + janFirst.getDay() + 1) / 7);
      key = `${dateObj.getFullYear()}-W${week.toString().padStart(2, '0')}`;
    }

    if (this.filterValue() && !key.startsWith(this.filterValue())) return;

    grouped[key] = (grouped[key] || 0) + 1;
  });

  const sortedKeys = Object.keys(grouped).sort();
  return sortedKeys.map(k => grouped[k]);
});

applyFilter(): void {
  this.filterValue.set(this.filterInput().trim());
}

resetFilter(): void {
  this.filterInput.set('');
  this.filterValue.set('');
}

  getColor(mood: Category): string {
    return mood?.color || '#f0f0f0';
  }

  getIcon(mood: Category): string {
    return mood?.emoji || '❓';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }
}
