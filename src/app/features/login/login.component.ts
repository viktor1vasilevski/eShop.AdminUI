import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminAuthService } from '../../core/services/admin-auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  passwordPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{4,}$';
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  constructor(private fb: FormBuilder,
    private _adminAuthService: AdminAuthService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
    });
  }

  onLogin() {
    if (!this.loginForm.valid) {
      this._notificationService.info("Invalid form");
      return;
    }
 
    this._adminAuthService.loginAdmin(this.loginForm.value).subscribe({
      next: (response: any) => response && response.success ? this.router.navigate(['/dashboard']) : this._notificationService.error(response.message),
      error: (errorResponse: any) => this._errorHandlerService.handleErrors(errorResponse)
    })
  }

}
