import { describe, expect, it } from 'vitest';
import { getProvisionRecommendation, splitIntoStacks } from '../src/lib/game/provisions';

describe('provision recommendations', () => {
  it('splits quantities into actual stacks', () => {
    expect(splitIntoStacks(18, 12)).toEqual([12, 6]);
    expect(splitIntoStacks(8, 8)).toEqual([8]);
  });

  it('defaults to safety-friendly totals over lean runs', () => {
    const lean = getProvisionRecommendation('cove', 'long', 'champion', 'lean');
    const safe = getProvisionRecommendation('cove', 'long', 'champion', 'safe');

    expect(safe.totalCost).toBeGreaterThan(lean.totalCost);
  });
});
