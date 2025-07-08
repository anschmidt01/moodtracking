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
    { value: 'Schrecklich', label: 'Schrecklich', icon: '😞', color: '#f44336' },
    { value: 'Schlecht', label: 'Schlecht', icon: '😟', color: '#e57373' },
    { value: 'Okay', label: 'Okay', icon: '😐', color: '#ffb74d' },
    { value: 'Gut', label: 'Gut', icon: '🙂', color: '#81c784' },
    { value: 'Fantastisch', label: 'Fantastisch', icon: '😄', color: '#4caf50' },
  ];

  activities = ['Arbeit', 'Sport', 'Entspannen', 'Rausgehen'];

  selectedEmotion = signal<string | null>(null);
  selectedActivities = signal<string[]>([]);
  note = signal<string>('');

  @Output() entrySaved = new EventEmitter<any>();

  constructor(private moodService: MoodService, private router: Router) {}

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
  
    const entry: MoodEntry = {
      mood: this.selectedEmotion() as string,
      activities: this.selectedActivities(),
      notes: this.note().trim(),
      date: new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })
    };
  
    this.moodService.saveMood(entry).subscribe({
      next: (response) => {
        console.log('In DB gespeichert:', response);
        alert('Eintrag erfolgreich gespeichert!');
        this.selectedEmotion.set(null);
        this.selectedActivities.set([]);
        this.note.set('');
      },
      error: (err) => {
        console.error('Fehler beim Speichern:', err);
        alert('Fehler beim Speichern des Eintrags.');
      }
    });
  }  
}