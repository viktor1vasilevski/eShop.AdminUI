import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
    });
  }

  onLogin() {
    if (!this.loginForm.valid) {
      //this._notificationService.info("Invalid form");
      return;
    }
  }

}
