import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ANALYTICS_CONFIG, AnalyticsConfig } from './analytics.config';
import { AnalyticsService } from './analytics.service';
import { AnalyticsTimingInterceptor } from './timing.interceptor';
import { TrackDirective } from './track.directive';

@NgModule({
  declarations: [TrackDirective],
  exports: [TrackDirective],
})
export class AnalyticsModule {
  static forRoot(config: AnalyticsConfig): ModuleWithProviders<AnalyticsModule> {
    return {
      ngModule: AnalyticsModule,
      providers: [
        { provide: ANALYTICS_CONFIG, useValue: config },
        AnalyticsService,
        { provide: HTTP_INTERCEPTORS, useClass: AnalyticsTimingInterceptor, multi: true },
      ],
    };
  }
}
