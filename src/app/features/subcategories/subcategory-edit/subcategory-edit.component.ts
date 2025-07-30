import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { SubcategoryService } from '../../../core/services/subcategory.service';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../core/services/category.service';
import { NotificationType } from '../../../core/enums/notification-type.enum';

@Component({
  selector: 'app-subcategory-edit',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './subcategory-edit.component.html',
  styleUrl: './subcategory-edit.component.css',
})
export class SubcategoryEditComponent implements OnInit {
  subcategoryName: string = '';
  isSubmitting = false;
  editSubcategoryForm: FormGroup;
  selectedSubcategoryId: string = '';
  editCategoryForm: any;
  categoriesDropdownList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public router: Router,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private _subcategoryService: SubcategoryService,
    private _categoryService: CategoryService
  ) {
    this.editSubcategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      categoryId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.selectedSubcategoryId = params['id'];
      this.loadSubcategoryById();
    });

    this.loadCategoriesDropdownList();
  }

  loadSubcategoryById() {
    this._subcategoryService
      .getSubcategoryById(this.selectedSubcategoryId)
      .subscribe({
        next: (response: any) => {
          this.editSubcategoryForm.patchValue({
            name: response.data?.name,
            categoryId: response.data?.categoryId,
          });
        },
        error: (errorResponse: any) =>
          this._errorHandlerService.handleErrors(errorResponse),
      });
  }

  loadCategoriesDropdownList() {
    this._categoryService.getCategoriesDropdownList().subscribe({
      next: (response: any) => {
        this.categoriesDropdownList = response.data;
      },
      error: (errorResponse: any) =>
        this._errorHandlerService.handleErrors(errorResponse),
    });
  }

  onSubmit() {
    if (!this.editSubcategoryForm.valid) {
      this._notificationService.notify(NotificationType.Info, 'Invalid form');
      return;
    }
    this.isSubmitting = true;
    this._subcategoryService
      .editSubcategory(
        this.selectedSubcategoryId,
        this.editSubcategoryForm.value
      )
      .subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.router.navigate(['/subcategories']);
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
}
