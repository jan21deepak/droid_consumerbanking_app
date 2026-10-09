import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountResolver } from '../../core/services/account.resolver';
import { SharedModule } from '../../shared/shared.module';
import { AccountDetailComponent } from './account-detail.component';

@NgModule({
  declarations: [AccountDetailComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: ':id', component: AccountDetailComponent, resolve: { account: AccountResolver } },
      { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
    ]),
  ],
})
export class AccountsModule {}
