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

@Component({
  selector: 'app-subcategory-edit',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './subcategory-edit.component.html',
  styleUrl: './subcategory-edit.component.css',
})
export class SubcategoryEditComponent implements OnInit {
  subcategoryName: string = '';

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

    this.route.params.subscribe((params) => {
      this.selectedSubcategoryId = params['id'];
    });
  }

  ngOnInit(): void {
    this.loadSubcategoryById();
    this.loadCategoriesDropdownList();
  }

  loadSubcategoryById() {
    this._subcategoryService
      .getSubcategoryById(this.selectedSubcategoryId)
      .subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.editSubcategoryForm.patchValue({
              name: response.data?.name,
              categoryId: response.data?.categoryId,
            });
          } else {
            this._notificationService.info(response.message);
          }
        },
        error: (errorResponse: any) =>
          this._errorHandlerService.handleErrors(errorResponse),
      });
  }

  loadCategoriesDropdownList() {
    this._categoryService.getCategoriesDropdownList().subscribe({
      next: (response: any) => {
        response && response.success && response.data
          ? (this.categoriesDropdownList = response.data)
          : this._notificationService.info(response.message);
      },
      error: (errorResponse: any) =>
        this._errorHandlerService.handleErrors(errorResponse),
    });
  }

  onSubmit() {
    if (!this.editSubcategoryForm.valid) {
      this._notificationService.info('Invalid form');
      return;
    }

    this._subcategoryService
      .editSubcategory(
        this.selectedSubcategoryId,
        this.editSubcategoryForm.value
      )
      .subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this._subcategoryService.notifySubcategoryAddedOrEdited();
            this._notificationService.success(response.message);
            this.router.navigate(['/subcategories']);
          } else {
            this._notificationService.error(response.message);
          }
        },
        error: (errorResponse: any) => {
          this._errorHandlerService.handleErrors(errorResponse);
        }
      });
  }
}
