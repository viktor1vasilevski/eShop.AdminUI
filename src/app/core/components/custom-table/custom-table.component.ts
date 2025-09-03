import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortOrder } from '../../enums/sort-order.enum';

// Column definition
export interface TableColumn {
  field: string;
  title: string;
  type?: 'text' | 'html' | 'date';
  width?: string;
  sortable?: boolean;
  sortKey?: string;
}

// Optional header button
export interface TableHeader {
  text: string;
  icon?: string;
  actionButton?: {
    text: string;
    icon?: string;
    routerLink?: string;
    click?: () => void;
    class?: string;
  };
}

// Table settings
export interface TableSettings {
  header: TableHeader;
  columns: TableColumn[];
  pagination?: PaginationSettings;
}

export interface PaginationSettings {
  enabled: boolean; // toggle pagination
  itemsPerPageOptions?: number[]; // dropdown options
}

// Row definition with action functions
export interface TableRow {
  [key: string]: any; // any other data fields
  view?: () => void;
  edit?: () => void;
  delete?: () => void;
}

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
})
export class CustomTableComponent<T extends TableRow = TableRow> {
  @Input() settings!: TableSettings;
  @Input() data: T[] = [];

  // controlled by parent
  @Input() currentPage = 1;
  @Input() totalPages: number[] = [];
  @Input() itemsPerPage = 10;

  @Input() sortBy: string | null = null; // current sort key (from parent)
  @Input() sortDirection: SortOrder = SortOrder.Descending;

  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{
    sortBy: string;
    sortDirection: SortOrder;
  }>();

  toggleSort(col: TableColumn) {
    if (!col.sortable) return;
    const key = col.sortKey ?? col.field;

    const next =
      this.sortBy === key
        ? this.sortDirection === SortOrder.Ascending
          ? SortOrder.Descending
          : SortOrder.Ascending
        : SortOrder.Ascending;

    this.sortChange.emit({ sortBy: key, sortDirection: next });
  }
}
