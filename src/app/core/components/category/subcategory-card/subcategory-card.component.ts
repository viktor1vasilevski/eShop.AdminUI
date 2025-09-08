import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FilterInputComponent } from '../../../../shared/components/filter-input/filter-input.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-subcategory-card',
  imports: [CommonModule, RouterLink, FilterInputComponent],
  standalone: true,
  templateUrl: './subcategory-card.component.html',
  styleUrl: './subcategory-card.component.css',
})
export class SubcategoryCardComponent {
  subcategory = input<any>(null);
  globalSearch = input<string>('');
  pageSize = input<number>(12);

  // local per-subcategory search & expand state
  subSearch = signal<string>('');
  expanded = signal<boolean>(false);

  // derived
  private term = computed(() =>
    (this.globalSearch() || this.subSearch() || '').toLowerCase().trim()
  );

  filteredProducts = computed(() => {
    const sc = this.subcategory();
    const items = (sc?.products ?? []) as Array<{ id: any; name: string }>;
    const t = this.term();
    return t
      ? items.filter((p) => (p.name ?? '').toLowerCase().includes(t))
      : items;
  });

  visibleProducts = computed(() =>
    this.expanded()
      ? this.filteredProducts()
      : this.filteredProducts().slice(0, this.pageSize())
  );

  visibleCount = computed(() =>
    this.expanded()
      ? this.filteredProducts().length
      : Math.min(this.filteredProducts().length, this.pageSize())
  );

  // events
  editSubcategory = output<any>();
  deleteProduct = output<any>();
}
