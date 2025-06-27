import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CategoryService } from '../../../core/services/category.service';
import { SubcategoryService } from '../../../core/services/subcategory.service';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-create',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css',
})
export class ProductCreateComponent implements OnInit {
  createProductForm: FormGroup;
  subcategoriesDropdownList: any[] = [];
  isSubmitting = false;
  imagePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private _categoryService: CategoryService,
    private _subcategoryService: SubcategoryService,
    private _productService: ProductService
  ) {
    this.createProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      subcategoryId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSubcategoriesWithCategoriesDropdownList();
  }

  loadSubcategoriesWithCategoriesDropdownList() {
    this._subcategoryService
      .getSubcategoriesWithCategoriesDropdownList()
      .subscribe({
        next: (response: any) => {
          this.subcategoriesDropdownList = response.data;
        },
        error: (errorResponse: any) =>
          this._errorHandlerService.handleErrors(errorResponse),
      });
  }

  onSubmit() {
    if (!this.createProductForm.valid) {
      this._notificationService.info('Invalid form');
      return;
    }
    this.isSubmitting = true;
    this._productService.createProduct(this.createProductForm.value).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this._productService.notifyProductAddedOrEdited();
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
        this.createProductForm.patchValue({ image: base64String });
      };

      reader.readAsDataURL(file);
    }
  }
}
