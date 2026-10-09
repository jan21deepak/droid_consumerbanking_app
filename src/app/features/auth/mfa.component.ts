import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-mfa',
  template: `
    <div class="page auth">
      <mat-card class="form-card">
        <bofa-page-header eyebrow="Step-up verification" title="Enter your one-time code"
          [subtitle]="'We sent a 6-digit code to ' + (auth.pendingChallenge?.maskedDestination || 'your device')"></bofa-page-header>
        <bofa-alert-banner level="error" *ngIf="error">{{ error }}</bofa-alert-banner>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>One-time code</mat-label>
          <input matInput [formControl]="code" inputmode="numeric" maxlength="6" autocomplete="one-time-code" data-test="otp" />
          <mat-error *ngIf="code.hasError('pattern')">Enter the 6-digit code</mat-error>
        </mat-form-field>
        <button mat-flat-button color="primary" (click)="verify()" [disabled]="code.invalid || loading" anTrack="mfa_verify" data-test="otp-submit">
          Verify
        </button>
        <p class="muted hint">Demo code: 123456</p>
      </mat-card>
    </div>
  `,
  styles: ['.auth { display: flex; justify-content: center; padding-top: 64px; } .hint { margin-top: 16px; font-size: 13px; }'],
})
export class MfaComponent {
  code = new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]);
  loading = false;
  error = '';

  constructor(public auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  verify(): void {
    this.loading = true;
    this.auth.verifyMfa(this.code.value ?? '').subscribe({
      next: () => this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard'),
      error: () => {
        this.loading = false;
        this.error = 'That code is incorrect or has expired.';
      },
    });
  }
}
