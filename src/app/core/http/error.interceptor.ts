// @security-reviewed SEC-2291 (2026-03-14, AppSec Consumer Apps). Behavior changes need a new review: docs/engineering/frontend-upgrade-policy.md (G3).
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BofaToastService } from '@bofa-demo/ui';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private toast: BofaToastService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !req.url.startsWith('/api/sso/')) {
          this.toast.show('Your session has expired. Please sign in again.');
          this.auth.logout();
        } else if (err.status >= 500 || err.status === 0) {
          this.toast.show('We are having trouble reaching our servers. Please try again.');
        }
        return throwError(() => err);
      })
    );
  }
}
