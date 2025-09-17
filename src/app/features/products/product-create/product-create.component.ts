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
import { ProductService } from '../../../core/services/product.service';
import { ResponseStatus } from '../../../core/enums/response-status.enum';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-product-create',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css',
})
export class ProductCreateComponent implements OnInit {
  createProductForm: FormGroup;
  isSubmitting = false;
  imagePreviewUrl: string | null = null;
  isGeneratingDesc = false;

  categoryTree: any[] = [];
  selectedCategoryId: string | null = null;

  expandedNodes = new Set<number>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private _productService: ProductService,
    private _categoryService: CategoryService
  ) {
    this.createProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      categoryId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.maxLength(2500)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      image: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategoryTree();
  }

  loadCategoryTree(): void {
    this._categoryService.getCategoriesTree().subscribe({
      next: (res) => {
        this.categoryTree = res.data ?? [];
      },
      error: (err) => this._errorHandlerService.handleErrors(err),
    });
  }

  onCategorySelected(id: string) {
    this.selectedCategoryId = id;
    this.createProductForm.get('categoryId')?.setValue(id);
  }

  toggleNode(node: any) {
    if (this.expandedNodes.has(node.id)) {
      this.expandedNodes.delete(node.id);
    } else {
      this.expandedNodes.add(node.id);
    }
  }

  isExpanded(node: any): boolean {
    return this.expandedNodes.has(node.id);
  }

  onSubmit() {
    debugger;
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

  generateDescription(): void {
    const name = this.createProductForm.get('name')?.value;
    const categoryId = this.createProductForm.get('categoryId')?.value;

    if (!name || !categoryId) {
      this._notificationService.notify(
        ResponseStatus.Info,
        'Name and category are required to generate a description.'
      );
      return;
    }

    // Get category path like "Electronics > Laptops"
    const categoryPath = this.getCategoryPathById(categoryId).join(' > ');

    this.isGeneratingDesc = true;

    const request = {
      productName: name,
      categories: categoryPath,
    };

    this._productService.generateDescription(request).subscribe({
      next: (res) => {
        this.createProductForm.patchValue({
          description: res.data,
        });
        this.isGeneratingDesc = false;
      },
      error: (err) => {
        this._errorHandlerService.handleErrors(err);
        this.isGeneratingDesc = false;
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

  private getCategoryPathById(id: string): string[] {
    const path: string[] = [];

    function traverse(node: any, currentPath: string[]): boolean {
      if (node.id === id) {
        path.push(...currentPath, node.name);
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (traverse(child, [...currentPath, node.name])) {
            return true;
          }
        }
      }
      return false;
    }

    for (const rootNode of this.categoryTree) {
      if (traverse(rootNode, [])) break;
    }

    return path;
  }
}
