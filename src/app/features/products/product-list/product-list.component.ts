import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { ProductService } from '../../../core/services/product.service';
import { SubcategoryService } from '../../../core/services/subcategory.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CategoryService } from '../../../core/services/category.service';
declare var bootstrap: any;

export interface ProductRequest {
  brand: string;
  categoryId: string;
  description: string;
  unitPrice: number;
  unitQuantity: number;
  subcategoryId: string;
  skip: number;
  take: number;
  sortDirection: SortOrder;
  sortBy: string;
}

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    PaginationComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  productRequest: ProductRequest = {
    brand: '',
    categoryId: '',
    subcategoryId: '',
    description: '',
    unitPrice: 0,
    unitQuantity: 0,
    skip: 0,
    take: 10,
    sortDirection: SortOrder.Descending,
    sortBy: 'created',
  };
  private filterChangeSubject = new Subject<string>();
  products: any[] = [];
  productDetails: any;
  subcategoriesDropdownList: any[] = [];
  categoriesDropdownList: any[] = [];
  totalCount: number = 0;
  totalPages: number[] = [];
  currentPage: number = 1;
  productToDelete: any = null;
  constructor(
    public router: Router,
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _subcategoryService: SubcategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadSubcategoriesDropdownList();
    this.loadCategoriesDropdownList();
    this.loadProducts();

    this.filterChangeSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.productRequest.skip = 0;
        this.loadProducts();
      });
  }

  loadProducts() {
    this._productService.getProducts(this.productRequest).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.products = response.data;
        } else {
          this._notificationService.error(response.message);
        }
      },
      error: (errorResponse: any) =>
        this._errorHandlerService.handleErrors(errorResponse),
    });
  }

  loadCategoriesDropdownList(): void {
    this._categoryService.getCategoriesDropdownList().subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          this.categoriesDropdownList = response.data;
        } else {
          this._notificationService.error(response.message);
        }
      },
      error: (errorResponse: any) =>
        this._errorHandlerService.handleErrors(errorResponse),
    });
  }

  loadSubcategoriesDropdownList(): void {
    this._subcategoryService.getSubcategoriesDropdownList().subscribe({
      next: (response: any) => {
        this.subcategoriesDropdownList = response.data;
      },
      error: (errorResponse: any) =>
        this._errorHandlerService.handleErrors(errorResponse),
    });
  }

  viewProductDetails(product: any): void {
    this.productDetails = product;
    console.log(this.productDetails);
    
    const modal = document.getElementById('viewProductDetailsModal');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
    
  }

  calculateTotalPages(): void {
    const pages = Math.ceil(this.totalCount / this.productRequest.take);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.productRequest.skip = (page - 1) * this.productRequest.take;
    this.loadProducts();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.productRequest.take = itemsPerPage;
    this.productRequest.skip = 0;
    this.currentPage = 1;
    this.loadProducts();
  }

  onFilterChange(): void {
    this.filterChangeSubject.next(JSON.stringify(this.productRequest));
  }

  toggleSortOrder(sortedBy: string) {
    if (this.productRequest.sortBy === sortedBy) {
      this.productRequest.sortDirection =
        this.productRequest.sortDirection === SortOrder.Ascending
          ? SortOrder.Descending
          : SortOrder.Ascending;
    } else {
      this.productRequest.sortBy = sortedBy;
      this.productRequest.sortDirection = SortOrder.Ascending;
    }

    this.loadProducts();
  }

  onDropdownItemChange(event: any, type: string) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    type == 'category'
      ? (this.productRequest.categoryId = selectedValue)
      : (this.productRequest.subcategoryId = selectedValue);

    this.productRequest.skip = 0;
    this.loadProducts();
  }

  showDeleteProductModal(product: any) {
    this.productToDelete = product;
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  deleteProduct() {
    this._productService.deleteProduct(this.productToDelete.id).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this._notificationService.success(response.message);
          this.loadProducts();
        } else {
          this._notificationService.error(response.message);
        }
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
    this.productToDelete = null;
  }

  clearFilters(): void {
    this.productRequest.brand = '';
    this.productRequest.categoryId = '';
    this.productRequest.subcategoryId = '';
    this.productRequest.skip = 0;
    this.onFilterChange();
    this.loadProducts();
  }
}
