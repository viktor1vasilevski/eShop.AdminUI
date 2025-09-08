import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-details',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css',
})
export class CategoryDetailsComponent implements OnInit {
  categoryId: any;
  category: any = null;

  // searches
  globalSearch = '';
  subcategorySearch = '';

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
        if (res?.data) {
          this.category = res.data;

          // overwrite with dummy data
          this.category.subcategories = [];

          for (let i = 1; i <= 50; i++) {
            const subcategory = {
              id: i,
              name: `Subcategory ${i}`,
              products: [] as any[],
            };

            for (let j = 1; j <= 20; j++) {
              subcategory.products.push({
                id: i * 1000 + j,
                name: `Product ${i}-${j}`,
              });
            }

            this.category.subcategories.push(subcategory);
          }
        }
      },
      error: (err: any) => this._errorHandlerService.handleErrors(err),
    });
  }

  // --- helpers ---
  getFilteredSubcategories() {
    const list = this?.category?.subcategories || [];
    const term = (this.subcategorySearch || '').toLowerCase().trim();
    if (!term) return list;
    return list.filter((sc: any) =>
      (sc?.name || '').toLowerCase().includes(term)
    );
  }

  private getFilterTerm(sc: any): string {
    return (this.globalSearch || sc?._search || '').toLowerCase().trim();
  }

  getFilteredProducts(sc: any) {
    if (!sc?.products) return [];
    const term = this.getFilterTerm(sc);
    const list = term
      ? sc.products.filter((p: any) =>
          (p?.name || '').toLowerCase().includes(term)
        )
      : sc.products;

    return sc.showAllProducts ? list : list.slice(0, 12);
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

  getTotalFilteredCount(): number {
    const subs = this?.category?.subcategories || [];
    if (!subs.length) return 0;
    const term = (this.globalSearch || '').toLowerCase().trim();
    if (!term)
      return subs.reduce(
        (acc: number, s: any) => acc + (s?.products?.length || 0),
        0
      );

    return subs.reduce((acc: number, s: any) => {
      const count = (s?.products || []).filter((p: any) =>
        (p?.name || '').toLowerCase().includes(term)
      ).length;
      return acc + count;
    }, 0);
  }

  getVisibleCount(sc: any) {
    const totalFiltered = this.getFilteredCount(sc);
    return sc.showAllProducts ? totalFiltered : Math.min(totalFiltered, 12);
  }

  // wire your delete to a service as needed
  deleteProduct(p: any) {
    if (confirm(`Delete ${p?.name}?`)) {
      console.log('Delete', p);
      // this._productService.delete(p.id).subscribe(...)
    }
  }
}
