import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
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
import { FilterInputComponent } from '../../../shared/components/filter-input/filter-input.component';
import { FilterDropdownComponent } from '../../../shared/components/filter-dropdown/filter-dropdown.component';
import { FilterCardComponent } from '../../../shared/components/filter-card/filter-card.component';
import {
  CustomTableComponent,
  TableSettings,
} from '../../../shared/components/custom-table/custom-table.component';
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
    FormsModule,
    FilterDropdownComponent,
    FilterInputComponent,
    FilterCardComponent,
    CustomTableComponent,
  ],
  templateUrl: './subcategory-list.component.html',
  styleUrl: './subcategory-list.component.css',
})
export class SubcategoryListComponent implements OnInit, OnDestroy {
  settings: TableSettings = {
    header: {
      text: 'Subcategory List',
      icon: 'bi bi-folder me-2',
      actionButton: {
        text: 'Add Subcategory',
        icon: 'bi bi-plus-lg',
        routerLink: '/subcategories/create',
      },
    },
    columns: [
      { field: 'name', title: 'Subcategory', width: '20%' },
      { field: 'category', title: 'Category', width: '20%' },
      {
        field: 'created',
        title: 'Created At',
        width: '20%',
        type: 'date',
        sortable: true,
        sortKey: 'created',
      },
      {
        field: 'lastModified',
        title: 'Last Modified At',
        width: '20%',
        type: 'date',
        sortable: true,
        sortKey: 'lastmodified',
      },
      { field: 'actions', title: 'Actions', width: '10%' },
    ],
    pagination: {
      enabled: true,
      itemsPerPageOptions: [10, 30, 50, 100],
    },
  };

  subcategoryRequest: SubategoryRequest = {
    skip: 0,
    take: this.settings.pagination?.itemsPerPageOptions?.[0] ?? 10,
    sortDirection: SortOrder.Descending,
    sortBy: 'created',
    name: '',
    categoryId: null,
  };

  data: any[] = [];
  totalCount: number = 0;
  totalPages: number[] = [];
  currentPage: number = 1;
  categoriesDropdownList: any[] = [];
  subcategoryToDelete: any = null;

  constructor(
    private _subcategoryService: SubcategoryService,
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    public router: Router,
    private cd: ChangeDetectorRef
  ) {}

  @ViewChild('subcategoryNameInput') categoryNameInput!: ElementRef;
  private nameChangeSubject = new Subject<string>();
  private nameChangeSubscription!: Subscription;

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
          this.data = response.data.map((sub: any) => ({
            ...sub,
            view: () => this.router.navigate(['subcategories', sub.id]),
            edit: () => this.router.navigate(['subcategories/edit', sub.id]),
            delete: () => this.showDeleteSubcategoryModal(sub),
          }));

          this.cd.detectChanges();
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

  onSortChange(e: { sortBy: string; sortDirection: SortOrder }): void {
    this.subcategoryRequest.sortBy = e.sortBy;
    this.subcategoryRequest.sortDirection = e.sortDirection;
    this.currentPage = 1;
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
