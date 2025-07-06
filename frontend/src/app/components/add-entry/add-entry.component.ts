import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MoodService, MoodEntry } from 'src/app/services/mood.service';

@Component({
  selector: 'app-add-entry',
  standalone : false, 
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent {
  entry: MoodEntry = {
    date: new Date().toISOString().substring(0,10),
    mood: '',
    activities: [],
    notes: ''
  };

  constructor(private moodService: MoodService, private router: Router) {}

  save() {
    this.moodService.addMood(this.entry);
    this.router.navigate(['/']);
  }
}
