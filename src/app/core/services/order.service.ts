import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'https://localhost:44366/api';

  constructor(private _dataApiService: DataService) {}

  getOrders(request: any): Observable<any> {
    const params = new HttpParams().set('userId', request.userId);
    const url = `${this.baseUrl}/order`;
    return this._dataApiService.getAll<any>(url, params);
  }
}
