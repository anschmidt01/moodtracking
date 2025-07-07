import { Component, Output, EventEmitter, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MoodService, MoodEntry } from 'src/app/services/mood.service';

@Component({
  selector: 'app-add-entry',
  standalone : false, 
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent {
  emotions = [
    { value: 'terrible', label: 'Schrecklich', icon: '😞', color: '#f44336' },
    { value: 'bad', label: 'Schlecht', icon: '😟', color: '#e57373' },
    { value: 'okay', label: 'Okay', icon: '😐', color: '#ffb74d' },
    { value: 'good', label: 'Gut', icon: '🙂', color: '#81c784' },
    { value: 'great', label: 'Fantastisch', icon: '😄', color: '#4caf50' },
  ];

  activities = ['Arbeit', 'Sport', 'Entspannen', 'Rausgehen'];

  selectedEmotion = signal<string | null>(null);
  selectedActivities = signal<string[]>([]);
  note = signal<string>('');

  @Output() entrySaved = new EventEmitter<any>();

  selectEmotion(emotion: string) {
    this.selectedEmotion.set(emotion);
  }

  toggleActivity(activity: string) {
    const current = this.selectedActivities();
    if (current.includes(activity)) {
      this.selectedActivities.set(current.filter(a => a !== activity));
    } else {
      this.selectedActivities.set([...current, activity]);
    }
  }

  onNoteInput(event: Event) {
    const target = event.target as HTMLTextAreaElement | null;
    if (target) {
      this.note.set(target.value);
    }
  }

  saveEntry() {
    if (!this.selectedEmotion()) {
      alert('Bitte gib an wie du dich heute fühlst.');
      return;
    }

    const entry = {
      emotion: this.selectedEmotion(),
      activities: this.selectedActivities(),
      note: this.note().trim(),
      date: new Date(),
    };

    this.entrySaved.emit(entry);

    this.selectedEmotion.set(null);
    this.selectedActivities.set([]);
    this.note.set('');
  }
}