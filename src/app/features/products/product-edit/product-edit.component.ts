import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { SubcategoryService } from '../../../core/services/subcategory.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-product-edit',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css',
})
export class ProductEditComponent implements OnInit {
  editProductForm: FormGroup;
  subcategoriesDropdownList: any[] = [];
  isSubmitting = false;
  selectedProductId: string = '';
  imagePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private _productService: ProductService,
    private _subcategoryService: SubcategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService
  ) {
    this.editProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      subcategoryId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.maxLength(500)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      image: ['', [Validators.required]],
    });

    this.route.params.subscribe((params) => {
      this.selectedProductId = params['id'];
    });
  }

  ngOnInit(): void {
    this.loadProductById();
    this.loadSubcategoriesDropdownList();
  }

  loadProductById(): void {
    this._productService.getProductById(this.selectedProductId).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.editProductForm.patchValue({
            name: response.data?.name,
            price: response.data?.unitPrice,
            quantity: response.data?.unitQuantity,
            description: response.data?.description,
            subcategoryId: response.data?.subcategoryId,
            image: response.data.image,
          });
          this.imagePreviewUrl = response.data.image;
        } else {
          this._notificationService.error(response.message);
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }

  loadSubcategoriesDropdownList(): void {
    this._subcategoryService.getSubcategoriesDropdownList().subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          this.subcategoriesDropdownList = response.data;
        } else {
          this._notificationService.error(response.message);
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }

  onSubmit() {
    if (!this.editProductForm.valid) {
      this._notificationService.info('Invalid form');
      return;
    }
    this.isSubmitting = true;
    this._productService
      .editProduct(this.selectedProductId, this.editProductForm.value)
      .subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this._productService.notifyProductAddedOrEdited();
            this._notificationService.success(response.message);
            this.router.navigate(['/products']);
          } else {
            this.isSubmitting = false;
            this._notificationService.error(response.message);
          }
        },
        error: (errorResponse: any) => {
          this.isSubmitting = false;
          this._errorHandlerService.handleErrors(errorResponse);
        },
      });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.imagePreviewUrl = base64String;
        this.editProductForm.patchValue({ image: base64String });
      };

      reader.readAsDataURL(file);
    }
  }
}
