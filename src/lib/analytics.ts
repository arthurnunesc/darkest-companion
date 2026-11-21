import posthog from 'posthog-js';
import type { CaptureResult, PostHogConfig } from 'posthog-js';
import { locations } from './data/locations';
import { provisionRiskProfiles } from './data/provisions';
import { heroes } from './data/heroes';
import { curioViews } from './expedition-state';

type Config = { token?: string; host?: string; origin?: string; base: string };
let active: { origin: string; base: string; token: string } | undefined;
let previousRoute: string | undefined;

function validOrigin(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.origin === value && url.protocol === 'https:' && !url.username && !url.password;
  } catch { return false; }
}

export function canonicalUrl(pathname: string, origin: string, base: string): string | undefined {
  const root = `${base}/`;
  if (pathname === base || pathname === root) return `${origin}${root}`;
  if (pathname === `${base}/team-compositions` || pathname === `${base}/team-compositions/`)
    return `${origin}${base}/team-compositions`;
}

const values: Record<string, readonly string[]> = {
  location: locations.map((location) => location.id),
  length: ['short', 'medium', 'long'],
  risk: provisionRiskProfiles.map((profile) => profile.id),
  view: curioViews.map((view) => view.id),
  hero: ['all', 'arbalest-musketeer', ...heroes.filter((hero) => hero.id !== 'arbalest' && hero.id !== 'musketeer').map((hero) => hero.id)]
};

export function sanitizeEvent(event: CaptureResult, url: string | undefined, token: string): CaptureResult | null {
  if (!url) return null;
  const source = event.properties;
  const properties: Record<string, unknown> = { $current_url: url };
  // Cookieless ingestion depends on these SDK-generated fields. Never copy other identity fields.
  if (source.token !== token || source.distinct_id !== '$posthog_cookieless' || source.$cookieless_mode !== true || source.$process_person_profile !== false) return null;
  properties.token = token;
  properties.distinct_id = '$posthog_cookieless';
  properties.$cookieless_mode = true;
  properties.$process_person_profile = false;
  switch (event.event) {
    case '$pageview':
    case 'expedition_shared':
      break;
    case 'expedition_filter_changed':
      if (typeof source.filter !== 'string' || !['location', 'length', 'risk'].includes(source.filter) ||
          typeof source.value !== 'string' || !values[source.filter].includes(source.value)) return null;
      properties.filter = source.filter;
      properties.value = source.value;
      break;
    case 'curio_view_changed':
      if (typeof source.view !== 'string' || !values.view.includes(source.view)) return null;
      properties.view = source.view;
      break;
    case 'team_hero_filter_changed':
      if (typeof source.hero !== 'string' || !values.hero.includes(source.hero)) return null;
      properties.hero = source.hero;
      break;
    default: return null;
  }
  return { uuid: event.uuid, event: event.event, properties, timestamp: event.timestamp };
}

export function initAnalytics(config: Config, location: Pick<Location, 'origin' | 'pathname'>) {
  if (active || !config.token?.trim() || config.token !== config.token.trim() ||
      !validOrigin(config.host) || !validOrigin(config.origin) || location.origin !== config.origin ||
      !(location.pathname === config.base || location.pathname.startsWith(`${config.base}/`))) return;
  active = { origin: config.origin, base: config.base, token: config.token };
  const options: Partial<PostHogConfig> = {
    api_host: config.host, cookieless_mode: 'always', person_profiles: 'never',
    autocapture: false, capture_pageview: false, capture_pageleave: false,
    capture_dead_clicks: false, capture_performance: false, capture_exceptions: false,
    capture_heatmaps: false, disable_session_recording: true, disable_surveys: true,
    advanced_disable_feature_flags: true, disable_external_dependency_loading: true,
    save_referrer: false, save_campaign_params: false,
    before_send: (event) => sanitizeEvent(event, active && canonicalUrl(window.location.pathname, active.origin, active.base), config.token!)
  };
  posthog.init(config.token, options);
}

export function capturePage(pathname: string) {
  if (!active) return;
  const url = canonicalUrl(pathname, active.origin, active.base);
  if (!url) { previousRoute = undefined; return; }
  if (url === previousRoute) return;
  previousRoute = url;
  posthog.capture('$pageview', { $current_url: url });
}

export function captureAction(event: 'expedition_filter_changed' | 'curio_view_changed' | 'team_hero_filter_changed' | 'expedition_shared', properties: Record<string, string> = {}) {
  if (active) posthog.capture(event, properties);
}
