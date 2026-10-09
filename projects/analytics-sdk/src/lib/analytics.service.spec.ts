import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ANALYTICS_CONFIG } from './analytics.config';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AnalyticsService,
        { provide: ANALYTICS_CONFIG, useValue: { appId: 'test', endpoint: '/beacon', flushIntervalMs: 60000 } },
      ],
    });
    service = TestBed.inject(AnalyticsService);
    http = TestBed.inject(HttpTestingController);
  });

  it('redacts PII fields before queueing', () => {
    service.track('interaction', 'transfer_submit', { accountNumber: '123456789', amount: 50 });
    expect(service.pending[0].props).toEqual({ accountNumber: '[REDACTED]', amount: 50 });
  });

  it('flushes the queue to the configured endpoint', async () => {
    service.track('interaction', 'a');
    service.track('interaction', 'b');
    const result = service.flush();
    const req = http.expectOne('/beacon');
    expect(req.request.body.events.length).toBe(2);
    req.flush({});
    expect(await result).toBe(2);
    expect(service.pending.length).toBe(0);
  });
});
