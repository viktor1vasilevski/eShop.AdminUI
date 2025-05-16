import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationManagerService } from './authentication-manager.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private baseUrl = 'https://localhost:7270/api';

  constructor(
    private _http: HttpClient,
    private _authenticationManagerService: AuthenticationManagerService,
    private router: Router
  ) {}

  login(request: any) {
    return this._http.post<any>(`${this.baseUrl}/adminAuth/login`, request);
  }

  logout() {
    this._authenticationManagerService.logout();
    this.router.navigate(['/login']);
  }
}
