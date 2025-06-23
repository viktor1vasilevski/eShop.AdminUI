import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-edit',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css',
})
export class ProductEditComponent implements OnInit {
  editProductForm: FormGroup;
  subcategoriesDropdownList: any[] = [];
  isSubmitting = false;
  selectedProductId: string = '';

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.editProductForm = this.fb.group({
      brand: ['', [Validators.required, Validators.minLength(3)]],
      subcategoryId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.maxLength(500)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });

    this.route.params.subscribe((params) => {
      debugger
      this.selectedProductId = params['id'];
      console.log(this.selectedProductId);
      
    });
  }


  ngOnInit(): void {
    debugger
    console.log(this.selectedProductId);
    
  }

  onSubmit() {}
}
