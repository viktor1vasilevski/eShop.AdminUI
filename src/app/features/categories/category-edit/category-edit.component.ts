import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-edit',
  imports: [FormsModule],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css'
})
export class CategoryEditComponent {
  categoryName: string = '';

  constructor(private router: Router) {}

  editCategory() {
    // Call your API here
    console.log('Category Created:', this.categoryName);
    this.router.navigate(['/categories']);
  }

  cancel() {
    this.router.navigate(['/categories']);
  }
}
