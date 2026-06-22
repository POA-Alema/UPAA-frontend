'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

/**
 * Hook to track architect detail page views
 * Fires once when the component mounts
 */
export function useArchitectDetailTracking(architectSlug: string, architectTitle?: string): void {
  useEffect(() => {
    trackEvent('architect-detail-open', {
      slug: architectSlug,
      title: architectTitle,
    });
  }, [architectSlug, architectTitle]);
}
