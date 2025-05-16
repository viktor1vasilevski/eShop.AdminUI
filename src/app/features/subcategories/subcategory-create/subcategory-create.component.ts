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

@Component({
  selector: 'app-subcategory-create',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './subcategory-create.component.html',
  styleUrl: './subcategory-create.component.css',
})
export class SubcategoryCreateComponent implements OnInit {
  createSubcategoryForm: FormGroup;
  categoriesDropdownList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private _categoryService: CategoryService
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
  }

  loadCategoriesDropdownList() {
    this._categoryService.getCategoriesDropdownList().subscribe({
      next: (response: any) => {
        if (response && response.success && response.data) {
          this.categoriesDropdownList = response.data;
        } else {
          this._notificationService.error(response.message);
        }
      },
      error: (errorResponse: any) =>
        this._errorHandlerService.handleErrors(errorResponse),
    });
  }
}
