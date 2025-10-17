import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-edit',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css',
})
export class CategoryEditComponent implements OnInit {
  categoryName: string = '';
  isSubmitting = false;
  editCategoryForm: FormGroup;
  selectedCategoryId: string = '';
  validParentTree: any[] = [];
  imagePreviewUrl: string | null = null;

  expandedNodes = new Set<string>();
  selectedParentName: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public router: Router,
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService
  ) {
    this.editCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      parentCategoryId: [''],
      image: [''],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.selectedCategoryId = params['id'];
      this.loadCategoryById();
    });
  }

  loadCategoryById() {
    this._categoryService
      .getCategoryForEditById(this.selectedCategoryId)
      .subscribe({
        next: (response: any) => {
          this.editCategoryForm.patchValue({
            name: response.data?.name,
            parentCategoryId: response.data?.parentCategoryId,
          });
          this.imagePreviewUrl = response.data?.image;
          this.validParentTree = response.data?.validParentTree || [];

          // 👇 set selected parent name if exists
          if (response.data?.parentCategoryId) {
            const found = this.findCategoryById(
              this.validParentTree,
              response.data.parentCategoryId
            );
            this.selectedParentName = found ? found.name : null;
          } else {
            this.selectedParentName = 'No Parent (Top-Level)';
          }
        },
        error: (errorResponse: any) =>
          this._errorHandlerService.handleErrors(errorResponse),
      });
  }

  // recursive search
  private findCategoryById(tree: any[], id: string): any | null {
    for (let node of tree) {
      if (node.id === id) return node;
      if (node.children?.length) {
        const found = this.findCategoryById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  // expand/collapse helpers
  isExpanded(node: any): boolean {
    return this.expandedNodes.has(node.id);
  }

  toggleNode(node: any): void {
    if (this.expandedNodes.has(node.id)) {
      this.expandedNodes.delete(node.id);
    } else {
      this.expandedNodes.add(node.id);
    }
  }

  onParentSelected(id: any | null) {
    this.editCategoryForm.patchValue({ parentCategoryId: id });
  }

  onSubmit() {
    if (!this.editCategoryForm.valid) {
      return;
    }
    this.isSubmitting = true;
    this._categoryService
      .editCategory(this.selectedCategoryId, this.editCategoryForm.value)
      .subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this._notificationService.notify(response.status, response.message);
          this.router.navigate(['/categories']);
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
        this.editCategoryForm.patchValue({ image: base64String });
      };

      reader.readAsDataURL(file);
    }
  }
}
