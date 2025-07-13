// src/app/components/statistics/statistics.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartData, ChartOptions } from 'chart.js';
import { CategoryService, Category } from 'src/app/services/category.service';

interface MoodStatistic {
  mood_id: number;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-statistics',
  standalone: false,
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  moodStats: MoodStatistic[] = [];
  totalCount = 0;
  isLoading = true;
  error: string | null = null;

  entries: any[] = [];
  filteredEntries: any[] = [];
  selectedMoodId: number | null = null;

  categories: Category[] = [];

  chartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  };

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  // Kategorien Map mood_id -> Category
  moodMap = new Map<number, Category>();

  constructor(private http: HttpClient, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.isLoading = true;
  
    // Kategorien laden
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats.filter(c => c.type === 'mood');
  
        // Dann die Statistikdaten laden
        this.fetchStatistics();
        this.loadEntries();
      },
      error: (err) => {
        console.error('Fehler beim Laden der Kategorien:', err);
        this.error = 'Fehler beim Laden der Kategorien: ' + err.message;
        this.isLoading = false;
      }
    });
  }
  

  loadEntries(): void {
    this.http.get<any[]>('http://localhost:3000/moods').subscribe({
      next: (data) => {
        this.entries = data;
        this.filteredEntries = data;
      },
      error: (err) => {
        console.error('Error loading entries:', err);
      }
    });
  }

  fetchStatistics(): void {
    this.http.get<{ mood_id: number; count: number }[]>('http://localhost:3000/statistics').subscribe({
      next: (data) => {
        this.totalCount = data.reduce((sum, item) => sum + item.count, 0);
        this.moodStats = data.map(item => ({
          ...item,
          percentage: this.totalCount > 0 ? +(item.count / this.totalCount * 100).toFixed(1) : 0
        }));
        this.moodStats.sort((a, b) => b.count - a.count);

        this.chartData = {
          labels: this.moodStats.map(s => this.getMoodText(s.mood_id)),
          datasets: [{
            data: this.moodStats.map(s => s.count),
            backgroundColor: this.moodStats.map(s => this.getColor(s.mood_id))
          }]
        };

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
        this.error = 'Fehler beim Laden der Statistik: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  onChartClick(event: any): void {
    const activePoints = event?.active;
    if (activePoints?.length > 0) {
      const index = activePoints[0].index;
      const moodId = this.moodStats[index].mood_id;
      if (moodId) {
        if (this.selectedMoodId === moodId) {
          this.selectedMoodId = null;
          this.filteredEntries = [];
        } else {
          this.selectedMoodId = moodId;
          this.filteredEntries = this.entries.filter(e => e.mood_id === moodId);
        }
      }
    }
  }

  getMoodText(moodId: number): string {
    const cat = this.categories.find(c => c.id === moodId);
    return cat ? cat.text : 'Unbekannt';
  }
  
  getEmoji(moodId: number): string {
    const cat = this.categories.find(c => c.id === moodId);
    return cat?.emoji ?? '❓';
  }
  getColor(moodId: number): string {
    const category = this.categories?.find(c => c.id === moodId);
    return category?.color ?? '#cccccc';
  }
  getLabel(moodId: number): string {
    const category = this.categories?.find(c => c.id === moodId);
    return category?.text ?? 'Unbekannt';
  }
}
