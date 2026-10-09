import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Account } from '../models';
import { AccountsService } from './accounts.service';

@Injectable({ providedIn: 'root' })
export class AccountResolver implements Resolve<Account> {
  constructor(private accounts: AccountsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Account> {
    return this.accounts.get(route.paramMap.get('id') ?? '');
  }
}
