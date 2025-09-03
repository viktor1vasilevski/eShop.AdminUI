import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-input',
  imports: [FormsModule],
  templateUrl: './filter-input.component.html',
  styleUrl: './filter-input.component.css',
})
export class FilterInputComponent {
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() id!: string;
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
}
