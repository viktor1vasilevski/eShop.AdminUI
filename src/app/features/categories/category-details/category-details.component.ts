import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';
declare var bootstrap: any;

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css',
})
export class CategoryDetailsComponent implements OnInit {
  categoryId: any;
  category: any = null;
  categoryToDelete: any = null;
  globalSearch = '';
  subcategorySearch = '';

  private readonly pageSize = 12;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _categoryService: CategoryService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService
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

  showDeleteCategoryModal(category: any) {
    this.categoryToDelete = category;
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  deleteCategory() {
    this._categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
      next: (response: any) => {
        this.router.navigate(['/categories']);
        this._notificationService.notify(response.status, response.message);
      },
      error: (errorResponse: any) =>
        this._errorHandlerService.handleErrors(errorResponse),
    });
    this.closeModal();
  }

  closeModal(): void {
    const deleteModalElement = document.getElementById(
      'deleteConfirmationModal'
    );
    if (deleteModalElement) {
      const modalInstance = bootstrap.Modal.getInstance(deleteModalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
    this.categoryToDelete = null;
  }
}
