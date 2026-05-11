import { describe, expect, it } from 'vitest';
import { getProvisionQuantities, getProvisionRecommendation, splitIntoStacks } from '../src/lib/data/provisions';
import type { LocationId, MissionLength, ProvisionId, ProvisionRiskProfile } from '../src/lib/data/types';

const locations: LocationId[] = ['ruins', 'warrens', 'weald', 'cove'];
const lengths: MissionLength[] = ['short', 'medium', 'long'];
const risks: ProvisionRiskProfile[] = ['destitute', 'prepared', 'paranoid'];

const originalPreparedProvisions: Record<LocationId, Record<MissionLength, Record<ProvisionId, number>>> = {
  ruins: {
    short: { firewood: 0, food: 12, torches: 8, shovels: 2, antivenoms: 0, bandages: 1, herbs: 1, keys: 1, holyWaters: 2 },
    medium: { firewood: 1, food: 18, torches: 13, shovels: 3, antivenoms: 0, bandages: 2, herbs: 2, keys: 2, holyWaters: 3 },
    long: { firewood: 2, food: 20, torches: 16, shovels: 4, antivenoms: 0, bandages: 3, herbs: 3, keys: 3, holyWaters: 4 }
  },
  warrens: {
    short: { firewood: 0, food: 12, torches: 10, shovels: 2, antivenoms: 0, bandages: 1, herbs: 3, keys: 2, holyWaters: 2 },
    medium: { firewood: 1, food: 18, torches: 16, shovels: 3, antivenoms: 1, bandages: 2, herbs: 4, keys: 3, holyWaters: 3 },
    long: { firewood: 2, food: 20, torches: 20, shovels: 4, antivenoms: 1, bandages: 3, herbs: 5, keys: 3, holyWaters: 4 }
  },
  weald: {
    short: { firewood: 0, food: 12, torches: 8, shovels: 3, antivenoms: 2, bandages: 2, herbs: 1, keys: 1, holyWaters: 1 },
    medium: { firewood: 1, food: 18, torches: 13, shovels: 5, antivenoms: 3, bandages: 3, herbs: 2, keys: 2, holyWaters: 2 },
    long: { firewood: 2, food: 20, torches: 16, shovels: 6, antivenoms: 4, bandages: 4, herbs: 2, keys: 2, holyWaters: 3 }
  },
  cove: {
    short: { firewood: 0, food: 12, torches: 8, shovels: 3, antivenoms: 0, bandages: 2, herbs: 2, keys: 1, holyWaters: 0 },
    medium: { firewood: 1, food: 18, torches: 13, shovels: 5, antivenoms: 0, bandages: 4, herbs: 3, keys: 2, holyWaters: 1 },
    long: { firewood: 2, food: 20, torches: 16, shovels: 6, antivenoms: 0, bandages: 6, herbs: 4, keys: 3, holyWaters: 1 }
  }
};

