import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Subject,
  Subscription,
} from 'rxjs';
import { SubcategoryService } from '../../../core/services/subcategory.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CategoryService } from '../../../core/services/category.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { FilterInputComponent } from '../../../shared/components/filter-input/filter-input.component';
import { FilterDropdownComponent } from '../../../shared/components/filter-dropdown/filter-dropdown.component';
import { FilterCardComponent } from '../../../shared/components/filter-card/filter-card.component';
declare var bootstrap: any;

export interface SubategoryRequest {
  skip: number;
  take: number;
  sortDirection: SortOrder;
  sortBy: string;
  name: string;
  categoryId: string | null;
}

@Component({
  selector: 'app-subcategory-list',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    PaginationComponent,
    FilterDropdownComponent,
    FilterInputComponent,
    FilterCardComponent,
  ],
  templateUrl: './subcategory-list.component.html',
  styleUrl: './subcategory-list.component.css',
})
export class SubcategoryListComponent implements OnInit, OnDestroy {
  subcategoryRequest: SubategoryRequest = {
    skip: 0,
    take: 10,
    sortDirection: SortOrder.Descending,
    sortBy: 'created',
    name: '',
    categoryId: null,
  };

  categoriesDropdownList: any[] = [];
  subcategoryToDelete: any = null;

  constructor(
    private _subcategoryService: SubcategoryService,
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    public router: Router
  ) {}

  @ViewChild('subcategoryNameInput') categoryNameInput!: ElementRef;
  private nameChangeSubject = new Subject<string>();
  private nameChangeSubscription!: Subscription;

  totalCount: number = 0;
  totalPages: number[] = [];
  subcategories: any[] = [];
  currentPage: number = 1;

  ngOnDestroy(): void {
    this.nameChangeSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {});

    this.loadCategoriesDropdownList();
    this.loadSubcategories();

    this.nameChangeSubscription = this.nameChangeSubject
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
          this.subcategories = response.data;
          this.totalCount =
            typeof response?.totalCount === 'number' ? response.totalCount : 0;
          this.calculateTotalPages();
        },
        error: (errorResponse: any) =>
          this._errorHandlerService.handleErrors(errorResponse),
      });
  }

  loadCategoriesDropdownList() {
    this._categoryService.getCategoriesDropdownList().subscribe({
      next: (response: any) => {
        this.categoriesDropdownList = response.data.map((cat: any) => ({
          id: cat.categoryId,
          name: cat.name,
        }));
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
          this.loadSubcategories();
          this._notificationService.notify(
            response.notificationType,
            response.message
          );
        },
        error: (errorResponse: any) =>
          this._errorHandlerService.handleErrors(errorResponse),
      });
    this.closeModal();
  }

  calculateTotalPages(): void {
    const pages = Math.ceil(this.totalCount / this.subcategoryRequest.take);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }

  onCategoryChange(selectedValue: any): void {
    this.subcategoryRequest.categoryId = selectedValue;
    this.subcategoryRequest.skip = 0;
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
    this.subcategoryRequest.categoryId = '';
    this.subcategoryRequest.skip = 0;
    this.onFilterChange();
    this.loadSubcategories();
  }
}
