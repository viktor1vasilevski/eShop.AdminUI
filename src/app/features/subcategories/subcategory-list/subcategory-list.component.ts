import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { Subject } from 'rxjs';
import { SubcategoryService } from '../../../core/services/subcategory.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { errorContext } from 'rxjs/internal/util/errorContext';
import { CategoryService } from '../../../core/services/category.service';

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

  constructor(
    private _subcategoryService: SubcategoryService,
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService
  ) {}

  @ViewChild('subcategoryNameInput') categoryNameInput!: ElementRef;
  private nameChangeSubject = new Subject<string>();

  totalCount: number = 0;
  totalPages: number[] = [];
  subcategories: any[] = [];
  currentPage: number = 1;

  ngOnInit(): void {
    this.loadSubcategories();
    this.loadCategoriesDropdownList();
  }

  loadSubcategories() {
    this._subcategoryService
      .getSubcategories(this.subcategoryRequest)
      .subscribe({
        next: (response: any) => {
          if (response && response.success && response.data) {
            this.subcategories = response.data;
          } else {
            this._notificationService.error(response.message);
          }
        },
        error: (errorResponse: any) => this._errorHandlerService.handleErrors(errorResponse)
      });
  }

  loadCategoriesDropdownList() {
    this._categoryService.getCategoriesDropdownList().subscribe({
      next: (response: any) => {
        if(response && response.success && response.data) {
          this.categoriesDropdownList = response.data;
        } else {
          this._notificationService.error(response.message);
        }
      },
      error: (errorResponse: any) => this._errorHandlerService.handleErrors(errorResponse),
    })
  }

  addSubcategory() {}

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

  onFilterChange(): void {
    this.nameChangeSubject.next(this.subcategoryRequest.name);
  }
}
