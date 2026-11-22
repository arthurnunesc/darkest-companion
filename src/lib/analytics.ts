import { locations } from './data/locations';
import { provisionRiskProfiles } from './data/provisions';
import { heroes } from './data/heroes';
import { curioViews } from './expedition-state';
import type { PlannerSection, SectionArrival } from './section-reach';

type Config = { token?: string; host?: string; origin?: string; base: string };
type ActiveConfig = { origin: string; base: string; token: string; host: string };
let active: ActiveConfig | undefined;
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

function eventProperties(event: string, source: Record<string, unknown>, url: string) {
  const properties: Record<string, string | boolean> = {
    $current_url: url,
    $cookieless_mode: true,
    $process_person_profile: false
  };
  switch (event) {
    case '$pageview':
    case 'expedition_shared':
      break;
    case 'section_viewed':
      if ((source.section !== 'bosses' && source.section !== 'curios') ||
          (source.arrival !== 'shortcut' && source.arrival !== 'scroll_or_direct')) return null;
      properties.section = source.section;
      properties.arrival = source.arrival;
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
  return properties;
}

export function initAnalytics(config: Config, location: Pick<Location, 'origin' | 'pathname'>) {
  if (active || !config.token || !/^phc_[A-Za-z0-9]+$/.test(config.token) ||
      !validOrigin(config.host) || !validOrigin(config.origin) || location.origin !== config.origin ||
      !(location.pathname === config.base || location.pathname.startsWith(`${config.base}/`))) return;
  active = { origin: config.origin, base: config.base, token: config.token, host: config.host };
}

function send(event: string, url: string, properties: Record<string, string>, config: ActiveConfig) {
  const allowed = eventProperties(event, properties, url);
  const userAgent = globalThis.navigator?.userAgent;
  if (!allowed || !userAgent) return;
  // The Capture API processes the cookieless sentinel server-side. Do not use the
  // browser SDK here: it probes browser storage even in cookieless mode.
  // Capture derives the IP from the connection; only supply the other hash inputs.
  void fetch(`${config.host}/i/v0/e/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'omit',
    redirect: 'error',
    referrerPolicy: 'no-referrer',
    keepalive: true,
    body: JSON.stringify({
      api_key: config.token,
      event,
      distinct_id: '$posthog_cookieless',
      properties: { ...allowed, $host: new URL(config.origin).host, $raw_user_agent: userAgent }
    })
  }).catch(() => {
    // Analytics is optional; a blocked request must not affect the planner.
  });
}

export function capturePage(pathname: string) {
  if (!active) return;
  const url = canonicalUrl(pathname, active.origin, active.base);
  if (!url) { previousRoute = undefined; return; }
  if (url === previousRoute) return;
  previousRoute = url;
  send('$pageview', url, {}, active);
}

export function captureAction(event: 'expedition_filter_changed' | 'curio_view_changed' | 'team_hero_filter_changed' | 'expedition_shared' | 'section_viewed', properties: Record<string, string> = {}) {
  if (active && previousRoute) send(event, previousRoute, properties, active);
}

export function captureSection(section: PlannerSection, arrival: SectionArrival) {
  captureAction('section_viewed', { section, arrival });
}

export function analyticsEnabled() {
  return !!active;
}
