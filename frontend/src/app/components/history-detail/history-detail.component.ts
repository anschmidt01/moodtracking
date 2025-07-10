import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoodService, MoodEntry } from 'src/app/services/mood.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-history-detail',
  standalone: false,
  templateUrl: './history-detail.component.html',
  styleUrls:['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit {
  entry: MoodEntry | undefined;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private moodService: MoodService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.moodService.getMoods().subscribe({
      next: (entries) => {
        this.entry = entries.find(e => e.id === Number(id));
      },
      error: (err) => console.error('Fehler beim Laden:', err)
    });
  }

  deleteEntry() {
    if (!this.entry?.id) {
      alert('Eintrag hat keine ID und kann nicht gelöscht werden.');
      return;
    }
  
    if (confirm('Möchtest du diesen Eintrag wirklich löschen?')) {
      this.moodService.deleteMood(this.entry.id).subscribe({
        next: () => {
          alert('Eintrag gelöscht');
          this.router.navigate(['/history']);
        },
        error: (err) => console.error('Fehler beim Löschen:', err)
      });
    }
  }
  getColor(mood?: string): string {
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
  
  getIcon(mood?: string): string {
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
  
  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  formatTime(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('de-DE');
  }
  delete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eintrag löschen',
        message: 'Möchtest du diesen Eintrag wirklich löschen?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.entry?.id) {
        this.moodService.deleteMood(this.entry.id).subscribe({
          next: () => this.router.navigate(['/history']),
          error: (err) => console.error('Fehler beim Löschen:', err),
        });
      }
    });
  }
  
}
