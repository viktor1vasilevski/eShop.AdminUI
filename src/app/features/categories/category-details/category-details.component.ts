import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-details',
  imports: [CommonModule],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css',
})
export class CategoryDetailsComponent implements OnInit {
  categoryId: any;
  category: any;
  constructor(
    private route: ActivatedRoute,
    private _categoryService: CategoryService,
    private _errorHandlerService: ErrorHandlerService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.categoryId = params['id'];
      this.loadCategoryDetails();
    });
  }

  loadCategoryDetails() {
    this._categoryService.getCategoryById(this.categoryId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.category = res.data;
          console.log(this.category);
        }
      },
      error: (err: any) => this._errorHandlerService.handleErrors(err),
    });
  }

  viewSubcategory(sc: { id: string; name: string }) {
    // navigate using the ID, but the UI doesn't display it
    // this.router.navigate(['/subcategories', sc.id]);
  }

  viewProduct(p: { id: string; name: string }) {
    // this.router.navigate(['/products', p.id]);
  }

  editCategory() {
    // this.router.navigate(['/categories/edit', this.category.id]);
  }
}
