import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterInputComponent } from '../../../../shared/components/filter-input/filter-input.component';

@Component({
  selector: 'app-subcategories-header',
  imports: [CommonModule, FormsModule, FilterInputComponent],
  standalone: true,
  templateUrl: './subcategories-header.component.html',
  styleUrl: './subcategories-header.component.css',
})
export class SubcategoriesHeaderComponent {
  // numbers
  totalSubcategories = input<number>(0);
  filteredCount = input<number>(0);
  totalProductMatches = input<number | null>(null);

  // two-way bound search terms (signal models enable [(globalSearch)] syntax)
  globalSearch = model<string>('');
  subcategorySearch = model<string>('');
}
