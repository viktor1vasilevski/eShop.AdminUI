import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'https://localhost:7270/api';

  private categoryAddedOrEditedSource = new BehaviorSubject<boolean>(false);
  categoryAddedOrEdited$ = this.categoryAddedOrEditedSource.asObservable();

  constructor(private _dataApiService: DataService) {}

  getCategories(request: any): Observable<any> {
    const params = new HttpParams()
      .set('skip', request.skip.toString())
      .set('take', request.take.toString())
      .set('sortDirection', request.sortDirection)
      .set('sortBy', request.sortBy)
      .set('name', request.name);

    const url = `${this.baseUrl}/category/get`;
    return this._dataApiService.getAll<any>(url, params);
  }

  createCategory(request: any): Observable<any> {
    return this._dataApiService.create<any, any>(
      `${this.baseUrl}/category/create`,
      request
    );
  }

  getCategoryById(id: string): Observable<any> {
    const url = `${this.baseUrl}/category/get/${id}`;
    return this._dataApiService.getById<any>(url);
  }

  notifyCategoryAddedOrEdited() {
    this.categoryAddedOrEditedSource.next(true);
  }
}
