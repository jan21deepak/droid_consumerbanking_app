import { InjectionToken } from '@angular/core';

export interface AnalyticsConfig {
  appId: string;
  endpoint: string;
  /** Flush the in-memory queue every N ms. */
  flushIntervalMs?: number;
  /** Field names that must never leave the browser (PII). */
  redactFields?: string[];
  debug?: boolean;
}

export const ANALYTICS_CONFIG = new InjectionToken<AnalyticsConfig>('ANALYTICS_CONFIG');

export interface AnalyticsEvent {
  type: 'page_view' | 'interaction' | 'api_timing' | 'error';
  name: string;
  timestamp: number;
  props?: Record<string, unknown>;
}
