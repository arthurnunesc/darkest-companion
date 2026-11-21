import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CaptureResult } from 'posthog-js';

const sdk = vi.hoisted(() => ({ init: vi.fn(), capture: vi.fn() }));
vi.mock('posthog-js', () => ({ default: sdk }));

const config = { token: 'test-token', host: 'https://analytics.example', origin: 'https://example.com', base: '/app' };
const location = { origin: 'https://example.com', pathname: '/app/' };
const event = (name: string, extra: Record<string, unknown> = {}): CaptureResult => ({
  uuid: 'event-uuid', event: name,
  properties: { token: 'test-token', distinct_id: '$posthog_cookieless', $cookieless_mode: true, $process_person_profile: false, ...extra }
});

describe('analytics', () => {
  beforeEach(() => { vi.resetModules(); vi.clearAllMocks(); });

  it('stays off for missing or unapproved configuration and base paths', async () => {
    const { initAnalytics, capturePage } = await import('../src/lib/analytics');
    for (const cfg of [{ ...config, token: '' }, { ...config, host: 'http://insecure' }, { ...config, origin: 'https://other.example' }]) initAnalytics(cfg, location);
    initAnalytics(config, { ...location, pathname: '/app-other/' });
    capturePage('/app/');
    expect(sdk.init).not.toHaveBeenCalled();
    expect(sdk.capture).not.toHaveBeenCalled();
  });

  it('configures safe defaults and deduplicates canonical route changes', async () => {
    const { initAnalytics, capturePage } = await import('../src/lib/analytics');
    initAnalytics(config, location);
    expect(sdk.init).toHaveBeenCalledOnce();
    expect(sdk.init.mock.calls[0][1]).toMatchObject({ cookieless_mode: 'always', person_profiles: 'never', autocapture: false, capture_pageview: false, capture_pageleave: false, capture_dead_clicks: false, capture_performance: false, capture_exceptions: false, capture_heatmaps: false, disable_session_recording: true, disable_surveys: true, advanced_disable_feature_flags: true, save_campaign_params: false, save_referrer: false });
    for (const path of ['/app/', '/app/', '/app/team-compositions', '/app/team-compositions/', '/app/']) capturePage(path);
    expect(sdk.capture.mock.calls).toEqual([
      ['$pageview', { $current_url: 'https://example.com/app/' }],
      ['$pageview', { $current_url: 'https://example.com/app/team-compositions' }],
      ['$pageview', { $current_url: 'https://example.com/app/' }]
    ]);
  });

  it('drops unapproved events and values', async () => {
    const { sanitizeEvent } = await import('../src/lib/analytics');
    const sanitize = (e: CaptureResult) => sanitizeEvent(e, 'https://example.com/app/', config.token);
    expect(sanitize(event('$autocapture'))).toBeNull();
    expect(sanitize(event('expedition_filter_changed', { filter: 'q', value: 'secret' }))).toBeNull();
    expect(sanitize(event('expedition_filter_changed', { filter: 'location', value: 'secret' }))).toBeNull();
    expect(sanitize(event('team_hero_filter_changed', { hero: 'secret' }))).toBeNull();
    expect(sanitize(event('curio_view_changed', { view: 'secret' }))).toBeNull();
    expect(sanitize(event('$pageview', { $cookieless_mode: false }))).toBeNull();
    expect(sanitize(event('$pageview', { token: 'other' }))).toBeNull();
  });

  it('retains only routing fields and canonical URL, with no shared URL or referrer', async () => {
    const { sanitizeEvent } = await import('../src/lib/analytics');
    const result = sanitizeEvent({ ...event('expedition_shared', { $current_url: 'https://example.com/app/?q=secret#secret', $referrer: 'https://external.example/?q=secret', $set: { $initial_current_url: 'secret' } }), $set_once: { secret: 'secret' } }, 'https://example.com/app/', config.token);
    expect(result?.properties).toEqual({ token: 'test-token', distinct_id: '$posthog_cookieless', $cookieless_mode: true, $process_person_profile: false, $current_url: 'https://example.com/app/' });
    expect(result).not.toHaveProperty('$set_once');
    expect(sanitizeEvent(event('$pageview'), undefined, config.token)).toBeNull();
  });

  it('only sends the section name and arrival category for section views', async () => {
    const { sanitizeEvent } = await import('../src/lib/analytics');
    const sanitize = (e: CaptureResult) => sanitizeEvent(e, 'https://example.com/app/', config.token);
    const result = sanitize(event('section_viewed', { section: 'bosses', arrival: 'shortcut', scrollY: 1200, query: 'secret' }));
    expect(result?.properties).toMatchObject({ section: 'bosses', arrival: 'shortcut' });
    expect(result?.properties).not.toHaveProperty('scrollY');
    expect(result?.properties).not.toHaveProperty('query');
    expect(sanitize(event('section_viewed', { section: 'other', arrival: 'shortcut' }))).toBeNull();
    expect(sanitize(event('section_viewed', { section: 'bosses', arrival: 'other' }))).toBeNull();
  });
});
