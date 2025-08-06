import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from './data.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
  private baseUrl = 'https://localhost:44344/api';

  constructor(private _dataApiService: DataService) {}

  getSubcategories(request: any): Observable<any> {
    const params = new HttpParams()
      .set('name', request.name)
      .set('categoryId', request.categoryId)
      .set('skip', request.skip.toString())
      .set('take', request.take.toString())
      .set('sortDirection', request.sortDirection)
      .set('sortBy', request.sortBy);

    const url = `${this.baseUrl}/subcategory`;
    return this._dataApiService.getAll<any>(url, params);
  }

  createSubcategory(request: any): Observable<any> {
    return this._dataApiService.create<any, any>(
      `${this.baseUrl}/subcategory`,
      request
    );
  }

  editSubcategory(id: string, request: any): Observable<any> {
    return this._dataApiService.put<any, any>(
      `${this.baseUrl}/subcategory/${id}`,
      request
    );
  }

  getSubcategoryById(id: string): Observable<any> {
    const url = `${this.baseUrl}/subcategory/${id}`;
    return this._dataApiService.getById<any>(url);
  }

  deleteSubcategory(id: string): Observable<any> {
    const url = `${this.baseUrl}/subcategory/${id}`;
    return this._dataApiService.delete<any>(url);
  }

  getSubcategoriesDropdownList(): Observable<any> {
    const url = `${this.baseUrl}/subcategory/dropdownList`;
    return this._dataApiService.getAll<any>(url);
  }

  getSubcategoriesWithCategoriesDropdownList(): Observable<any> {
    const url = `${this.baseUrl}/subcategory/dropdownListWithCategories`;
    return this._dataApiService.getAll<any>(url);
  }
}
