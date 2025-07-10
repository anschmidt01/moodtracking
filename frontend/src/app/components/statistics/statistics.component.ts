import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartData } from 'chart.js';

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
  }

  fetchStatistics(): void {
    this.http.get<{ mood: string; count: number }[]>('http://localhost:3000/statistics').subscribe({
      next: (data) => {
        this.totalCount = data.reduce((sum, item) => sum + item.count, 0);
        this.moodStats = data.map(item => ({
          ...item,
          percentage: this.totalCount > 0 ? +(item.count / this.totalCount * 100).toFixed(1) : 0
        }));

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