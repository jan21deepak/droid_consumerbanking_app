import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HoldingsComponent } from './holdings.component';

const routes: Routes = [
  { path: '', component: HoldingsComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
