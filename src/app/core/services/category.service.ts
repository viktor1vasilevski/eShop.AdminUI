import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiResponse } from '../models/api-response';
import { CategoryDto } from '../../features/categories/models/category-dto.model';
import { CategoryRequest } from '../../features/categories/models/category-request.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'https://localhost:44344/api';

  constructor(private _dataApiService: DataService) {}

  getCategories(
    request: CategoryRequest
  ): Observable<ApiResponse<CategoryDto[]>> {
    let params = new HttpParams()
      .set('skip', request.skip.toString())
      .set('take', request.take.toString())
      .set('sortDirection', request.sortDirection)
      .set('sortBy', request.sortBy)
      .set('name', request.name);

    const url = `${this.baseUrl}/category`;
    return this._dataApiService.getAll<ApiResponse<CategoryDto[]>>(url, params);
  }

  createCategory(request: any): Observable<any> {
    return this._dataApiService.create<any, any>(
      `${this.baseUrl}/category`,
      request
    );
  }

  editCategory(id: string, request: any): Observable<any> {
    return this._dataApiService.put<any, any>(
      `${this.baseUrl}/category/${id}`,
      request
    );
  }

  getCategoryById(id: string): Observable<any> {
    const url = `${this.baseUrl}/category/${id}`;
    return this._dataApiService.getById<any>(url);
  }

  deleteCategory(id: string): Observable<any> {
    const url = `${this.baseUrl}/category/${id}`;
    return this._dataApiService.delete<any>(url);
  }

  getCategoriesDropdownList(): Observable<any> {
    const url = `${this.baseUrl}/category/getCategoriesDropdownList`;
    return this._dataApiService.getAll<any>(url);
  }

  getCategoriesTree(): Observable<any> {
    const url = `${this.baseUrl}/category/tree`;
    return this._dataApiService.getAll<any>(url);
  }
}
