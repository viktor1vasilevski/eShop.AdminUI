import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  private baseUrl = 'https://localhost:7270/api';

  constructor(private _http: HttpClient) { }

  // Login an admin user
  loginAdmin(request: any) {
    return this._http.post<any>(`${this.baseUrl}/adminAuth/login`, request);
  }
}
