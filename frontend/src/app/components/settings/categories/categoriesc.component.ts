import { Component } from '@angular/core';

interface Mood {
  emoji: string;
  text: string;
}

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
  activities: string[] = ['Arbeit', 'Sport', 'Entspannen', 'Rausgehen'];

  moods: Mood[] = [
    { emoji: '😞', text: 'Schrecklich' },
    { emoji: '😕', text: 'Schlecht' },
    { emoji: '😐', text: 'Okay' },
    { emoji: '😊', text: 'Gut' },
    { emoji: '😁', text: 'Fantastisch' }
  ];

  newActivity = '';
  newMoodEmoji = '';
  newMoodText = '';

  addActivity() {
    if (this.newActivity.trim()) {
      this.activities.push(this.newActivity.trim());
      this.newActivity = '';
    }
  }

  removeActivity(activity: string) {
    this.activities = this.activities.filter(a => a !== activity);
  }

  addMood() {
    if (this.newMoodEmoji.trim() && this.newMoodText.trim()) {
      this.moods.push({ emoji: this.newMoodEmoji.trim(), text: this.newMoodText.trim() });
      this.newMoodEmoji = '';
      this.newMoodText = '';
    }
  }

  removeMood(mood: Mood) {
    this.moods = this.moods.filter(m => m !== mood);
  }
}