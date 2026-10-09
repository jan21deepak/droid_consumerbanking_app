import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Account, Transaction } from '../../core/models';
import { AccountsService } from '../../core/services/accounts.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styles: [
    '.summary { display: flex; gap: 48px; margin-bottom: 24px; } .summary .value { font-size: 24px; font-weight: 600; color: #012169; }',
    'table { width: 100%; } .filter { width: 320px; } .pending { font-size: 11px; color: #8a5300; margin-left: 6px; }',
  ],
})
export class AccountDetailComponent implements OnInit {
  account!: Account;
  readonly columns = ['date', 'description', 'category', 'amount'];
  search = new FormControl('');
  private all$ = new BehaviorSubject<Transaction[]>([]);
  filtered$!: Observable<Transaction[]>;

  constructor(private route: ActivatedRoute, private accounts: AccountsService) {}

  ngOnInit(): void {
    this.account = this.route.snapshot.data['account'];
    this.accounts.transactions(this.account.id).subscribe(t => this.all$.next(t));
    this.filtered$ = combineLatest([this.all$, this.search.valueChanges.pipe(startWith(''))]).pipe(
      map(([txns, q]) => filterTransactions(txns, q ?? ''))
    );
  }
}

export function filterTransactions(txns: Transaction[], query: string): Transaction[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return txns;
  }
  return txns.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
}
