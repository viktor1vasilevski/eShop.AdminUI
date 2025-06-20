import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';
import { SubcategoryService } from '../../../core/services/subcategory.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CategoryService } from '../../../core/services/category.service';
declare var bootstrap: any;

export interface SubategoryRequest {
  skip: number;
  take: number;
  sortDirection: SortOrder;
  sortBy: string;
  name: string;
  categoryId: string;
}

@Component({
  selector: 'app-subcategory-list',
  imports: [CommonModule, RouterLink, FormsModule, PaginationComponent],
  templateUrl: './subcategory-list.component.html',
  styleUrl: './subcategory-list.component.css',
})
export class SubcategoryListComponent implements OnInit {
  subcategoryRequest: SubategoryRequest = {
    skip: 0,
    take: 10,
    sortDirection: SortOrder.Descending,
    sortBy: 'created',
    name: '',
    categoryId: '',
  };

  categoriesDropdownList: any[] = [];
  subcategoryToDelete: any = null;

  constructor(
    private _subcategoryService: SubcategoryService,
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    public router: Router
  ) {
    this._subcategoryService.subcategoryAddedOrEdited$.subscribe(
      (status) => status && this.loadSubcategories()
    );
  }

  @ViewChild('subcategoryNameInput') categoryNameInput!: ElementRef;
  private nameChangeSubject = new Subject<string>();

  totalCount: number = 0;
  totalPages: number[] = [];
  subcategories: any[] = [];
  currentPage: number = 1;

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {});

    this.loadCategoriesDropdownList();
    this.loadSubcategories();

    this.nameChangeSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.subcategoryRequest.skip = 0;
        this.loadSubcategories();
      });
  }

  loadSubcategories() {
    this._subcategoryService
      .getSubcategories(this.subcategoryRequest)
      .subscribe({
        next: (response: any) => {
          response && response.success && response.data
            ? (this.subcategories = response.data)
            : this._notificationService.error(response.message);
        },
        error: (errorResponse: any) =>
          this._errorHandlerService.handleErrors(errorResponse),
      });
  }

  loadCategoriesDropdownList() {
    this._categoryService.getCategoriesDropdownList().subscribe({
      next: (response: any) => {
        response && response.success && response.data
          ? (this.categoriesDropdownList = response.data)
          : this._notificationService.error(response.message);
      },
      error: (errorResponse: any) =>
        this._errorHandlerService.handleErrors(errorResponse),
    });
  }

  deleteSubcategory() {
    this._subcategoryService
      .deleteSubcategory(this.subcategoryToDelete.id)
      .subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this._notificationService.success(response.message);
            this.loadSubcategories();
          } else {
            this._notificationService.error(response.message);
          }
        },
        error: (errorResponse: any) =>
          this._errorHandlerService.handleErrors(errorResponse),
      });
    this.closeModal();
  }

  onCategoryChange(event: any) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.subcategoryRequest.categoryId = selectedValue;
    this.loadSubcategories();
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
    this.subcategoryToDelete = null;
  }

  showDeleteSubcategoryModal(subcategory: any) {
    this.subcategoryToDelete = subcategory;
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  onFilterChange(): void {
    this.nameChangeSubject.next(this.subcategoryRequest.name);
  }

  editSubcategory(id: any) {}

  changePage(page: number): void {
    this.currentPage = page;
    this.subcategoryRequest.skip = (page - 1) * this.subcategoryRequest.take;
    this.loadSubcategories();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.subcategoryRequest.take = itemsPerPage;
    this.subcategoryRequest.skip = 0;
    this.currentPage = 1;
    this.loadSubcategories();
  }

  toggleSortOrder(sortedBy: string) {
    if (this.subcategoryRequest.sortBy === sortedBy) {
      this.subcategoryRequest.sortDirection =
        this.subcategoryRequest.sortDirection === SortOrder.Ascending
          ? SortOrder.Descending
          : SortOrder.Ascending;
    } else {
      this.subcategoryRequest.sortBy = sortedBy;
      this.subcategoryRequest.sortDirection = SortOrder.Ascending;
    }

    this.loadSubcategories();
  }

  clearFilters(): void {
    this.subcategoryRequest.name = '';
    this.subcategoryRequest.categoryId = ''
    this.loadSubcategories();
  }
}
