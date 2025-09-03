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
import { SubcategoryService } from '../../../core/services/subcategory.service';
import { ProductService } from '../../../core/services/product.service';
import { ResponseStatus } from '../../../core/enums/response-status.enum';
import { finalize } from 'rxjs';

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
  isGeneratingDesc = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private _subcategoryService: SubcategoryService,
    private _productService: ProductService
  ) {
    this.createProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      subcategoryId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.maxLength(2500)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      image: ['', Validators.required],
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
      this._notificationService.notify(ResponseStatus.Info, 'Invalid form');
      return;
    }
    this.isSubmitting = true;
    this._productService.createProduct(this.createProductForm.value).subscribe({
      next: (response: any) => {
        this.router.navigate(['/products']);
        this.isSubmitting = false;
        this._notificationService.notify(
          response.notificationType,
          response.message
        );
      },
      error: (errorResponse: any) => {
        this.isSubmitting = false;
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }

  generateDescription() {
    const name = this.createProductForm.value.name;
    if (!name) {
      this._notificationService.notify(
        ResponseStatus.Info,
        'Please enter the product name to generate a proper description.'
      );
      return;
    }

    const subcategory = this.subcategoriesDropdownList.find(
      (s: any) => s.subcategoryId === this.createProductForm.value.subcategoryId
    );

    if (!subcategory) {
      this._notificationService.notify(
        ResponseStatus.Info,
        'Please select a subcategory to generate a proper description.'
      );
      return;
    }

    const match = subcategory.name.match(/^(.+)\s+\((.+)\)$/);

    if (!match) {
      alert('Subcategory format is invalid.');
      return;
    }

    const subcategoryName = match[1];
    const categoryName = match[2];
    this.isGeneratingDesc = true;

    this._productService
      .generateDescription(name, categoryName, subcategoryName)
      .pipe(finalize(() => (this.isGeneratingDesc = false)))
      .subscribe({
        next: (res) =>
          this.createProductForm.patchValue({ description: res.data }),
        error: (err) => this._errorHandlerService.handleErrors(err),
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
