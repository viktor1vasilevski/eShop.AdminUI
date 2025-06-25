import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminAuthService } from './core/services/admin-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'eShop | Admin';

  constructor(private _adminAuthService: AdminAuthService) {}

  logout() {
    this._adminAuthService.logout();
  }
}
