import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account, Transaction } from '../models';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  constructor(private http: HttpClient) {}

  list(): Observable<Account[]> {
    return this.http.get<Account[]>('/api/accounts');
  }

  get(id: string): Observable<Account> {
    return this.http.get<Account>(`/api/accounts/${id}`);
  }

  transactions(id: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`/api/accounts/${id}/transactions`);
  }
}
