import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'https://localhost:7270/api';

  private productAddedOrEditedSource = new BehaviorSubject<boolean>(false);
  productAddedOrEdited$ = this.productAddedOrEditedSource.asObservable();
  constructor(private _dataApiService: DataService) {}

  getProducts(request: any): Observable<any> {
    const params = new HttpParams()
      .set('brand', request.brand)
      .set('categoryId', request.categoryId)
      .set('subcategoryId', request.subcategoryId)
      .set('unitPrice', request.unitPrice)
      .set('unitQuantity', request.unitQuantity)
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

  deleteProduct(id: string): Observable<any> {
    const url = `${this.baseUrl}/product/${id}`;
    return this._dataApiService.delete<any>(url);
  }

  notifyProductAddedOrEdited() {
    this.productAddedOrEditedSource.next(true);
  }
}
