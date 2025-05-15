import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CategoryService } from '../../../core/services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-create',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  standalone: true,
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css',
})
export class CategoryCreateComponent {
  createCategoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private _categoryService: CategoryService
  ) {
    this.createCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    if (!this.createCategoryForm.valid) {
      this._notificationService.info('Invalid form');
      return;
    }

    this._categoryService
      .createCategory(this.createCategoryForm.value)
      .subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this._notificationService.success(response.message);
            this._categoryService.notifyCategoryAddedOrEdited();
            this.router.navigate(['/categories']);
          } else {
            this._notificationService.error(response.message);
          }
        },
        error: (errorResponse: any) =>
          this._errorHandlerService.handleErrors(errorResponse),
      });
  }
}
