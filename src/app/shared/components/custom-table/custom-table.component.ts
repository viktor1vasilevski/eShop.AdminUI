import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortOrder } from '../../../core/enums/sort-order.enum';

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
  enabled: boolean;
  itemsPerPageOptions?: number[];
}

// Row definition with action functions
export interface TableRow {
  [key: string]: any;
  view?: () => void;
  edit?: () => void;
  delete?: () => void;
}

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationComponent],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css'],
})
export class CustomTableComponent<T extends TableRow = TableRow> {
  // Inputs (signals)
  settings = input.required<TableSettings>();
  data = input<T[]>([]);

  // controlled by parent
  currentPage = input<number>(1);
  totalPages = input<number[]>([]);
  itemsPerPage = input<number>(10);

  sortBy = input<string | null>(null);
  sortDirection = input<SortOrder>(SortOrder.Descending);

  // Outputs (signals)
  pageChange = output<number>();
  itemsPerPageChange = output<number>();
  sortChange = output<{ sortBy: string; sortDirection: SortOrder }>();

  // expose enum in template
  SortOrderRef = SortOrder;

  toggleSort(col: TableColumn) {
    if (!col.sortable) return;
    const key = col.sortKey ?? col.field;

    const next =
      this.sortBy() === key
        ? this.sortDirection() === SortOrder.Ascending
          ? SortOrder.Descending
          : SortOrder.Ascending
        : SortOrder.Ascending;

    this.sortChange.emit({ sortBy: key, sortDirection: next });
  }
}
