import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartData, ChartOptions } from 'chart.js';

interface MoodStatistic {
  mood: string;
  count: number;
  percentage: number;
}
@Component({
  selector: 'app-statistics',
  standalone : false, 
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
  selectedMood: string | null = null;

  chartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  };

  // Einheitliches Farb-Mapping
  moodColors: Record<string, string> = {
    schrecklich: '#fde2e2',
    schlecht: '#f8d7da',
    okay: '#fff3cd',
    gut: '#d4edda',
    fantastisch: '#d1e7dd'
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStatistics();
    this.loadEntries();
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

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };
  showDetails(entry: any): void {
    console.log('Details angeklickt:', entry);
    // Hier kannst du z.B. ein Modal öffnen oder Routing machen
  }
  
  getEmoji(mood: string): string {
    switch (mood.toLowerCase()) {
      case 'schrecklich':
        return '😞';
      case 'schlecht':
        return '😟';
      case 'okay':
        return '😐';
      case 'gut':
        return '🙂';
      case 'fantastisch':
        return '😄';
      default:
        return '❓';
    }
  }
  
  
  onChartClick(event: any): void {
    const activePoints = event?.active;
    if (activePoints?.length > 0) {
      const index = activePoints[0].index;
      const mood = this.chartData.labels?.[index] as string;
      if (mood) {
        if (this.selectedMood === mood) {
          // Toggle zurück: alles verstecken
          this.selectedMood = null;
          this.filteredEntries = [];
        } else {
          this.selectedMood = mood;
          this.filteredEntries = this.entries.filter(e => e.mood === mood);
        }
      }
    }
  }
  
  
  fetchStatistics(): void {
    this.http.get<{ mood: string; count: number }[]>('http://localhost:3000/statistics').subscribe({
      next: (data) => {
        this.totalCount = data.reduce((sum, item) => sum + item.count, 0);
        this.moodStats = data.map(item => ({
          ...item,
          percentage: this.totalCount > 0 ? +(item.count / this.totalCount * 100).toFixed(1) : 0
        }));
        this.moodStats.sort((a, b) => b.count - a.count);

        this.moodStats.sort((a, b) => {
          if (b.count === a.count) {
            return a.mood.localeCompare(b.mood);
          }
          return b.count - a.count;
        });
        

        // ChartData mit festen Farben
        this.chartData = {
          labels: this.moodStats.map(s => s.mood),
          datasets: [{
            data: this.moodStats.map(s => s.count),
            backgroundColor: this.moodStats.map(s => this.getColor(s.mood))
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

  getColor(mood: string): string {
    const key = mood.toLowerCase();
    return this.moodColors[key] ?? '#cccccc'; // Default fallback
  }
}