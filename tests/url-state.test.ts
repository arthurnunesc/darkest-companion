import { describe, expect, it } from 'vitest';
import { parseExpeditionParams } from '../src/lib/game/url-state';

describe('URL state', () => {
  it('uses safe defaults for missing params', () => {
    const state = parseExpeditionParams(new URLSearchParams());

    expect(state.location.id).toBe('ruins');
    expect(state.length).toBe('short');
    expect(state.risk).toBe('prepared');
    expect(state.view).toBe('by-curio');
  });

  it('parses location and length from params', () => {
    const state = parseExpeditionParams(new URLSearchParams('location=weald&length=long'));

    expect(state.location.id).toBe('weald');
    expect(state.length).toBe('long');
  });

  it('falls back to first valid length for location', () => {
    const state = parseExpeditionParams(new URLSearchParams('location=ruins&length=invalid'));

    expect(state.location.id).toBe('ruins');
    expect(state.length).toBe('short');
  });

  it('parses risk profile from params', () => {
    const state = parseExpeditionParams(new URLSearchParams('risk=destitute'));

    expect(state.risk).toBe('destitute');
  });

  it('parses paranoid risk profile', () => {
    const state = parseExpeditionParams(new URLSearchParams('risk=paranoid'));

    expect(state.risk).toBe('paranoid');
  });

  it('defaults risk to prepared for invalid value', () => {
    const state = parseExpeditionParams(new URLSearchParams('risk=whatever'));

    expect(state.risk).toBe('prepared');
  });

  it('defaults risk to prepared when absent', () => {
    const state = parseExpeditionParams(new URLSearchParams('location=cove&length=medium'));

    expect(state.risk).toBe('prepared');
  });
});