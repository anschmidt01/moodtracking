import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, Category } from 'src/app/services/category.service';

@Component({
  selector: 'app-edit-category',
  standalone: false,
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {
  
  category!: Category;
  isNew = false;
  showEmojiPicker = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const queryType = this.route.snapshot.queryParamMap.get('type');

    if (idParam) {
      // Bestehende Kategorie laden
      const id = Number(idParam);
      this.categoryService.getCategories().subscribe({
        next: (categories) => {
          const found = categories.find(c => c.id === id);
          if (!found) {
            alert('Kategorie nicht gefunden!');
            this.router.navigate(['/settings/categories']);
            return;
          }
          this.category = { ...found };
          console.log('Geladene Kategorie:', this.category);
        },
        error: (err) => console.error('Fehler beim Laden:', err)
      });
    } else {
      // Neue Kategorie
      this.isNew = true;
      this.category = {
        id: 0,
        text: '',
        emoji: '',
        color: '',
        type: queryType === 'activity' ? 'activity' : 'mood'
      };
      console.log('Neue Kategorie:', this.category);
    }
  }

  save(): void {
    if (this.isNew) {
      this.categoryService.createCategory(this.category).subscribe({
        next: () => {
          alert('Kategorie erstellt!');
          this.router.navigate(['/settings/categories']);
        },
        error: (err) => console.error('Fehler beim Speichern:', err)
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

  selectEmoji(event: any) {
    this.category.emoji = event.detail.unicode;
    this.showEmojiPicker = false;
  }
}
