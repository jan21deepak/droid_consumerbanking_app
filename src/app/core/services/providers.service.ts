import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { CreditScore, ExternalAccount, MarketQuote } from '../models';

/** Third-party financial data providers (credit bureau, market data, account aggregation). */
@Injectable({ providedIn: 'root' })
export class ProvidersService {
  private market$?: Observable<MarketQuote[]>;

  constructor(private http: HttpClient) {}

  creditScore(): Observable<CreditScore | null> {
    return this.http.get<CreditScore>('/api/providers/credit-score').pipe(catchError(() => of(null)));
  }

  market(): Observable<MarketQuote[]> {
    this.market$ ??= this.http.get<MarketQuote[]>('/api/providers/market').pipe(
      catchError(() => of([])),
      shareReplay(1)
    );
    return this.market$;
  }

  externalAccounts(): Observable<ExternalAccount[]> {
    return this.http.get<ExternalAccount[]>('/api/providers/aggregation').pipe(catchError(() => of([])));
  }
}
