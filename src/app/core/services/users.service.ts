import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = 'https://localhost:7270/api';

  constructor(private _dataApiService: DataService) {}

  getUsers(): Observable<any> {
    const params = new HttpParams()
      // .set('name', request.name)
      // .set('categoryId', request.categoryId)
      // .set('skip', request.skip.toString())
      // .set('take', request.take.toString())
      // .set('sortDirection', request.sortDirection)
      // .set('sortBy', request.sortBy);

    const url = `${this.baseUrl}/user`;
    return this._dataApiService.getAll<any>(url, params);
  }
}
