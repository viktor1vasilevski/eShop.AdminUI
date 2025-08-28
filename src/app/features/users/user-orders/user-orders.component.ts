import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    private _errorHandlerService: ErrorHandlerService
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
    const doc = new jsPDF();

    // --- User Info Header ---
    doc.setFontSize(14);
    doc.text('User Information', 10, 15);
    doc.setFontSize(12);
    doc.text(`First Name: ${this.userInfo?.firstName}`, 10, 25);
    doc.text(`Last Name: ${this.userInfo?.lastName}`, 10, 32);
    doc.text(`Username: ${this.userInfo?.username}`, 10, 39);

    // --- Order Info ---
    doc.setFontSize(14);
    doc.text(`Order #${order.id || ''}`, 10, 55);
    doc.setFontSize(12);
    doc.text(
      `Date: ${new Date(order.orderCreatedOn).toLocaleString()}`,
      10,
      65
    );

    // --- Items Table ---
    autoTable(doc, {
      startY: 75,
      head: [['Product', 'Quantity', 'Unit Price', 'Total']],
      body: order.items.map((i: any) => [
        i.productName,
        i.quantity,
        `$${i.unitPrice.toFixed(2)}`,
        `$${(i.unitPrice * i.quantity).toFixed(2)}`,
      ]),
      theme: 'striped',
      headStyles: { fillColor: [73, 80, 87] },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' },
      },
    });

    // --- Order Total ---
    const finalY = (doc as any).lastAutoTable.finalY || 90;
    doc.text(`Order Total: $${order.totalAmount.toFixed(2)}`, 10, finalY + 10);

    doc.save(`order-${order.id || 'unknown'}.pdf`);
  }

  /** ✅ Print all orders in one PDF (with user info) */
  printAllOrders() {
    const doc = new jsPDF();

    // --- User Info Header ---
    doc.setFontSize(14);
    doc.text('User Information', 10, 15);
    doc.setFontSize(12);
    doc.text(`First Name: ${this.userInfo?.firstName}`, 10, 25);
    doc.text(`Last Name: ${this.userInfo?.lastName}`, 10, 32);
    doc.text(`Username: ${this.userInfo?.username}`, 10, 39);

    // --- Report Title ---
    doc.setFontSize(16);
    doc.text('All Orders Report', 10, 55);

    // --- Orders Table ---
    autoTable(doc, {
      startY: 65,
      head: [['Date', 'Items', 'Total']],
      body: this.orders.map((o) => [
        new Date(o.orderCreatedOn).toLocaleDateString(),
        o.items.map((i: any) => `${i.productName} (x${i.quantity})`).join(', '),
        `$${o.totalAmount.toFixed(2)}`,
      ]),
      theme: 'grid',
      headStyles: { fillColor: [73, 80, 87] },
      columnStyles: {
        0: { halign: 'center' },
        1: { halign: 'left' },
        2: { halign: 'right' },
      },
    });

    // --- Grand Total ---
    const finalY = (doc as any).lastAutoTable.finalY || 80;
    doc.setFontSize(12);
    doc.text(
      `Grand Total: $${this.getGrandTotal().toFixed(2)}`,
      10,
      finalY + 10
    );

    doc.save('all-orders.pdf');
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
