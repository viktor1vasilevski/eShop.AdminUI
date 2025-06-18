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

@Component({
  selector: 'app-category-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css',
})
export class CategoryEditComponent implements OnInit {
  categoryName: string = '';
  isSubmitting = false;
  editCategoryForm: FormGroup;
  selectedCategoryId: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public router: Router,
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService
  ) {
    this.editCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.route.params.subscribe((params) => {
      this.selectedCategoryId = params['id'];
    });
  }

  ngOnInit(): void {
    this._categoryService.getCategoryById(this.selectedCategoryId).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.editCategoryForm.patchValue({
            name: response.data?.name,
          });
        } else {
          this._notificationService.info(response.message);
        }
      },
      error: (errorResponse: any) =>
        this._errorHandlerService.handleErrors(errorResponse),
    });
  }

  onSubmit() {
    if (!this.editCategoryForm.valid) {
      this._notificationService.info('Invalid form');
      return;
    }
    this.isSubmitting = true;
    this._categoryService
      .editCategory(this.selectedCategoryId, this.editCategoryForm.value)
      .subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this._categoryService.notifyCategoryAddedOrEdited();
            this._notificationService.success(response.message);
            this.router.navigate(['/categories']);
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

  cancel() {
    this.router.navigate(['/categories']);
  }
}
