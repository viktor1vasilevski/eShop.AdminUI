import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
declare var bootstrap: any;

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  productId: any = '';
  product: any;
  productToDelete: any = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private _productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.loadProductById();
    });
  }

  loadProductById() {
    this._productService.getProductById(this.productId).subscribe({
      next: (res: any) => {
        this.product = res.data;
      },
      error: (err: any) => this._errorHandlerService.handleErrors(err),
    });
  }

  showDeleteProductModal(product: any) {
    this.productToDelete = product;
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  deleteProduct() {
    this._productService.deleteProduct(this.productToDelete.id).subscribe({
      next: (response: any) => {
        this.router.navigate(['/products']);
        this._notificationService.notify(
          response.notificationType,
          response.message
        );
      },
      error: (errorResponse: any) =>
        this._errorHandlerService.handleErrors(errorResponse),
    });
    this.closeModal();
  }

  closeModal(): void {
    const deleteModalElement = document.getElementById(
      'deleteConfirmationModal'
    );
    if (deleteModalElement) {
      const modalInstance = bootstrap.Modal.getInstance(deleteModalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
    this.productToDelete = null;
  }
}
