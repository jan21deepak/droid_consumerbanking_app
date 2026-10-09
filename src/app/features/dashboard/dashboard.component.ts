import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { Account, CreditScore, ExternalAccount, MarketQuote } from '../../core/models';
import { AccountsService } from '../../core/services/accounts.service';
import { ProvidersService } from '../../core/services/providers.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  accounts$!: Observable<Account[]>;
  creditScore$!: Observable<CreditScore | null>;
  market$!: Observable<MarketQuote[]>;
  external$!: Observable<ExternalAccount[]>;
  showBanner = true;

  constructor(
    public auth: AuthService,
    private accounts: AccountsService,
    private providers: ProvidersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accounts$ = this.accounts.list();
    this.creditScore$ = this.providers.creditScore();
    this.market$ = this.providers.market();
    this.external$ = this.providers.externalAccounts();
  }

  open(account: Account): void {
    this.router.navigate(['/accounts', account.id]);
  }

  trackById(_: number, a: Account): string {
    return a.id;
  }
}
