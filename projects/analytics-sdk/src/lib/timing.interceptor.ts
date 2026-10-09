import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ANALYTICS_CONFIG, AnalyticsConfig } from './analytics.config';
import { AnalyticsService } from './analytics.service';

/** Emits an api_timing beacon for each API call (except the analytics endpoint itself). */
@Injectable()
export class AnalyticsTimingInterceptor implements HttpInterceptor {
  constructor(private analytics: AnalyticsService, @Inject(ANALYTICS_CONFIG) private config: AnalyticsConfig) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.startsWith(this.config.endpoint)) {
      return next.handle(req);
    }
    const started = performance.now();
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.analytics.track('api_timing', `${req.method} ${req.urlWithParams}`, {
            status: event.status,
            ms: Math.round(performance.now() - started),
          });
        }
      })
    );
  }
}
