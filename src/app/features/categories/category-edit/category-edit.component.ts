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
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.selectedCategoryId = params['id'];
      this.loadCategoryById();
    });
  }

  loadCategoryById() {
    this._categoryService.getCategoryById(this.selectedCategoryId).subscribe({
      next: (response: any) => {
        this.editCategoryForm.patchValue({
          name: response.data?.name,
        });
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
          debugger;
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
}
