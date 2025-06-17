import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'https://localhost:7270/api';
  constructor(private _dataApiService: DataService) {}

  getProducts(request: any): Observable<any> {
    const params = new HttpParams()
      .set('brand', request.name)
      .set('subcategoryId', request.categoryId)
      .set('skip', request.skip.toString())
      .set('take', request.take.toString())
      .set('sortDirection', request.sortDirection)
      .set('sortBy', request.sortBy);

    const url = `${this.baseUrl}/product`;
    return this._dataApiService.getAll<any>(url, params);
  }

  createProduct(request: any): Observable<any> {
    return this._dataApiService.create<any, any>(
      `${this.baseUrl}/product`,
      request
    );
  }


}
