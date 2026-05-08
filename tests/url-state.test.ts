import { describe, expect, it } from 'vitest';
import { parseExpeditionParams } from '../src/lib/game/url-state';

describe('URL state', () => {
  it('uses safe defaults for missing params', () => {
    const state = parseExpeditionParams(new URLSearchParams());

    expect(state.location.id).toBe('ruins');
    expect(state.length).toBe('short');
    expect(state.risk).toBe('safe');
    expect(state.view).toBe('by-curio');
  });

  it('falls back to valid length when location does not support requested length', () => {
    const state = parseExpeditionParams(new URLSearchParams('location=farmstead&length=long'));

    expect(state.location.id).toBe('farmstead');
    expect(state.length).toBe('endless');
  });
});
