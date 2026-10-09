import { Component } from '@angular/core';

@Component({
  selector: 'wp-root',
  template: `
    <mat-toolbar color="primary">
      <span>Wealth Portal</span>
      <span class="spacer"></span>
      <small>Downstream consumer of &#64;bofa-demo/ui</small>
    </mat-toolbar>
    <main class="wp-main"><router-outlet></router-outlet></main>
  `,
  styles: ['.spacer { flex: 1; } .wp-main { max-width: 1080px; margin: 0 auto; padding: 24px; }'],
})
export class AppComponent {}
