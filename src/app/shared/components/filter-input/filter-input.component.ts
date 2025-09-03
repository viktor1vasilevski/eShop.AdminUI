import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-filter-input',
  standalone: true,
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.css'],
})
export class FilterInputComponent {
  label = input.required<string>();
  placeholder = input<string>('');
  id = input<string>('filter-' + Math.random().toString(36).slice(2));
  disabled = input<boolean>(false);
  autocomplete = input<string>('off');

  value = model<string>('');

  valueChanged = output<string>();

  onInput(v: string) {
    this.value.set(v);
    this.valueChanged.emit(v);
  }

  clear() {
    this.onInput('');
  }
}
