import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoodService, MoodEntry } from 'src/app/services/mood.service';

@Component({
  selector: 'app-edit-entry',
  standalone: false,
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.scss']
})
export class EditEntryComponent implements OnInit {
  entry: MoodEntry | undefined;

  // Optionen für Stimmung
  emotions = [
    { label: 'Schrecklich', icon: '😞', color: '#fde2e2' },
    { label: 'Schlecht', icon: '😟', color: '#f8d7da' },
    { label: 'Okay', icon: '😐', color: '#fff3cd' },
    { label: 'Gut', icon: '🙂', color: '#d4edda' },
    { label: 'Fantastisch', icon: '😄', color: '#d1e7dd' },
  ];
  

  // Optionen für Aktivitäten
  allActivities = ['Arbeit', 'Sport', 'Entspannen', 'Rausgehen'];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private moodService: MoodService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.moodService.getMoods().subscribe({
      next: (entries) => {
        this.entry = entries.find(e => e.id === Number(id));
        if (!this.entry) {
          alert('Eintrag nicht gefunden.');
          this.router.navigate(['/history']);
        }
      },
      error: (err) => console.error('Fehler beim Laden:', err)
    });
  }

  toggleActivity(activity: string) {
    if (!this.entry) return;
    if (this.entry.activities.includes(activity)) {
      this.entry.activities = this.entry.activities.filter(a => a !== activity);
    } else {
      this.entry.activities = [...this.entry.activities, activity];
    }
  }

  save() {
    if (!this.entry?.id) {
      alert('Keine ID vorhanden.');
      return;
    }

    this.moodService.updateMood(this.entry.id, this.entry).subscribe({
      next: () => {
        alert('Eintrag aktualisiert!');
        this.router.navigate(['/history']);
      },
      error: (err) => console.error('Fehler beim Speichern:', err)
    });
  }
}
