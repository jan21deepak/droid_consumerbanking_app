import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BillPayment, Confirmation, Payee, TransferRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  constructor(private http: HttpClient) {}

  transfer(req: TransferRequest): Observable<Confirmation> {
    return this.http.post<Confirmation>('/api/transfers', req);
  }

  payees(): Observable<Payee[]> {
    return this.http.get<Payee[]>('/api/billpay/payees');
  }

  payBill(payment: BillPayment): Observable<Confirmation> {
    return this.http.post<Confirmation>('/api/billpay/payments', payment);
  }
}
