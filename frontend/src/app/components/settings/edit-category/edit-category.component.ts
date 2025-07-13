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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
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
  }

  save(): void {
    this.categoryService.updateCategory(this.category.id, this.category).subscribe({
      next: () => {
        alert('Kategorie aktualisiert!');
        this.router.navigate(['/settings']);
      },
      error: (err) => console.error('Fehler beim Speichern:', err)
    });
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