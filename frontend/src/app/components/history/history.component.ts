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

  chartLabels: string[] = [];
  chartDatasets: any[] = [];

  constructor(
    private moodService: MoodService,
    private categoryService: CategoryService
  ) {}

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
        // Sortiert nach Datum aufsteigend (alt -> neu)
        const sortedByDate = data.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        // Für Liste unten: neueste zuerst
        this.entries.set([...sortedByDate].reverse());
  
        // Timeline vorbereiten (Diagramm)
        this.prepareTimeline(sortedByDate);
      },
      error: (err) => console.error('Fehler beim Laden der Einträge:', err)
    });
  }
  

  prepareTimeline(sortedEntries: MoodEntry[]) {
    const moods = Array.from(this.categoryMap.values()).filter(c => c.type === 'mood');
    const moodLabelMap = new Map<number, string>(
      moods.map(m => [m.id, `${m.emoji} ${m.text}`])
    );

    // Alle eindeutigen Datumslabels
    const labelsSet = new Set(
      sortedEntries.map(e =>
        new Date(e.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
      )
    );
    this.chartLabels = Array.from(labelsSet);

    // Alle Mood IDs
    const moodIds = moods.map(m => m.id);
    const minId = Math.min(...moodIds);
    const maxId = Math.max(...moodIds);

    // Datasets für jede Stimmung
    this.chartDatasets = [{
      label: 'Stimmungsverlauf',
      type: 'line',
      data: sortedEntries.map(e => e.mood.id),
      fill: false,
      tension: 0.3,
      borderColor: '#3f51b5',
      pointBackgroundColor: '#3f51b5'
    }];
    this.chartLabels = sortedEntries.map(e =>
      new Date(e.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
    );

    // Dynamische Min/Max Y-Achse
    this.chartOptions.scales.y.min = minId;
    this.chartOptions.scales.y.max = maxId;

    // Dynamisches Label Callback
    this.chartOptions.scales.y.ticks.callback = (value: number) =>
      moodLabelMap.get(value) ?? '';
  }

  chartOptions = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Stimmung'
        },
        min: 1,
        max: 8,
        ticks: {
          stepSize: 1,
          callback: (value: number) => String(value)
        }
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  };

  applyFilter(): void {
    this.filterValue.set(this.filterInput().trim());
    this.prepareTimeline(this.entries());
  }

  resetFilter(): void {
    this.filterInput.set('');
    this.filterValue.set('');
    this.prepareTimeline(this.entries());
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
