import { base } from '$app/paths';
import { initAnalytics } from '$lib/analytics';

export function init() {
  initAnalytics({
    token: import.meta.env.VITE_POSTHOG_PROJECT_TOKEN,
    host: import.meta.env.VITE_POSTHOG_HOST,
    origin: import.meta.env.VITE_POSTHOG_SITE_ORIGIN,
    base
  }, window.location);
}
