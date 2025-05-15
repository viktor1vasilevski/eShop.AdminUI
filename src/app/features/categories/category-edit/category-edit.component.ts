import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-category-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css',
})
export class CategoryEditComponent implements OnInit {
  categoryName: string = '';

  editCategoryForm: FormGroup;
  selectedCategoryId: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _categoryService: CategoryService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService
  ) {
    this.editCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.selectedCategoryId = params['id'];  
      this._categoryService.getCategoryById(this.selectedCategoryId).subscribe({
        next: (response: any) => {
          if(response && response.success) {
            this.editCategoryForm.patchValue({
              name: response.data?.name
            })
          } else {
            this._notificationService.info(response.message);
          }
        },
        error: (errorResponse: any) => 
          this._errorHandlerService.handleErrors(errorResponse)
      })

    });
  }

  onSubmit() {
    // Call your API here
    console.log('Category Created:', this.categoryName);
    this.router.navigate(['/categories']);
  }

  cancel() {
    this.router.navigate(['/categories']);
  }
}
