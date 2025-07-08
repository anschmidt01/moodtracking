import { Component, OnInit } from '@angular/core';
import { MoodService, MoodEntry } from 'src/app/services/mood.service';

@Component({
  selector: 'app-history',
  standalone : false, 
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit {
  moods: MoodEntry[] = [];

  constructor(private moodService: MoodService) {}

  ngOnInit() {
    this.moodService.getMoods().subscribe({
      next: (data) => {
        this.moods = data;
        console.log('Geladene Einträge:', this.moods);
      },
      error: (err) => {
        console.error('Fehler beim Laden:', err);
      }
    });
  }
}
