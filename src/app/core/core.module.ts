import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, Provider, SkipSelf } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthInterceptor } from './http/auth.interceptor';
import { ErrorInterceptor } from './http/error.interceptor';
import { MockBackendInterceptor } from './mock/mock-backend.interceptor';

const interceptors: Provider[] = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
];
if (environment.useMockBackend) {
  interceptors.push({ provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true });
}

@NgModule({
  imports: [HttpClientModule],
  providers: interceptors,
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parent?: CoreModule) {
    if (parent) {
      throw new Error('CoreModule is already loaded. Import it in AppModule only.');
    }
  }
}
