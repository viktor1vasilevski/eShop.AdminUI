import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-subcategory-edit',
  imports: [],
  templateUrl: './subcategory-edit.component.html',
  styleUrl: './subcategory-edit.component.css',
})
export class SubcategoryEditComponent implements OnInit {
  subcategoryName: string = '';

  //editSubcategoryForm: FormGroup;
  selectedSubcategoryId: string = '';
  editCategoryForm: any;

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
    this.route.params.subscribe((params) => {
      this.selectedSubcategoryId = params['id'];
      console.log(this.selectedSubcategoryId);
    });
  }
}
