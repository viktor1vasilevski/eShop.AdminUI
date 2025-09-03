import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Column definition
export interface TableColumn {
  field: string;
  title: string;
  type?: 'text' | 'html' | 'date';
  width?: string;
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
  imports: [CommonModule, FormsModule, RouterLink],
})
export class CustomTableComponent<T extends TableRow = TableRow> {
  @Input() settings!: TableSettings;
  @Input() data: T[] = [];
}
