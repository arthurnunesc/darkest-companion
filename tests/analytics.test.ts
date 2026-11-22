import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const config = { token: 'phc_test', host: 'https://analytics.example', origin: 'https://example.com', base: '/app' };
const location = { origin: 'https://example.com', pathname: '/app/' };
const fetchMock = vi.fn<typeof fetch>();
const storage = vi.fn(() => { throw new Error('Analytics must not access browser storage'); });

const bodies = () => fetchMock.mock.calls.map(([, options]) => JSON.parse(options?.body as string));

describe('analytics', () => {
  beforeEach(() => {
    vi.resetModules();
    storage.mockClear();
    fetchMock.mockReset().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('navigator', { userAgent: 'Test Browser' });
    const storageTrap = { getItem: storage, setItem: storage, removeItem: storage };
    vi.stubGlobal('localStorage', storageTrap);
    vi.stubGlobal('sessionStorage', storageTrap);
    vi.stubGlobal('document', { get cookie() { return storage(); }, set cookie(_value: string) { storage(); } });
  });
  afterEach(() => {
    expect(storage).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('makes no requests with missing or unapproved configuration', async () => {
    const { initAnalytics, capturePage } = await import('../src/lib/analytics');
    for (const cfg of [{ ...config, token: '' }, { ...config, token: 'phx_notpublic' },
      { ...config, host: 'http://insecure' }, { ...config, origin: 'https://other.example' }]) initAnalytics(cfg, location);
    initAnalytics(config, { ...location, pathname: '/app-other/' });
    capturePage('/app/');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('deduplicates canonical pageviews and never tracks the privacy page', async () => {
    const { initAnalytics, capturePage, captureAction } = await import('../src/lib/analytics');
    initAnalytics(config, { ...location, pathname: '/app/privacy/' });
    capturePage('/app/privacy/');
    captureAction('expedition_shared');
    expect(fetchMock).not.toHaveBeenCalled();
    for (const route of ['/app/', '/app', '/app/team-compositions', '/app/team-compositions/', '/app/privacy/', '/app/']) capturePage(route);
    expect(bodies().map((body) => body.properties.$current_url)).toEqual([
      'https://example.com/app/', 'https://example.com/app/team-compositions', 'https://example.com/app/'
    ]);
  });

  it('sends only approved action fields, without cookies or HTTP referrer', async () => {
    const { initAnalytics, capturePage, captureAction } = await import('../src/lib/analytics');
    initAnalytics(config, location);
    capturePage('/app/');
    fetchMock.mockClear();
    captureAction('section_viewed', { section: 'bosses', arrival: 'shortcut', scrollY: '1200', query: 'secret', $current_url: 'https://example.com/app/?q=secret', $host: 'invalid.example', $raw_user_agent: 'invalid' });
    captureAction('section_viewed', { section: 'other', arrival: 'shortcut' });
    captureAction('section_viewed', { section: 'bosses', arrival: 'other' });
    captureAction('expedition_filter_changed', { filter: 'q', value: 'secret' });
    captureAction('expedition_filter_changed', { filter: 'location', value: 'secret' });
    captureAction('team_hero_filter_changed', { hero: 'secret' });
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('https://analytics.example/i/v0/e/', expect.objectContaining({
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit',
      redirect: 'error', referrerPolicy: 'no-referrer', keepalive: true
    }));
    expect(bodies()).toEqual([{
      api_key: 'phc_test', event: 'section_viewed', distinct_id: '$posthog_cookieless',
      properties: { $current_url: 'https://example.com/app/', $cookieless_mode: true,
        $host: 'example.com', $raw_user_agent: 'Test Browser',
        $process_person_profile: false, section: 'bosses', arrival: 'shortcut' }
    }]);
  });

  it('skips events if the browser does not provide a user agent', async () => {
    vi.stubGlobal('navigator', { userAgent: '' });
    const { initAnalytics, capturePage } = await import('../src/lib/analytics');
    initAnalytics(config, location);
    capturePage('/app/');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not propagate a network failure to the planner', async () => {
    const { initAnalytics, capturePage } = await import('../src/lib/analytics');
    fetchMock.mockRejectedValueOnce(new Error('blocked'));
    initAnalytics(config, location);
    expect(() => capturePage('/app/')).not.toThrow();
    await Promise.resolve();
  });
});
