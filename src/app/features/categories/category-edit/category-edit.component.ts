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
  categoryTree: any[] = [];

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
    this.loadCategoriesTree();

    this.route.params.subscribe((params) => {
      this.selectedCategoryId = params['id'];
      this.loadCategoryById();
    });
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
          this.validParentTree = response.data?.validParentTree;
        },
        error: (errorResponse: any) =>
          this._errorHandlerService.handleErrors(errorResponse),
      });
  }

  onSubmit() {
    if (!this.editCategoryForm.valid) {
      //this._notificationService.info('Invalid form');
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

  getAllDescendantIds(category: any): string[] {
    let ids: string[] = [];
    if (category.children) {
      for (let child of category.children) {
        ids.push(child.id);
        ids = ids.concat(this.getAllDescendantIds(child));
      }
    }
    return ids;
  }

  onParentSelected(parentId: string | null) {
    this.editCategoryForm.patchValue({ parentCategoryId: parentId });
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
