import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { ProductService } from '../../../core/services/product.service';
import { SubcategoryService } from '../../../core/services/subcategory.service';

export interface ProductRequest {
  skip: number;
  take: number;
  sortDirection: SortOrder;
  sortBy: string;
  brand: string;
}

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink, FormsModule, PaginationComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  productRequest: ProductRequest = {
    skip: 0,
    take: 10,
    sortDirection: SortOrder.Descending,
    sortBy: 'created',
    brand: '',
  };

  products: any[] = [];
  subcategoriesDropdownList: any[] = [];
  totalCount: number = 0;
  totalPages: number[] = [];
  currentPage: number = 1;
  productToDelete: any = null;
  constructor(public router: Router,
    private _productService: ProductService,
    private _subcategoryService: SubcategoryService
  ) {}

  ngOnInit(): void {
    this.loadSubcategoriesDropdownList();
    this.loadProducts();
  }

  loadProducts(){
    this._productService.getProducts(this.productRequest).subscribe({
      next: (response: any) => {
        console.log(response);
        
      },
      error: (errorResponse: any) => {
        console.log(errorResponse);
        
      }
    })
  }

  loadSubcategoriesDropdownList(){
    this._subcategoryService.getSubcategoriesDropdownList().subscribe({
      next: (response: any) => {
        this.subcategoriesDropdownList = response.data;
      },
      error: (errorResponse: any) => {
        console.log(errorResponse);
        
      }
    })
  }

  calculateTotalPages(): void {
    const pages = Math.ceil(this.totalCount / this.productRequest.take);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.productRequest.skip = (page - 1) * this.productRequest.take;
    //this.loadCategories();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.productRequest.take = itemsPerPage;
    this.productRequest.skip = 0;
    this.currentPage = 1;
    //this.loadProducts();
  }
  onFilterChange() {}

  showDeleteProductModal(product: any) {}

  deleteProduct() {}
}
