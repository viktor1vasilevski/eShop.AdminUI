import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-create',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css',
})
export class CategoryCreateComponent {
  categoryName: string = '';

  constructor(private router: Router) {}

  createCategory() {
    // Call your API here
    console.log('Category Created:', this.categoryName);
    this.router.navigate(['/categories']);
  }

  cancel() {
    this.router.navigate(['/categories']);
  }
}
