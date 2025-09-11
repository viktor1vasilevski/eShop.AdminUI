import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubcategoryCardComponent } from '../../../core/components/category/subcategory-card/subcategory-card.component';
import { SubcategoriesHeaderComponent } from '../../../core/components/category/subcategories-header/subcategories-header.component';

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

  // ---- filtering (for header counts and list of cards) ----
  getFilteredSubcategories() {
    if (!this.category?.subcategories) return [];

    const term = this.subcategorySearch?.toLowerCase().trim();
    if (!term) return this.category.subcategories;

    return this.category.subcategories.filter((sub: any) =>
      sub.name.toLowerCase().includes(term)
    );
  }

  getTotalFilteredCount(): number {
    const subs = this?.category?.subcategories || [];
    if (!subs.length) return 0;
    const term = (this.globalSearch || '').toLowerCase().trim();
    if (!term)
      return subs.reduce(
        (acc: number, s: any) => acc + (s?.products?.length || 0),
        0
      );
    return subs.reduce(
      (acc: number, s: any) =>
        acc +
        (s?.products || []).filter((p: any) =>
          (p?.name || '').toLowerCase().includes(term)
        ).length,
      0
    );
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
}
