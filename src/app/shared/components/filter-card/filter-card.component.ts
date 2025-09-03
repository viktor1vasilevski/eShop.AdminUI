import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-filter-card',
  standalone: true,
  templateUrl: './filter-card.component.html',
  styleUrls: ['./filter-card.component.css'],
})
export class FilterCardComponent {
  title = input<string>('Filters');
  id = input<string>('filterBody');

  collapsed = model<boolean>(true);

  clear = output<void>();

  collapseTarget = () => `#${this.id()}`;
  toggle() {
    this.collapsed.update((v) => !v);
  }
}
