import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SubcategoryService } from '../../../core/services/subcategory.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subcategory-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './subcategory-details.component.html',
  styleUrl: './subcategory-details.component.css',
})
export class SubcategoryDetailsComponent implements OnInit {
  subcategoryId: any;
  subcategory: any;
  constructor(
    private route: ActivatedRoute,
    private _subcategoryService: SubcategoryService,
    private _errorHandlerService: ErrorHandlerService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.subcategoryId = params['id'];
      this.loadSubcategoryDetails();
    });
  }

  loadSubcategoryDetails() {
    this._subcategoryService.getSubcategoryById(this.subcategoryId).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.subcategory = res.data;
          console.log(this.subcategory);
        }
      },
      error: (err: any) => this._errorHandlerService.handleErrors(err),
    });
  }
}
