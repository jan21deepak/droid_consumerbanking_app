import { Component } from '@angular/core';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary" class="topbar" fxLayout="row" fxLayoutAlign="start center">
      <mat-icon class="logo">account_balance</mat-icon>
      <span class="brand">Digital Banking</span>
      <span class="spacer"></span>
      <ng-container *ngIf="auth.user$ | async as user">
        <button mat-button [matMenuTriggerFor]="menu" data-test="user-menu">
          <mat-icon>person</mat-icon> {{ user.firstName }} {{ user.lastName }}
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="auth.logout()" data-test="logout"><mat-icon>logout</mat-icon> Sign out</button>
        </mat-menu>
      </ng-container>
    </mat-toolbar>
    <mat-sidenav-container class="container">
      <mat-sidenav mode="side" [opened]="(auth.user$ | async) !== null" class="nav">
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active"><mat-icon>dashboard</mat-icon>&nbsp; Accounts overview</a>
          <a mat-list-item routerLink="/transfers" routerLinkActive="active"><mat-icon>swap_horiz</mat-icon>&nbsp; Transfer money</a>
          <a mat-list-item routerLink="/bill-pay" routerLinkActive="active"><mat-icon>receipt_long</mat-icon>&nbsp; Bill pay</a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content><router-outlet></router-outlet></mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .topbar { position: sticky; top: 0; z-index: 2; }
    .logo { margin-right: 8px; }
    .brand { font-weight: 600; letter-spacing: .02em; }
    .spacer { flex: 1; }
    .container { min-height: calc(100vh - 64px); background: transparent; }
    .nav { width: 240px; border-right: 1px solid #e3e7ef; }
    .active { background: #e6eaf1; color: #012169; font-weight: 600; }
  `],
})
export class ShellComponent {
  constructor(public auth: AuthService) {}
}
