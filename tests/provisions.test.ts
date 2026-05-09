import { describe, expect, it } from 'vitest';
import { getProvisionRecommendation, splitIntoStacks } from '../src/lib/game/provisions';
import { getProvisionQuantities } from '../src/lib/data/provisions';

describe('provision recommendations', () => {
  it('splits quantities into actual stacks', () => {
    expect(splitIntoStacks(18, 12)).toEqual([12, 6]);
    expect(splitIntoStacks(8, 8)).toEqual([8]);
  });

  describe('parity with original site', () => {
    it('has long food at 20, not 24', () => {
      const quantities = getProvisionQuantities('ruins', 'long');
      expect(quantities.food).toBe(20);
    });

    it('matches base quantities for short missions', () => {
      const quantities = getProvisionQuantities('ruins', 'short');
      expect(quantities.food).toBe(12);
      expect(quantities.torches).toBe(8);
      expect(quantities.shovels).toBe(2);
    });

    it('matches base quantities for medium missions', () => {
      const quantities = getProvisionQuantities('ruins', 'medium');
      expect(quantities.firewood).toBe(1);
      expect(quantities.food).toBe(18);
      expect(quantities.torches).toBe(13);
      expect(quantities.shovels).toBe(3);
    });

    it('matches base quantities for long missions', () => {
      const quantities = getProvisionQuantities('ruins', 'long');
      expect(quantities.firewood).toBe(2);
      expect(quantities.food).toBe(20);
      expect(quantities.torches).toBe(16);
      expect(quantities.shovels).toBe(4);
    });

    it('calculates total cost for cove long', () => {
      const rec = getProvisionRecommendation('cove', 'long');
      expect(rec.lines.length).toBeGreaterThan(0);
      expect(rec.totalCost).toBeGreaterThan(0);
    });
  });
});