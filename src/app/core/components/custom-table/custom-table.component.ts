import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  field: string; // the property in your row data
  title: string; // column header text
  type?: 'text' | 'html' | 'data'; // optional type (default text)
  width?: string;
}

export interface TableHeader {
  text: string;
  icon?: string;
}

export interface TableSettings {
  header: TableHeader;
  columns: TableColumn[];
}

@Component({
  selector: 'app-custom-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.css',
})
export class CustomTableComponent<T extends Record<string, any> = any> {
  @Input() settings!: TableSettings;
  @Input() rows: T[] = [];
}
