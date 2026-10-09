import { Directive, HostListener, Input } from '@angular/core';
import { AnalyticsService } from './analytics.service';

/** Usage: <button anTrack="transfer_submit" [anTrackProps]="{ from: 'checking' }">. */
@Directive({ selector: '[anTrack]' })
export class TrackDirective {
  @Input('anTrack') name = '';
  @Input() anTrackProps?: Record<string, unknown>;

  constructor(private analytics: AnalyticsService) {}

  @HostListener('click')
  onClick(): void {
    this.analytics.track('interaction', this.name, this.anTrackProps);
  }
}
