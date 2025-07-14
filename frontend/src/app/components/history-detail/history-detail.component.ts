import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoodService, MoodEntry } from 'src/app/services/mood.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CategoryService, Category } from 'src/app/services/category.service';

@Component({
  selector: 'app-history-detail',
  standalone: false,
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit {
  entry = signal<MoodEntry | undefined>(undefined);


  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private moodService: MoodService,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.moodService.getMoods().subscribe({
      next: (data) => {
        const found = data.find((e) => e.id === id);
        if (!found) {
          alert('Eintrag nicht gefunden.');
          this.router.navigate(['/history']);
          return;
        }else {
        this.entry.set(found);
      }
    },
      error: (err) => console.error('Fehler beim Laden:', err)
    });
  }

  getColor(mood: Category): string {
    return mood?.color || '#f0f0f0';
  }

  getIcon(mood: Category): string {
    return mood?.emoji || '❓';
  }
  getActivitiesText(): string {
    const current = this.entry();
    if (!current || !current.activities?.length) {
      return 'Keine Aktivitäten';
    }
    return current.activities.map(a => a.text).join(', ');
  }
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  delete(): void {
    const current = this.entry();
    if (current && confirm('Willst du diesen Eintrag wirklich löschen?')) {
      this.moodService.deleteMood(current.id).subscribe({
        next: () => {
          alert('Eintrag gelöscht.');
          this.router.navigate(['/history']);
        },
        error: (err) => console.error('Fehler beim Löschen:', err)
      });
    }
  }
}
