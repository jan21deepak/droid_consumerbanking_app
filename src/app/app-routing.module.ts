import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'dashboard',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'accounts',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/accounts/accounts.module').then(m => m.AccountsModule),
  },
  {
    path: 'transfers',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/transfers/transfers.module').then(m => m.TransfersModule),
  },
  {
    path: 'bill-pay',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/bill-pay/bill-pay.module').then(m => m.BillPayModule),
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
