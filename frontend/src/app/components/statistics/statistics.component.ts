import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoryService } from '../../services/category.service';
import { MoodService } from '../../services/mood.service';

@Component({
  selector: 'app-statistics',
  standalone: false,
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  isLoading = signal(true);
  error = signal<string | null>(null);
  selectedMoodId = signal<number | null>(null);

  categories = signal<any[]>([]);
  moods = signal<any[]>([]);
  entries = signal<any[]>([]); // nur einmal laden

  // Statistik direkt aus entries berechnen
  moodStats = computed(() => {
    const all = this.entries();
    const total = all.length;
    const grouped: Record<number, number> = {};

    all.forEach(entry => {
      const id = entry.mood.id; // aus deinem MoodEntry-Interface
      grouped[id] = (grouped[id] || 0) + 1;
    });

    return Object.entries(grouped).map(([mood_id, count]) => ({
      mood_id: Number(mood_id),
      count,
      percentage: total ? Math.round((count / total) * 100) : 0
    }));
  });

  totalCount = computed(() =>
    this.moodStats().reduce((sum, m) => sum + m.count, 0)
  );

  chartData = computed(() => ({
    labels: this.moodStats().map(s => this.getMoodText(s.mood_id)),
    datasets: [
      {
        data: this.moodStats().map(s => s.count),
        backgroundColor: this.moodStats().map(s => this.getColor(s.mood_id))
      }
    ]
  }));

  filteredEntries = computed(() =>
    this.selectedMoodId()
      ? this.entries().filter(e => e.mood.id === this.selectedMoodId())
      : []
  );

  chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' as const } }
  };

  constructor(
    private categoryService: CategoryService,
    private moodService: MoodService
  ) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => this.error.set(err?.message || 'Fehler beim Laden der Kategorien')
    });

    this.moodService.getMoods().subscribe({
      next: (data) => {
        this.moods.set(data);
        this.entries.set(data); // Einträge = alle Moods
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message || 'Fehler beim Laden der Stimmungseinträge');
        this.isLoading.set(false);
      }
    });
  }

  getColor(moodId: number): string {
    const mood = this.categories().find(c => c.id === moodId && c.type === 'mood');
    return mood?.color || '#ccc';
  }

  getEmoji(moodId: number): string {
    const mood = this.categories().find(c => c.id === moodId && c.type === 'mood');
    return mood?.emoji || '';
  }
  
  getMoodText(moodId: number): string {
    const mood = this.categories().find(c => c.id === moodId && c.type === 'mood');
    return mood?.text || '';
  }

  onChartClick(event: any) {
    const index = event?.active?.[0]?.index;
    if (index !== undefined) {
      const moodId = this.moodStats()[index]?.mood_id;
      this.selectedMoodId.set(moodId ?? null);
    }
  }
}