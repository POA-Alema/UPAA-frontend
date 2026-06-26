/**
 * Analytics utilities for tracking user interactions.
 * These events are sent to the backend for analysis.
 */

import { getPublicRuntimeConfig } from './config';

export type AnalyticsEventType =
  | 'architect-detail-open'
  | 'building-detail-open'
  | 'map-interaction'
  | 'search-query';

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  timestamp: number;
  data?: Record<string, unknown>;
}

/**
 * Track an analytics event
 * Silently fails if analytics is unavailable (no console spam)
 */
export async function trackEvent(
  type: AnalyticsEventType,
  data?: Record<string, unknown>
): Promise<void> {
  try {
    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      data,
    };

    // Send to backend analytics endpoint if available
    const { apiUrl } = getPublicRuntimeConfig();
    if (!apiUrl) return;

    await fetch(`${apiUrl.replace(/\/$/, '')}/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).catch(() => {
      // Silently fail - analytics should never break the app
    });
  } catch {
    // Ignore errors in analytics
  }
}
