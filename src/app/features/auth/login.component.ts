import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DEMO_CREDENTIALS } from '../../core/mock/mock-backend.interceptor';

@Component({
  selector: 'app-login',
  template: `
    <div class="page auth">
      <mat-card class="form-card">
        <bofa-page-header eyebrow="Enterprise SSO" title="Sign in to Online Banking"></bofa-page-header>
        <bofa-alert-banner level="error" *ngIf="error">{{ error }}</bofa-alert-banner>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Online ID</mat-label>
            <input matInput formControlName="username" autocomplete="username" data-test="username" />
            <mat-error *ngIf="form.get('username')?.hasError('required')">Online ID is required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Passcode</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="current-password" data-test="password" />
            <mat-error *ngIf="form.get('password')?.hasError('required')">Passcode is required</mat-error>
          </mat-form-field>
          <button mat-flat-button color="primary" type="submit" [disabled]="loading" anTrack="login_submit" data-test="login-submit">
            {{ loading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>
        <p class="muted hint">Demo credentials: {{ demo.username }} / {{ demo.password }}</p>
      </mat-card>
    </div>
  `,
  styles: ['.auth { display: flex; justify-content: center; padding-top: 64px; } .hint { margin-top: 16px; font-size: 13px; }'],
})
export class LoginComponent {
  readonly demo = DEMO_CREDENTIALS;
  loading = false;
  error = '';
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    const { username, password } = this.form.value;
    this.auth.authorize(username ?? '', password ?? '').subscribe({
      next: () => this.router.navigate(['/mfa'], { queryParamsHandling: 'preserve' }),
      error: () => {
        this.loading = false;
        this.error = 'The Online ID or Passcode you entered does not match our records.';
      },
    });
  }
}
