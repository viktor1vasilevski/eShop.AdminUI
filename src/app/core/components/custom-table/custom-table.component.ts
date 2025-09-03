import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface TableColumn {
  field: string; // the property in your row data
  title: string; // column header text
  type?: 'text' | 'html' | 'date'; // optional type (default text)
  width?: string;
}

export interface TableHeader {
  text: string;
  icon?: string;
  actionButton?: {
    // optional button in the header
    text: string; // button text
    icon?: string; // optional icon class
    routerLink?: string; // optional Angular router link
    click?: () => void; // optional click handler
    class?: string; // optional CSS classes for styling
  };
}

export interface TableSettings {
  header: TableHeader;
  columns: TableColumn[];
}

@Component({
  selector: 'app-custom-table',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.css',
})
export class CustomTableComponent<T extends Record<string, any> = any> {
  @Input() settings!: TableSettings;
  @Input() rows: T[] = [];
}
