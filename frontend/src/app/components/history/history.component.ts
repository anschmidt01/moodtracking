import { Component, OnInit } from '@angular/core';
import { MoodService, MoodEntry } from 'src/app/services/mood.service';
import { CategoryService, Category } from 'src/app/services/category.service';

@Component({
  selector: 'app-history',
  standalone: false, 
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  entries: MoodEntry[] = [];
  categoryMap = new Map<string, Category>();

  chartLabels: string[] = [];
  chartData: number[] = [];

  groupMode: 'day' | 'month' | 'week' = 'day';
  filterInput: string = '';
  filterValue: string = ''; // z.B. '2025-07' oder '2025-W28'

  constructor(private moodService: MoodService, private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        // Map bauen für schnelles Lookup
        cats
          .filter(c => c.type === 'mood')
          .forEach(c => this.categoryMap.set(c.text, c));
  
        // Danach die Mood-Einträge laden
        this.loadEntries();
      },
      error: (err) => {
        console.error('Fehler beim Laden der Kategorien:', err);
      }
    });  }

  loadEntries() {
    this.moodService.getMoods().subscribe({
      next: (data) => {
        this.entries = data;
        this.prepareChartData();
      },
      error: (err) => {
        console.error('Fehler beim Laden:', err);
      }
    });
  }

  prepareChartData() {
    const grouped: { [key: string]: number } = {};
  
    this.entries.forEach((entry) => {
      const dateObj = new Date(entry.date);
      let key = '';
  
      if (this.groupMode === 'day') {
        key = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
      } else if (this.groupMode === 'month') {
        key = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
      } else if (this.groupMode === 'week') {
        const janFirst = new Date(dateObj.getFullYear(), 0, 1);
        const days = Math.floor((dateObj.getTime() - janFirst.getTime()) / (24 * 60 * 60 * 1000));
        const week = Math.ceil((days + janFirst.getDay() + 1) / 7);
        key = `${dateObj.getFullYear()}-W${week.toString().padStart(2, '0')}`;
      }
  
      // Filter prüfen
      if (this.filterValue && !key.startsWith(this.filterValue)) {
        return; // Überspringen, wenn nicht passend
      }
  
      grouped[key] = (grouped[key] || 0) + 1;
    });
  
    const sortedKeys = Object.keys(grouped).sort();
  
    this.chartLabels = sortedKeys.map((k) => {
  if (this.groupMode === 'day') {
    const date = new Date(k);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  if (this.groupMode === 'month') {
    const [y, m] = k.split('-');
    return `${m}.${y}`;
  }
  if (this.groupMode === 'week') {
    return k;
  }
  return k;
});
  
    this.chartData = sortedKeys.map((k) => grouped[k]);
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

  getColor(mood: string): string {
    const cat = this.categoryMap.get(mood);
    if (!cat) return '#f0f0f0';
    // Falls du Farben pro Mood in der DB speichern willst, kannst du das hier nehmen.
    // Sonst verwenden wir ein Default-Pastell.
    return '#d4edda';
  }
  
  getIcon(mood: string): string {
    const cat = this.categoryMap.get(mood);
    return cat?.emoji || '❓';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
  }
}
