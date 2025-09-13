import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { ProductService } from '../../../core/services/product.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CategoryService } from '../../../core/services/category.service';
import { FilterInputComponent } from '../../../shared/components/filter-input/filter-input.component';
import { FilterDropdownComponent } from '../../../shared/components/filter-dropdown/filter-dropdown.component';
import { FilterCardComponent } from '../../../shared/components/filter-card/filter-card.component';
import {
  CustomTableComponent,
  TableSettings,
} from '../../../shared/components/custom-table/custom-table.component';
declare var bootstrap: any;

export interface ProductRequest {
  name: string;
  categoryId: string | null;
  description: string;
  unitPrice: number;
  unitQuantity: number;
  subcategoryId: string | null;
  skip: number;
  take: number;
  sortDirection: SortOrder;
  sortBy: string;
}

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FilterDropdownComponent,
    FilterInputComponent,
    FilterCardComponent,
    CustomTableComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  data: any[] = [];
  settings: TableSettings = {
    header: {
      text: 'Product List',
      icon: 'bi bi-box-seam icon',
      actionButton: {
        text: 'Add Product',
        icon: 'bi bi-plus-lg',
        routerLink: '/products/create',
      },
    },
    columns: [
      { field: 'name', title: 'Name', width: '15%' },
      { field: 'category', title: 'Category', width: '10%' },
      {
        field: 'unitPrice',
        title: 'Unit Price',
        width: '8%',
        sortable: true,
        sortKey: 'unitPrice',
      },
      {
        field: 'unitQuantity',
        title: 'Unit Quantity',
        width: '8%',
        sortable: true,
        sortKey: 'unitQuantity',
      },
      {
        field: 'created',
        title: 'Created At',
        width: '10%',
        type: 'date',
        sortable: true,
        sortKey: 'created',
      },
      {
        field: 'lastModified',
        title: 'Last Modified At',
        width: '10%',
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

  productRequest: ProductRequest = {
    name: '',
    categoryId: null,
    subcategoryId: null,
    description: '',
    unitPrice: 0,
    unitQuantity: 0,
    skip: 0,
    take: this.settings.pagination?.itemsPerPageOptions?.[0] ?? 10,
    sortDirection: SortOrder.Descending,
    sortBy: 'created',
  };
  private filterChangeSubject = new Subject<string>();

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
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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
      next: (res: any) => {
        if (res?.data.length > 0) {
          this.data = res?.data.map((cat: any) => ({
            ...cat,
            view: () => alert('View ' + cat.name),
            edit: () => this.router.navigate(['products/edit', cat.id]),
            delete: () => this.showDeleteProductModal(cat),
          }));
        } else {
          this.data = [];
        }

        this.cd.detectChanges();
        this.totalCount =
          typeof res?.totalCount === 'number' ? res.totalCount : 0;
        this.calculateTotalPages();
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }

  viewProductDetails(product: any): void {
    this.productDetails = product;
    const modal = document.getElementById('viewProductDetailsModal');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  onSortChange(e: { sortBy: string; sortDirection: SortOrder }): void {
    this.productRequest.sortBy = e.sortBy;
    this.productRequest.sortDirection = e.sortDirection;
    this.currentPage = 1;
    this.productRequest.skip = 0;
    this.loadProducts();
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

  onDropdownItemChange(selectedValue: any, type: string) {
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
        this.loadProducts();
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
    this.productRequest.name = '';
    this.productRequest.categoryId = '';
    this.productRequest.subcategoryId = '';
    this.productRequest.skip = 0;
    this.onFilterChange();
    this.loadProducts();
  }
}
