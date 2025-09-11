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
import { CommonModule } from '@angular/common';
import { ResponseStatus } from '../../../core/enums/response-status.enum';

@Component({
  selector: 'app-category-create',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  standalone: true,
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css',
})
export class CategoryCreateComponent implements OnInit {
  createCategoryForm: FormGroup;
  isSubmitting = false;
  imagePreviewUrl: string | null = null;

  categoryTree: any[] = [];
  selectedParentId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private _categoryService: CategoryService
  ) {
    this.createCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      image: ['', Validators.required],
      parentCategoryId: [null],
    });
  }

  ngOnInit(): void {
    this.loadCategoriesTree();
  }

  loadCategoriesTree() {
    this._categoryService.getCategoriesTree().subscribe({
      next: (res: any) => {
        this.categoryTree = res.data;
        console.log(this.categoryTree);
      },
      error: (err: any) => this._errorHandlerService.handleErrors(err),
    });
  }

  onParentSelected(id: string | null) {
    this.selectedParentId = id;
    this.createCategoryForm.patchValue({ parentCategoryId: id });
  }

  onSubmit() {
    if (!this.createCategoryForm.valid) {
      this._notificationService.notify(ResponseStatus.Info, 'Invalid form');
      return;
    }
    this.isSubmitting = true;
    this._categoryService
      .createCategory(this.createCategoryForm.value)
      .subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.router.navigate(['/categories']);
          this._notificationService.notify(response.status, response.message);
        },
        error: (errorResponse: any) => {
          this.isSubmitting = false;
          this._errorHandlerService.handleErrors(errorResponse);
        },
      });
  }

  expandedNodes: Set<string> = new Set();

  toggleNode(node: any): void {
    if (this.expandedNodes.has(node.id)) {
      this.expandedNodes.delete(node.id);
    } else {
      this.expandedNodes.add(node.id);
    }
  }

  isExpanded(node: any): boolean {
    return this.expandedNodes.has(node.id);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.imagePreviewUrl = base64String;
        this.createCategoryForm.patchValue({ image: base64String });
      };

      reader.readAsDataURL(file);
    }
  }
}
