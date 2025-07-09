import { Component, OnInit } from '@angular/core';
import { MoodService, MoodEntry } from 'src/app/services/mood.service';

@Component({
  selector: 'app-history',
  standalone: false, 
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  entries: MoodEntry[] = [];

  chartLabels: string[] = [];
  chartData: number[] = [];

  constructor(private moodService: MoodService) {}

  ngOnInit() {
    this.loadEntries();
  }

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
    // Map für Anzahl Einträge pro Kalendertag
    const grouped: { [date: string]: number } = {};
  
    this.entries.forEach((entry) => {
      const date = new Date(entry.date);
      const formatted = date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      grouped[formatted] = (grouped[formatted] || 0) + 1;
    });
  
    // Sortierte Labels und Werte
    this.chartLabels = Object.keys(grouped).sort((a, b) => {
      const dateA = new Date(a.split('.').reverse().join('-'));
      const dateB = new Date(b.split('.').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });
  
    this.chartData = this.chartLabels.map((date) => grouped[date]);
  }

  getColor(mood: string): string {
    switch (mood) {
      case 'Schrecklich':
        return '#fde2e2';
      case 'Schlecht':
        return '#f8d7da';
      case 'Okay':
        return '#fff3cd';
      case 'Gut':
        return '#d4edda';
      case 'Fantastisch':
        return '#d1e7dd';
      default:
        return '#f0f0f0';
    }
  }

  getIcon(mood: string): string {
    switch (mood) {
      case 'Schrecklich':
        return '😞';
      case 'Schlecht':
        return '😟';
      case 'Okay':
        return '😐';
      case 'Gut':
        return '🙂';
      case 'Fantastisch':
        return '😄';
      default:
        return '❓';
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
  }
}
