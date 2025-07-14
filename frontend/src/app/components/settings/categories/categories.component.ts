import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from 'src/app/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { InfoDialogComponent } from '../../info-dialog/info-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  moods: Category[] = [];
  activities: Category[] = [];
  newActivity = '';

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.moods = categories.filter(c => c.type === 'mood');
        this.activities = categories.filter(c => c.type === 'activity');
      },
      error: (err) => {
        console.error('Fehler beim Laden der Kategorien:', err);
      }
    });
  }

  addActivity(): void {
    if (this.newActivity.trim()) {
      const newCategory: Category = {
        id: 0,
        text: this.newActivity.trim(),
        emoji: '',
        color: '',
        type: 'activity'
      };

      this.categoryService.createCategory(newCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.newActivity = '';
        },
        error: (err) => console.error('Fehler beim Hinzufügen der Aktivität:', err)
      });
    }
  }

  confirmRemoveMood(mood: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Stimmung löschen',
        message: `Möchtest du "${mood.text}" wirklich löschen?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeMood(mood);
      }
    });
  }

  removeMood(mood: Category): void {
    this.categoryService.deleteCategory(mood.id).subscribe({
      next: () => this.loadCategories(),
      error: (err) => {
        console.error('Fehler beim Löschen der Stimmung:', err);
        const message =
          err?.error?.error ||
          'Fehler beim Löschen der Stimmung.';
        this.dialog.open(InfoDialogComponent, {
          data: {
            title: 'Löschen nicht möglich',
            message
          }
        });
      }
    });
  }
  

  confirmRemoveActivity(activity: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Aktivität löschen',
        message: `Möchtest du "${activity.text}" wirklich löschen?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeActivity(activity);
      }
    });
  }

  removeActivity(activity: Category): void {
    this.categoryService.deleteCategory(activity.id).subscribe({
      next: () => this.loadCategories(),
      error: (err) => console.error('Fehler beim Löschen der Aktivität:', err)
    });
  }
  goToSettings(): void {
    this.router.navigate(['/settings']);
  }
  
}
