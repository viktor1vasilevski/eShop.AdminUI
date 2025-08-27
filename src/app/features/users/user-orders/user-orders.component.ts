import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';

@Component({
  selector: 'app-user-orders',
  imports: [CommonModule, PaginationComponent],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css',
})
export class UserOrdersComponent implements OnInit {
  userId: string = '';
  orders: any[] = [];

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
    this._orderService.getOrdersByUserId(this.userId).subscribe({
      next: (response: any) => {
        this.orders = response.data;
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }

  viewOrderDetails(asd: string) {}
}
