import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-dropdown',
  imports: [FormsModule, CommonModule],
  templateUrl: './filter-dropdown.component.html',
  styleUrl: './filter-dropdown.component.css',
})
export class FilterDropdownComponent<T extends { id: any; name: string }> {
  @Input() label!: string;
  @Input() id!: string;
  @Input() options: T[] = [];
  @Input() selected: any;
  @Input() defaultText = 'Select';
  @Output() selectedChange = new EventEmitter<any>();
}
