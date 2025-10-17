import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'https://localhost:44352/api';

  constructor(private _dataApiService: DataService) {}

  getProducts(request: any): Observable<any> {
    const params = new HttpParams()
      .set('name', request.name)
      .set('categoryId', request.categoryId ?? '')
      .set('unitPrice', request.unitPrice)
      .set('unitQuantity', request.unitQuantity)
      .set('skip', request.skip.toString())
      .set('take', request.take.toString())
      .set('sortDirection', request.sortDirection)
      .set('sortBy', request.sortBy);

    const url = `${this.baseUrl}/product`;
    return this._dataApiService.getAll<any>(url, params);
  }

  getProductById(id: string): Observable<any> {
    const url = `${this.baseUrl}/product/${id}`;
    return this._dataApiService.getById<any>(url);
  }

  getProductForEditById(id: string): Observable<any> {
    const url = `${this.baseUrl}/product/${id}/edit`;
    return this._dataApiService.getById<any>(url);
  }

  createProduct(request: any): Observable<any> {
    return this._dataApiService.create<any, any>(
      `${this.baseUrl}/product`,
      request
    );
  }

  editProduct(id: string, request: any): Observable<any> {
    return this._dataApiService.put<any, any>(
      `${this.baseUrl}/product/${id}`,
      request
    );
  }

  deleteProduct(id: string): Observable<any> {
    const url = `${this.baseUrl}/product/${id}`;
    return this._dataApiService.delete<any>(url);
  }

  generateDescription(request: any): Observable<any> {
    const url = `${this.baseUrl}/product/generate`;

    const params = new HttpParams()
      .set('productName', request.productName)
      .set('categories', request.categories);

    return this._dataApiService.getAll<any>(url, params);
  }
}
