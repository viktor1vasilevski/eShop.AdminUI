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

@Component({
  selector: 'app-subcategory-create',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './subcategory-create.component.html',
  styleUrl: './subcategory-create.component.css',
})
export class SubcategoryCreateComponent implements OnInit {
  createSubcategoryForm: FormGroup;
  categoriesDropdownList: any[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private _categoryService: CategoryService,
    private _subcategoryService: SubcategoryService
  ) {
    this.createSubcategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      categoryId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategoriesDropdownList();
  }

  onSubmit() {
    if (!this.createSubcategoryForm.valid) {
      this._notificationService.info('Invalid form');
      return;
    }
    this.isSubmitting = true;
    this._subcategoryService
      .createSubcategory(this.createSubcategoryForm.value)
      .subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this._notificationService.success(response.message);
            this._subcategoryService.notifySubcategoryAddedOrEdited();
            this.router.navigate(['/subcategories']);
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

  loadCategoriesDropdownList() {
    this._categoryService.getCategoriesDropdownList().subscribe({
      next: (response: any) => {
        response && response.success && response.data
          ? (this.categoriesDropdownList = response.data)
          : this._notificationService.error(response.message);
      },
      error: (errorResponse: any) =>
        this._errorHandlerService.handleErrors(errorResponse),
    });
  }
}