describe('provision recommendations', () => {
  it('splits quantities into actual stacks', () => {
    expect(splitIntoStacks(18, 12)).toEqual([12, 6]);
    expect(splitIntoStacks(8, 8)).toEqual([8]);
  });

  describe('parity with original site (prepared)', () => {
    it('matches every original prepared provision value one to one', () => {
      for (const location of locations) {
        for (const length of lengths) {
          expect(getProvisionQuantities(location, length, 'prepared')).toEqual(
            originalPreparedProvisions[location][length]
          );
        }
      }
    });

    it('calculates total cost for cove long', () => {
      const rec = getProvisionRecommendation('cove', 'long');
      expect(rec.lines.length).toBeGreaterThan(0);
      expect(rec.totalCost).toBeGreaterThan(0);
    });

    it('keeps stack quantities aligned with quantity-specific icons', () => {
      const rec = getProvisionRecommendation('cove', 'medium');
      const food = rec.lines.find((line) => line.id === 'food');

      expect(food?.stacks.map((stack) => ({
        quantity: stack.quantity,
        icon: stack.provision.icon
      }))).toEqual([
        { quantity: 12, icon: '/icons/provisions/Food_3.png' },
        { quantity: 6, icon: '/icons/provisions/Food_2.png' }
      ]);
    });
  });

  describe('risk profiles', () => {
    it('prepared equals baseline for all locations and lengths', () => {
      for (const location of locations) {
        for (const length of lengths) {
          const baseline = getProvisionQuantities(location, length);
          const prepared = getProvisionQuantities(location, length, 'prepared');
          expect(prepared).toEqual(baseline);
        }
      }
    });

    it('destitute <= prepared <= paranoid for every provision', () => {
      for (const location of locations) {
        for (const length of lengths) {
          const prepared = getProvisionQuantities(location, length, 'prepared');
          const destitute = getProvisionQuantities(location, length, 'destitute');
          const paranoid = getProvisionQuantities(location, length, 'paranoid');

          for (const key of Object.keys(prepared) as (keyof typeof prepared)[]) {
            const d = destitute[key] ?? 0;
            const p = prepared[key] ?? 0;
            const pa = paranoid[key] ?? 0;
            expect(d).toBeLessThanOrEqual(p);
            expect(p).toBeLessThanOrEqual(pa);
          }
        }
      }
    });

    it('destitute never drops a present provision below 1', () => {
      for (const location of locations) {
        for (const length of lengths) {
          const prepared = getProvisionQuantities(location, length, 'prepared');
          const destitute = getProvisionQuantities(location, length, 'destitute');

          for (const key of Object.keys(prepared) as (keyof typeof prepared)[]) {
            if ((prepared[key] ?? 0) > 0) {
              expect(destitute[key] ?? 0).toBeGreaterThanOrEqual(1);
            }
          }
        }
      }
    });

    it('firewood is fixed across all risk profiles', () => {
      for (const location of locations) {
        for (const length of lengths) {
          const destitute = getProvisionQuantities(location, length, 'destitute');
          const prepared = getProvisionQuantities(location, length, 'prepared');
          const paranoid = getProvisionQuantities(location, length, 'paranoid');
          expect(destitute.firewood).toBe(prepared.firewood);
          expect(paranoid.firewood).toBe(prepared.firewood);
        }
      }
    });

    it('torches are fixed across all risk profiles', () => {
      for (const location of locations) {
        for (const length of lengths) {
          const destitute = getProvisionQuantities(location, length, 'destitute');
          const prepared = getProvisionQuantities(location, length, 'prepared');
          const paranoid = getProvisionQuantities(location, length, 'paranoid');
          expect(destitute.torches).toBe(prepared.torches);
          expect(paranoid.torches).toBe(prepared.torches);
        }
      }
    });

    it('applies 0.8x floor for destitute on buyable provisions', () => {
      const prepared = getProvisionQuantities('ruins', 'long');
      const destitute = getProvisionQuantities('ruins', 'long', 'destitute');

      expect(destitute.food).toBe(Math.max(1, Math.floor(20 * 0.8)));
      expect(destitute.shovels).toBe(Math.max(1, Math.floor(4 * 0.8)));
    });

    it('applies 1.2x ceil for paranoid on buyable provisions', () => {
      const prepared = getProvisionQuantities('ruins', 'long');
      const paranoid = getProvisionQuantities('ruins', 'long', 'paranoid');

      expect(paranoid.food).toBe(Math.ceil(20 * 1.2));
      expect(paranoid.shovels).toBe(Math.ceil(4 * 1.2));
    });

    it('works for all locations and lengths with all risk profiles', () => {
      for (const location of locations) {
        for (const length of lengths) {
          for (const risk of risks) {
            const rec = getProvisionRecommendation(location, length, risk);
            expect(rec.lines.length).toBeGreaterThan(0);
            expect(rec.totalCost).toBeGreaterThan(0);
          }
        }
      }
    });
  });
});
