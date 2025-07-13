import { Component, OnInit } from '@angular/core';
import { MoodService } from 'src/app/services/mood.service';
import { CategoryService, Category } from 'src/app/services/category.service';

@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  entries: {
    id: number;
    date: string;
    mood: Category;
    activities: Category[];
    notes: string;
  }[] = [];

  categoryMap = new Map<number, Category>();

  chartLabels: string[] = [];
  chartData: number[] = [];

  groupMode: 'day' | 'month' | 'week' = 'day';
  filterInput = '';
  filterValue = '';

  constructor(private moodService: MoodService, private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        cats.forEach(c => this.categoryMap.set(c.id, c));
        this.loadEntries();
      },
      error: (err) => console.error('Fehler beim Laden der Kategorien:', err)
    });
  }

  loadEntries() {
    this.moodService.getMoods().subscribe({
      next: (data) => {
        this.entries = data;
        this.prepareChartData();
      },
      error: (err) => console.error('Fehler beim Laden:', err)
    });
  }

  prepareChartData() {
    const grouped: { [key: string]: number } = {};

    this.entries.forEach(entry => {
      const dateObj = new Date(entry.date);
      let key = '';

      if (this.groupMode === 'day') {
        key = `${dateObj.getFullYear()}-${(dateObj.getMonth()+1).toString().padStart(2,'0')}-${dateObj.getDate().toString().padStart(2,'0')}`;
      } else if (this.groupMode === 'month') {
        key = `${dateObj.getFullYear()}-${(dateObj.getMonth()+1).toString().padStart(2,'0')}`;
      } else if (this.groupMode === 'week') {
        const janFirst = new Date(dateObj.getFullYear(), 0, 1);
        const days = Math.floor((dateObj.getTime() - janFirst.getTime()) / (24*60*60*1000));
        const week = Math.ceil((days + janFirst.getDay() + 1) / 7);
        key = `${dateObj.getFullYear()}-W${week.toString().padStart(2,'0')}`;
      }

      if (this.filterValue && !key.startsWith(this.filterValue)) return;

      grouped[key] = (grouped[key] || 0) + 1;
    });

    const sortedKeys = Object.keys(grouped).sort();
    this.chartLabels = sortedKeys;
    this.chartData = sortedKeys.map(k => grouped[k]);
  }

  applyFilter() {
    this.filterValue = this.filterInput.trim();
    this.prepareChartData();
  }

  resetFilter() {
    this.filterInput = '';
    this.filterValue = '';
    this.prepareChartData();
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
