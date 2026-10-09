import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { Account, BillPayment, Confirmation, TransferRequest } from '../models';
import { MOCK_ACCOUNTS, MOCK_PAYEES, MOCK_USER, buildTransactions } from './mock-data';

export const DEMO_CREDENTIALS = { username: 'demo', password: 'Demo@1234', otp: '123456' };

/**
 * In-browser stand-in for the API gateway, Enterprise SSO and third-party data providers so the
 * app runs with `ng serve` and no backend. Disabled when `environment.useMockBackend` is false.
 */
@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  private accounts: Account[] = MOCK_ACCOUNTS.map(a => ({ ...a }));
  private transactions = buildTransactions();
  private confirmations = 0;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!req.url.startsWith('/api/')) {
      return next.handle(req);
    }
    return of(null).pipe(
      mergeMap(() => this.route(req)),
      delay(250)
    );
  }

  private route(req: HttpRequest<any>): Observable<HttpEvent<unknown>> {
    const { url, method, body } = req;
    const authed = req.headers.get('Authorization')?.startsWith('Bearer ');

    if (url === '/api/sso/authorize' && method === 'POST') {
      if (body.username !== DEMO_CREDENTIALS.username || body.password !== DEMO_CREDENTIALS.password) {
        return this.error(401, 'invalid_credentials');
      }
      return this.ok({ challengeId: 'ch-' + Date.now(), mfaRequired: true, deliveryChannel: 'sms', maskedDestination: '(•••) •••-4417' });
    }
    if (url === '/api/sso/mfa/verify' && method === 'POST') {
      if (body.code !== DEMO_CREDENTIALS.otp) {
        return this.error(401, 'invalid_otp');
      }
      return this.ok({ accessToken: 'mock.' + btoa(MOCK_USER.id), expiresAt: Date.now() + 15 * 60000, user: MOCK_USER });
    }
    if (url.startsWith('/api/analytics')) {
      return this.ok({ accepted: true });
    }
    if (!authed) {
      return this.error(401, 'unauthorized');
    }

    if (url === '/api/accounts' && method === 'GET') {
      return this.ok(this.accounts);
    }
    const acct = url.match(/^\/api\/accounts\/([\w-]+)$/);
    if (acct && method === 'GET') {
      const found = this.accounts.find(a => a.id === acct[1]);
      return found ? this.ok(found) : this.error(404, 'not_found');
    }
    const txns = url.match(/^\/api\/accounts\/([\w-]+)\/transactions$/);
    if (txns && method === 'GET') {
      return this.ok(this.transactions.filter(t => t.accountId === txns[1]));
    }
    if (url === '/api/transfers' && method === 'POST') {
      return this.transfer(body as TransferRequest);
    }
    if (url === '/api/billpay/payees' && method === 'GET') {
      return this.ok(MOCK_PAYEES);
    }
    if (url === '/api/billpay/payments' && method === 'POST') {
      const p = body as BillPayment;
      const from = this.accounts.find(a => a.id === p.fromAccountId);
      if (!from || p.amount <= 0 || p.amount > from.available) {
        return this.error(422, 'insufficient_funds');
      }
      return this.ok(this.confirm('scheduled'));
    }

    // Third-party financial data providers (proxied through the gateway).
    if (url === '/api/providers/credit-score') {
      return this.ok({ provider: 'FICO® Score 8 via TransUnion', score: 782, band: 'Very Good', asOf: '2026-10-01' });
    }
    if (url === '/api/providers/market') {
      return this.ok([
        { symbol: 'SPX', name: 'S&P 500', price: 6512.44, change: 0.42 },
        { symbol: 'DJI', name: 'Dow Jones', price: 46210.9, change: -0.18 },
        { symbol: 'IXIC', name: 'Nasdaq', price: 21877.3, change: 0.77 },
      ]);
    }
    if (url === '/api/providers/aggregation') {
      return this.ok([
        { institution: 'Wells Fargo', name: 'Everyday Checking', mask: '2291', balance: 1840.22 },
        { institution: 'Fidelity', name: '401(k)', mask: '7710', balance: 118440.0 },
      ]);
    }
    return this.error(404, 'not_found');
  }

  private transfer(t: TransferRequest): Observable<HttpEvent<unknown>> {
    const from = this.accounts.find(a => a.id === t.fromAccountId);
    const to = this.accounts.find(a => a.id === t.toAccountId);
    if (!from || !to || from === to) {
      return this.error(400, 'invalid_accounts');
    }
    if (t.amount <= 0 || t.amount > from.available) {
      return this.error(422, 'insufficient_funds');
    }
    from.balance -= t.amount;
    from.available -= t.amount;
    to.balance += t.amount;
    to.available += t.amount;
    const now = new Date().toISOString();
    this.transactions.unshift(
      { id: `x${Date.now()}a`, accountId: from.id, date: now, description: `Transfer to ${to.name}`, category: 'Transfer', amount: -t.amount, pending: true },
      { id: `x${Date.now()}b`, accountId: to.id, date: now, description: `Transfer from ${from.name}`, category: 'Transfer', amount: t.amount, pending: true }
    );
    return this.ok(this.confirm('completed'));
  }

  private confirm(status: Confirmation['status']): Confirmation {
    return { confirmationNumber: `DBX${(100000 + ++this.confirmations).toString()}`, status };
  }

  private ok(body: unknown): Observable<HttpEvent<unknown>> {
    return of(new HttpResponse({ status: 200, body }));
  }

  private error(status: number, error: string): Observable<never> {
    return throwError(() => ({ status, error: { error } }));
  }
}
