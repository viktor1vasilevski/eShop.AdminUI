import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'https://localhost:44344/api';

  constructor(private _dataApiService: DataService) {}

  getProducts(request: any): Observable<any> {
    const params = new HttpParams()
      .set('name', request.name)
      .set('categoryId', request.categoryId ?? '')
      .set('subcategoryId', request.subcategoryId ?? '')
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

  generateDescription(
    productName: string,
    category: string,
    subcategory: string,
    additionalContext?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('productName', productName)
      .set('category', category)
      .set('subcategory', subcategory);

    if (additionalContext) {
      params = params.set('additionalContext', additionalContext);
    }

    const url = `${this.baseUrl}/product/generate`;
    return this._dataApiService.getAll<any>(url, params);
  }
}
