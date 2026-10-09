import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ANALYTICS_CONFIG, AnalyticsConfig, AnalyticsEvent } from './analytics.config';

const DEFAULT_REDACT = ['accountNumber', 'ssn', 'routingNumber', 'cardNumber', 'password', 'otp'];

@Injectable()
export class AnalyticsService implements OnDestroy {
  private queue: AnalyticsEvent[] = [];
  private subs = new Subscription();
  private readonly redact: string[];

  constructor(
    @Inject(ANALYTICS_CONFIG) private config: AnalyticsConfig,
    private http: HttpClient,
    router: Router
  ) {
    this.redact = [...DEFAULT_REDACT, ...(config.redactFields ?? [])];
    this.subs.add(
      router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(e => this.track('page_view', e.urlAfterRedirects))
    );
    this.subs.add(interval(config.flushIntervalMs ?? 10000).subscribe(() => this.flush()));
  }

  track(type: AnalyticsEvent['type'], name: string, props?: Record<string, unknown>): void {
    const event: AnalyticsEvent = { type, name, timestamp: Date.now(), props: props && this.scrub(props) };
    this.queue.push(event);
    if (this.config.debug) {
      console.debug('[analytics]', event);
    }
  }

  get pending(): readonly AnalyticsEvent[] {
    return this.queue;
  }

  /** Sends queued events. Returns the number of events flushed. */
  async flush(): Promise<number> {
    if (!this.queue.length) {
      return 0;
    }
    const batch = this.queue.splice(0, this.queue.length);
    await this.http.post(this.config.endpoint, { appId: this.config.appId, events: batch }).toPromise();
    return batch.length;
  }

  scrub(props: Record<string, unknown>): Record<string, unknown> {
    return Object.keys(props).reduce((acc, key) => {
      acc[key] = this.redact.includes(key) ? '[REDACTED]' : props[key];
      return acc;
    }, {} as Record<string, unknown>);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
