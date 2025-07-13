import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from 'src/app/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})

export class CategoriesComponent implements OnInit {
  moods: Category[] = [];
  activities: Category[] = [];
  newMoodEmoji = '';
  newMoodText = '';
  newActivity = '';

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
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

  addMood(): void {
    if (this.newMoodEmoji.trim() && this.newMoodText.trim()) {
      const newCategory: Category = {
        id: 0, // ID wird vom Backend vergeben
        text: this.newMoodText.trim(),
        emoji: this.newMoodEmoji.trim(),
        color: '',
        type: 'mood'
      };

      this.categoryService.createCategory(newCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.newMoodEmoji = '';
          this.newMoodText = '';
        },
        error: (err) => console.error('Fehler beim Hinzufügen der Stimmung:', err)
      });
    }
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

  editMood(mood: Category) {
    const newEmoji = prompt('Emoji ändern:', mood.emoji);
    const newText = prompt('Text ändern:', mood.text);
    const newColor = prompt('Farbe ändern (Hex Code oder Name):', mood.color);
  
    if (newEmoji && newText && newColor) {
      const updatedMood = {
        ...mood,
        emoji: newEmoji.trim(),
        text: newText.trim(),
        color: newColor.trim()
      };
  
      this.categoryService.updateCategory(updatedMood.id, updatedMood).subscribe({
        next: () => {
          const index = this.moods.findIndex(m => m.id === mood.id);
          if (index > -1) {
            this.moods[index] = updatedMood;
          }
        },
        error: (err) => console.error('Fehler beim Aktualisieren der Stimmung:', err)
      });
    }
  }
  

  editActivity(activity: Category): void {
    const newText = prompt('Neue Beschreibung eingeben:', activity.text);
    if (newText !== null && newText.trim()) {
      const updatedCategory: Category = { ...activity, text: newText.trim() };
      this.categoryService.updateCategory(activity.id, updatedCategory).subscribe({
        next: () => this.loadCategories(),
        error: (err) => console.error('Fehler beim Bearbeiten der Aktivität:', err)
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
      error: (err) => console.error('Fehler beim Löschen der Stimmung:', err)
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
}