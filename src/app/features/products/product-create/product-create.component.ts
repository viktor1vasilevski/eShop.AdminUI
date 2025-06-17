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
  selector: 'app-product-create',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css',
})
export class ProductCreateComponent implements OnInit {
  createProductForm: FormGroup;
  subcategoriesDropdownList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private _categoryService: CategoryService,
    private _subcategoryService: SubcategoryService
  ) {
    this.createProductForm = this.fb.group({
      brand: ['', [Validators.required, Validators.minLength(3)]],
      subcategoryId: ['', Validators.required],
      price: [''],
      description: [''],
      quantity: [''],
    });
  }

  ngOnInit(): void {
    this.loadSubcategoriesDropdownList();
  }

  loadSubcategoriesDropdownList() {
    this._subcategoryService.getSubcategoriesDropdownList().subscribe({
      next: (response: any) => {
        this.subcategoriesDropdownList = response.data;
      },
      error: (errorResponse: any) => {
        console.log(errorResponse);
      },
    });
  }

  onSubmit() {}
}
