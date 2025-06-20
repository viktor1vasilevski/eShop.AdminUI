import { Component, ElementRef, ViewChild } from '@angular/core';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CategoryService } from '../../../core/services/category.service';
import { debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';
declare var bootstrap: any;

export interface CategoryRequest {
  skip: number;
  take: number;
  sortDirection: SortOrder;
  sortBy: string;
  name: string;
}

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, RouterLink, FormsModule, PaginationComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent {
  categoryRequest: CategoryRequest = {
    skip: 0,
    take: 10,
    sortDirection: SortOrder.Descending,
    sortBy: 'created',
    name: '',
  };

  @ViewChild('categoryNameInput') categoryNameInput!: ElementRef;
  private nameChangeSubject = new Subject<string>();

  totalCount: number = 0;
  totalPages: number[] = [];
  categories: any[] = [];
  currentPage: number = 1;
  categoryToDelete: any = null;

  constructor(
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    public router: Router
  ) {
    this._categoryService.categoryAddedOrEdited$.subscribe(
      (status) => status && this.loadCategories()
    );
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {});

    this.loadCategories();

    this.nameChangeSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.categoryRequest.skip = 0;
        this.loadCategories();
      });
  }

  loadCategories() {
    this._categoryService.getCategories(this.categoryRequest).subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          this.categories = response.data;
          this.totalCount =
            typeof response?.totalCount === 'number' ? response.totalCount : 0;
          this.calculateTotalPages();
        } else {
          this._notificationService.error(response.message || '');
        }
      },
      error: (errorResponse: any) =>
        this._errorHandlerService.handleErrors(errorResponse),
    });
  }

  showDeleteCategoryModal(category: any) {
    this.categoryToDelete = category;
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  toggleSortOrder(sortedBy: string) {
    if (this.categoryRequest.sortBy === sortedBy) {
      this.categoryRequest.sortDirection =
        this.categoryRequest.sortDirection === SortOrder.Ascending
          ? SortOrder.Descending
          : SortOrder.Ascending;
    } else {
      this.categoryRequest.sortBy = sortedBy;
      this.categoryRequest.sortDirection = SortOrder.Ascending;
    }

    this.loadCategories();
  }

  deleteCategory() {
    this._categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this._notificationService.success(response.message);
          this.loadCategories();
        } else {
          this._notificationService.error(response.message);
        }
      },
      error: (errorResponse: any) =>
        this._errorHandlerService.handleErrors(errorResponse),
    });
    this.closeModal();
  }

  calculateTotalPages(): void {
    const pages = Math.ceil(this.totalCount / this.categoryRequest.take);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }

  onFilterChange(): void {
    this.nameChangeSubject.next(this.categoryRequest.name);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.categoryRequest.skip = (page - 1) * this.categoryRequest.take;
    this.loadCategories();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.categoryRequest.take = itemsPerPage;
    this.categoryRequest.skip = 0;
    this.currentPage = 1;
    this.loadCategories();
  }

  clearFilters(): void {
    this.categoryRequest.name = '';
    this.categoryRequest.skip = 0;
    this.loadCategories();
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
