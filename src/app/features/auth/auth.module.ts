import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MfaGuard } from '../../core/auth/mfa.guard';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login.component';
import { MfaComponent } from './mfa.component';

@NgModule({
  declarations: [LoginComponent, MfaComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: 'login', component: LoginComponent },
      { path: 'mfa', component: MfaComponent, canActivate: [MfaGuard] },
    ]),
  ],
})
export class AuthModule {}
