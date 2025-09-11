import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  productId: any = '';
  product: any;

  constructor(
    private route: ActivatedRoute,
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
}
