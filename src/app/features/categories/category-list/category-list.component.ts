import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CategoryService } from '../../../core/services/category.service';
import { debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';
import { FilterInputComponent } from '../../../shared/components/filter-input/filter-input.component';
import { FilterCardComponent } from '../../../shared/components/filter-card/filter-card.component';
import {
  CustomTableComponent,
  TableRow,
  TableSettings,
} from '../../../shared/components/custom-table/custom-table.component';
import { ApiResponse } from '../../../core/models/api-response';
import { CategoryDto } from '../models/category-dto.model';
import { CategoryRequest } from '../models/category-request.model';
declare var bootstrap: any;

@Component({
  selector: 'app-category-list',
  imports: [
    CommonModule,
    FormsModule,
    FilterInputComponent,
    FilterCardComponent,
    CustomTableComponent,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit {
  settings: TableSettings = {
    header: {
      text: 'Category List',
      icon: 'bi bi-folder me-2',
      actionButton: {
        text: 'Add Category',
        icon: 'bi bi-plus-lg',
        routerLink: '/categories/create',
      },
    },
    columns: [
      { field: 'name', title: 'Category', width: '30%' },
      {
        field: 'created',
        title: 'Created At',
        width: '30%',
        type: 'date',
        sortable: true,
        sortKey: 'created',
      },
      {
        field: 'lastModified',
        title: 'Last Modified At',
        width: '30%',
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

  categoryRequest: CategoryRequest = {
    skip: 0,
    take: this.settings.pagination?.itemsPerPageOptions?.[0] ?? 10,
    sortDirection: SortOrder.Descending,
    sortBy: 'created',
    name: '',
  };

  private filterChangeSubject = new Subject<string>();

  data: Array<TableRow> = [];
  totalCount: number = 0;
  totalPages: number[] = [];
  currentPage: number = 1;
  categoryToDelete: any = null;

  constructor(
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    public router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    this.filterChangeSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.categoryRequest.skip = 0;
        this.loadCategories();
      });
  }

  loadCategories() {
    this._categoryService.getCategories(this.categoryRequest).subscribe({
      next: (res: ApiResponse<CategoryDto[]>) => {
        const items = res.data ?? [];
        this.data = items.map((cat: CategoryDto) => ({
          ...cat,
          view: () => this.router.navigate(['categories', cat.id]),
          edit: () => this.router.navigate(['categories/edit', cat.id]),
          delete: () => this.showDeleteCategoryModal(cat),
        }));
        this.cd.detectChanges();
        this.totalCount =
          typeof res?.totalCount === 'number' ? res.totalCount : 0;
        this.calculateTotalPages();
      },
      error: (err: any) => this._errorHandlerService.handleErrors(err),
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

  onSortChange(e: { sortBy: string; sortDirection: SortOrder }): void {
    this.categoryRequest.sortBy = e.sortBy;
    this.categoryRequest.sortDirection = e.sortDirection;
    this.currentPage = 1;
    this.categoryRequest.skip = 0;
    this.loadCategories();
  }

  deleteCategory() {
    this._categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
      next: (response: any) => {
        this.loadCategories();
        this._notificationService.notify(response.status, response.message);
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
    this.filterChangeSubject.next(JSON.stringify(this.categoryRequest));
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
