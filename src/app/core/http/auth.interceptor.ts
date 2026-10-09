// @security-reviewed SEC-2291 (2026-03-14, AppSec Consumer Apps). Behavior changes need a new review: docs/engineering/frontend-upgrade-policy.md (G3).
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

let sequence = 0;

/** Adds the SSO bearer token and a correlation id required by the API gateway. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const headers: Record<string, string> = { 'X-Correlation-Id': `dbx-${Date.now()}-${++sequence}` };
    const token = this.auth.token;
    if (token && req.url.startsWith('/api/') && !req.url.startsWith('/api/sso/')) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return next.handle(req.clone({ setHeaders: headers }));
  }
}
