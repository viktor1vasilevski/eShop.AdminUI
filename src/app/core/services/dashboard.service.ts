import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = 'https://localhost:44352/api/dashboard';

  constructor(private _dataApiService: DataService) {}

  getOrdersToday(): Observable<any> {
    return this._dataApiService.getAll<any>(`${this.baseUrl}/orders-today`);
  }

  getRevenueToday(): Observable<any> {
    return this._dataApiService.getAll<any>(`${this.baseUrl}/revenue-today`);
  }

  getTotalCustomers(): Observable<any> {
    return this._dataApiService.getAll<any>(`${this.baseUrl}/total-customers`);
  }

  getOrdersPerDay(): Observable<any> {
    return this._dataApiService.getAll<any>(`${this.baseUrl}/orders-per-day`);
  }
}
