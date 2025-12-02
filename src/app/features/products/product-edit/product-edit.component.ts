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
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CategoryService } from '../../../core/services/category.service';
import { ResponseStatus } from '../../../core/enums/response-status.enum';

@Component({
  selector: 'app-product-edit',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css',
})
export class ProductEditComponent implements OnInit {
  editProductForm: FormGroup;
  isSubmitting = false;
  selectedProductId: string = '';
  imagePreviewUrl: string | null = null;

  categoryTree: any[] = [];
  expandedNodes: Set<string> = new Set();
  categoryId: string | null = null;

  isGeneratingDesc = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService
  ) {
    this.editProductForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      categoryId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.maxLength(2500)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      image: ['', []],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.selectedProductId = params['id'];
      this.loadCategoriesTree();
      this.loadProductForEdit();
    });
  }

  /** LOAD CATEGORY TREE */
  loadCategoriesTree() {
    this._categoryService.getCategoriesTree().subscribe({
      next: (res: any) => {
        this.categoryTree = res.data ?? [];
      },
      error: (err: any) => this._errorHandlerService.handleErrors(err),
    });
  }

  generateDescription(): void {
    const name = this.editProductForm.get('name')?.value;
    const categoryId = this.editProductForm.get('categoryId')?.value;

    if (!name || !categoryId) {
      this._notificationService.notify(
        ResponseStatus.Info,
        'Name and category are required to generate a description.'
      );
      return;
    }

    const categoryPath = this.getCategoryPathById(categoryId).join(' > ');

    this.isGeneratingDesc = true;

    const request = {
      productName: name,
      categories: categoryPath,
    };

    this._productService.generateDescription(request).subscribe({
      next: (res: any) => {
        this.editProductForm.patchValue({ description: res.data });
        this.isGeneratingDesc = false;
      },
      error: (err: any) => {
        this._errorHandlerService.handleErrors(err);
        this.isGeneratingDesc = false;
      },
    });
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

  /** LOAD PRODUCT DATA FOR EDIT */
  loadProductForEdit(): void {
    this._productService
      .getProductForEditById(this.selectedProductId)
      .subscribe({
        next: (response: any) => {
          this.editProductForm.patchValue({
            name: response.data?.name,
            price: response.data?.unitPrice,
            quantity: response.data?.unitQuantity,
            description: response.data?.description,
            categoryId: response.data?.categoryId,
          });

          this.imagePreviewUrl = response.data?.image;

          this.categoryId = response.data?.categoryId;
          if (this.categoryId) {
            this.expandPathToCategory(this.categoryId);
          }
        },
        error: (err: any) => this._errorHandlerService.handleErrors(err),
      });
  }

  /** TREE NODE FUNCTIONS */
  isExpanded(node: any): boolean {
    return this.expandedNodes.has(node.id);
  }

  toggleNode(node: any) {
    if (this.isExpanded(node)) {
      this.expandedNodes.delete(node.id);
    } else {
      this.expandedNodes.add(node.id);
    }
  }

  expandAll() {
    const traverse = (nodes: any[]) => {
      for (let node of nodes) {
        if (node.children?.length) {
          this.expandedNodes.add(node.id);
          traverse(node.children);
        }
      }
    };
    traverse(this.categoryTree);
  }

  collapseAll() {
    this.expandedNodes.clear();
  }

  getIndent(level: number): number {
    return Math.min(level * 3, 120);
  }

  onCategorySelected(categoryId: string) {
    this.categoryId = categoryId;
    this.editProductForm.patchValue({ categoryId: categoryId });
  }

  expandPathToCategory(categoryId: string) {
    const findParent = (nodes: any[], targetId: string): boolean => {
      for (let node of nodes) {
        if (node.id === targetId) return true;
        if (node.children?.length && findParent(node.children, targetId)) {
          this.expandedNodes.add(node.id);
          return true;
        }
      }
      return false;
    };
    findParent(this.categoryTree, categoryId);
  }

  /** IMAGE UPLOAD */
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

  /** FORM SUBMISSION */
  onSubmit() {
    if (!this.editProductForm.valid) {
      this._notificationService.notify(
        ResponseStatus.ServerError,
        'Please correct the errors in the form.'
      );
      return;
    }

    this.isSubmitting = true;
    this._productService
      .editProduct(this.selectedProductId, this.editProductForm.value)
      .subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.router.navigate(['/products']);
          this._notificationService.notify(
            response.notificationType,
            response.message
          );
        },
        error: (error: any) => {
          this.isSubmitting = false;
          this._errorHandlerService.handleErrors(error);
        },
      });
  }
}
