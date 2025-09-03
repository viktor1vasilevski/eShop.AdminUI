import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-card',
  imports: [],
  templateUrl: './filter-card.component.html',
  styleUrl: './filter-card.component.css',
})
export class FilterCardComponent {
  @Input() title: string = 'Filters';
  @Input() id: string = 'filterBody';
  @Input() collapsed = true;
  @Output() clear = new EventEmitter<void>();
}
