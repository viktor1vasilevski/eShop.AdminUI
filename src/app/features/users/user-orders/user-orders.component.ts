import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PdfReportService } from '../../../core/services/pdf-report.service';

export interface OrderRequest {
  skip: number;
  take: number;
  sortBy: string;
  sortDirection: string;
}

@Component({
  selector: 'app-user-orders',
  imports: [CommonModule, PaginationComponent],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css',
})
export class UserOrdersComponent implements OnInit {
  orderRequest: OrderRequest = {
    skip: 0,
    take: 10,
    sortBy: 'created',
    sortDirection: 'desc',
  };

  totalPages: number[] = [];
  currentPage: number = 1;
  totalCount: number = 0;
  userId: string = '';
  orders: any[] = [];
  userInfo:
    | { firstName: string; lastName: string; username: string }
    | undefined;

  constructor(
    private route: ActivatedRoute,
    private _orderService: OrderService,
    private _errorHandlerService: ErrorHandlerService,
    private pdfReportService: PdfReportService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      this.loadUserOrders();
    });
  }

  loadUserOrders() {
    this._orderService
      .getOrdersByUserId(this.userId, this.orderRequest)
      .subscribe({
        next: (response: any) => {
          this.orders = response.data;
          this.totalCount =
            typeof response?.totalCount === 'number' ? response.totalCount : 0;

          if (this.orders.length > 0) {
            const firstOrder = this.orders[0];
            this.userInfo = {
              firstName: firstOrder.firstName,
              lastName: firstOrder.lastName,
              username: firstOrder.username,
            };
          }
          this.calculateTotalPages();
        },
        error: (errorResponse: any) => {
          this._errorHandlerService.handleErrors(errorResponse);
        },
      });
  }

  viewOrderDetails(asd: string) {}

  getGrandTotal(): number {
    return this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  }

  printOrder(order: any) {
    this.pdfReportService.printOrder(order, this.userInfo);
  }

  printAllOrders() {
    this.pdfReportService.printAllOrders(this.orders, this.userInfo);
  }

  calculateTotalPages(): void {
    const pages = Math.ceil(this.totalCount / this.orderRequest.take);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.orderRequest.take = itemsPerPage;
    this.orderRequest.skip = 0;
    this.currentPage = 1;
    this.loadUserOrders();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.orderRequest.skip = (page - 1) * this.orderRequest.take;
    this.loadUserOrders();
  }
}
