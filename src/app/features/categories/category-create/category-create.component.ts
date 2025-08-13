import { Component } from '@angular/core';
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
import { NotificationType } from '../../../core/enums/notification-type.enum';

@Component({
  selector: 'app-category-create',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  standalone: true,
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.css',
})
export class CategoryCreateComponent {
  createCategoryForm: FormGroup;
  isSubmitting = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private _categoryService: CategoryService
  ) {
    this.createCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      isActive: [false],
    });
  }

  onSubmit() {
    if (!this.createCategoryForm.valid) {
      this._notificationService.notify(NotificationType.Info, 'Invalid form');
      return;
    }
    this.isSubmitting = true;
    this._categoryService
      .createCategory(this.createCategoryForm.value)
      .subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.router.navigate(['/categories']);
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
