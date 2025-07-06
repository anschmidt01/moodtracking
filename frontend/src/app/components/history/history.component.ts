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

  ngOnInit(): void {
    this.moods = this.moodService.getMoods();
  }
}
