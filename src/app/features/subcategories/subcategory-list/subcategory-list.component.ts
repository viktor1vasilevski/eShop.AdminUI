import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { Subject } from 'rxjs';

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

  @ViewChild('subcategoryNameInput') categoryNameInput!: ElementRef;
  private nameChangeSubject = new Subject<string>();

  totalCount: number = 0;
  totalPages: number[] = [];
  subcategories: any[] = [];
  currentPage: number = 1;

  ngOnInit(): void {
    this.loadSubcategories();
  }

  loadSubcategories() {}

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
