import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { ProductService } from '../../../core/services/product.service';
import { SubcategoryService } from '../../../core/services/subcategory.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
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
  imports: [CommonModule, RouterLink, FormsModule, PaginationComponent],
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

  products: any[] = [];
  subcategoriesDropdownList: any[] = [];
  totalCount: number = 0;
  totalPages: number[] = [];
  currentPage: number = 1;
  productToDelete: any = null;
  constructor(
    public router: Router,
    private _productService: ProductService,
    private _subcategoryService: SubcategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    //this.loadSubcategoriesDropdownList();
    this.loadProducts();
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

  loadSubcategoriesDropdownList() {
    this._subcategoryService.getSubcategoriesDropdownList().subscribe({
      next: (response: any) => {
        this.subcategoriesDropdownList = response.data;
      },
      error: (errorResponse: any) =>
        this._errorHandlerService.handleErrors(errorResponse),
    });
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
  onFilterChange() {}

  toggleSortOrder(sortedBy: string) {
    this.productRequest.sortDirection =
      this.productRequest.sortDirection === SortOrder.Ascending
        ? SortOrder.Descending
        : SortOrder.Ascending;
    this.productRequest.sortBy = sortedBy;
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
}
