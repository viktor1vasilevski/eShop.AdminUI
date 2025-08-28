import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'https://localhost:44344/api';

  constructor(private _dataApiService: DataService) {}

  getOrders(request: any): Observable<any> {
    const params = new HttpParams().set('userId', request.userId);
    const url = `${this.baseUrl}/order`;
    return this._dataApiService.getAll<any>(url, params);
  }

  getOrdersByUserId(userId: string, request?: any | null): Observable<any> {
    const params = new HttpParams()
      .set('skip', request.skip.toString())
      .set('take', request.take.toString())
      .set('sortDirection', request.sortDirection)
      .set('sortBy', request.sortBy);

    const url = `${this.baseUrl}/order/${userId}`;
    return this._dataApiService.getAll<any>(url, params);
  }
}
