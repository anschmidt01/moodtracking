import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/services/category.service';

@Component({
  selector: 'app-edit-category',
  standalone: false,
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {
  category!: Category;
  isNew = false;        // <----- Das hier hinzugefügt
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      // Bearbeiten
      const id = Number(idParam);
      if (isNaN(id)) {
        alert('Ungültige ID!');
        this.router.navigate(['/settings']);
        return;
      }

      this.categoryService.getCategories().subscribe({
        next: (categories) => {
          const found = categories.find(c => c.id === id);
          if (!found) {
            alert('Kategorie nicht gefunden!');
            this.router.navigate(['/settings']);
            return;
          }
          this.category = { ...found };
        },
        error: (err) => console.error('Fehler beim Laden:', err)
      });
    } else {
      // Neu erstellen
      this.isNew = true;
      this.category = {
        id: 0,
        type: 'mood',
        text: '',
        emoji: '',
        color: '#cccccc'
      };
    }
  }

  save(): void {
    if (this.isNew) {
      this.categoryService.createCategory(this.category).subscribe({
        next: () => {
          alert('Kategorie erstellt!');
          this.router.navigate(['/settings/categories']);
        },
        error: (err) => console.error('Fehler beim Erstellen:', err)
      });
    } else {
      this.categoryService.updateCategory(this.category.id, this.category).subscribe({
        next: () => {
          alert('Kategorie aktualisiert!');
          this.router.navigate(['/settings/categories']);
        },
        error: (err) => console.error('Fehler beim Aktualisieren:', err)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/settings/categories']);
  }


  showEmojiPicker = false;

selectEmoji(event: any) {
  this.category.emoji = event.detail.unicode;
  this.showEmojiPicker = false;
}


}