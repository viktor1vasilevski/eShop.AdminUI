import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';

type Option = { id: any; name: string };

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [CommonModule], // for *ngFor
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.css'],
})
export class FilterDropdownComponent {
  // inputs
  label = input.required<string>();
  id = input.required<string>();
  options = input<Option[]>([]);
  defaultText = input<string>('Select');

  // two-way bindable selected value (supports [(selected)])
  selected = model<any | null>(null);

  // optional event if parent wants a side-effect hook
  selectedChange = output<any>();

  onChange(event: Event) {
    const el = event.target as HTMLSelectElement;
    const raw = el.value;

    // Coerce to the id’s runtime type (number/bool/string) based on your options
    const next = this.coerceId(raw);
    this.selected.set(next);
    this.selectedChange.emit(next);
  }

  private coerceId(raw: string): any {
    const opts = this.options();
    if (!opts.length) return raw;
    const sample = opts[0].id;

    if (typeof sample === 'number') {
      const n = Number(raw);
      return Number.isNaN(n) ? null : n;
    }
    if (typeof sample === 'boolean') {
      return raw === 'true';
    }
    // default: string or other primitive
    return raw === '' ? null : raw;
  }
}
