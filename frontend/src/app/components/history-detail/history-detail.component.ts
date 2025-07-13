import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoodService } from 'src/app/services/mood.service';
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
  entry:
    | {
        id: number;
        date: string;
        mood: Category;
        activities: Category[];
        notes: string;
      }
    | undefined;

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
      next: (entries) => {
        const found = entries.find((e) => e.id === id);
        if (!found) {
          alert('Eintrag nicht gefunden.');
          this.router.navigate(['/history']);
          return;
        }
        this.entry = found;
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
    if (!this.entry?.activities?.length) {
      return 'Keine Aktivitäten';
    }
    return this.entry.activities.map(a => a.text).join(', ');
  }
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('de-DE');
  }

  delete(): void {
    if (!this.entry?.id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eintrag löschen',
        message: 'Möchtest du diesen Eintrag wirklich löschen?'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.moodService.deleteMood(this.entry!.id).subscribe({
          next: () => this.router.navigate(['/history']),
          error: (err) => console.error('Fehler beim Löschen:', err)
        });
      }
    });
  }
}
