import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-details',
  standalone: true, // ✅ important when importing standalone children
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css',
})
export class CategoryDetailsComponent implements OnInit {
  categoryId: any;
  category: any = null;

  // searches (bound to header component)
  globalSearch = '';
  subcategorySearch = '';

  // page size used in visible count helper (keep in sync with child default if needed)
  private readonly pageSize = 12;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // ✅ needed for onEditSubcategory
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
        if (res?.data) {
          this.category = res.data;
          console.log(this.category);
        }
      },
      error: (err: any) => this._errorHandlerService.handleErrors(err),
    });
  }

  // ---- child events ----
  onEditSubcategory(sc: any) {
    this.router.navigate(['/subcategories', sc.id]);
  }

  deleteProduct(p: any) {
    if (confirm(`Delete ${p?.name}?`)) {
      console.log('Delete', p);
      // this._productService.delete(p.id).subscribe(...)
    }
  }

  // (Optional) helpers below were used in the old inline list; safe to remove if not referenced:
  private getFilterTerm(sc: any): string {
    return (this.globalSearch || sc?._search || '').toLowerCase().trim();
  }

  getFilteredCount(sc: any) {
    if (!sc?.products) return 0;
    const term = this.getFilterTerm(sc);
    return term
      ? sc.products.filter((p: any) =>
          (p?.name || '').toLowerCase().includes(term)
        ).length
      : sc.products.length;
  }

  getVisibleCount(sc: any) {
    const totalFiltered = this.getFilteredCount(sc);
    return sc.showAllProducts
      ? totalFiltered
      : Math.min(totalFiltered, this.pageSize);
  }

  onDelete(id: string) {}
}
