import { Component, ElementRef, ViewChild } from '@angular/core';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CategoryService } from '../../../core/services/category.service';
import { Subject } from 'rxjs';

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
  styleUrl: './category-list.component.css'
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

  constructor(
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
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

  test() {
    this.router.navigate(['/categories/create'])
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.categoryRequest.take = itemsPerPage;
    this.categoryRequest.skip = 0;
    this.currentPage = 1;
    this.loadCategories();
  }
}
