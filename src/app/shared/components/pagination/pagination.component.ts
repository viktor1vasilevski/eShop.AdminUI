import { Component, computed, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  totalPages = input<number[]>([]);
  itemsPerPageOptions = input<number[]>([5, 10, 15, 20]);

  currentPage = model<number>(1);
  itemsPerPage = model<number>(10);

  pageChange = output<number>();
  itemsPerPageChange = output<number>();

  isFirst = computed(() => this.currentPage() === 1);
  isLast = computed(() => this.currentPage() === this.totalPages().length);

  changePage(page: number): void {
    const max = this.totalPages().length || 1;
    if (page >= 1 && page <= max) {
      this.currentPage.set(page);
      this.pageChange.emit(page);
    }
  }

  setItemsPerPage(v: number): void {
    this.itemsPerPage.set(v);
    this.itemsPerPageChange.emit(v);
  }
}
