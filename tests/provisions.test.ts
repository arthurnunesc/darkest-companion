import { describe, expect, it } from 'vitest';
import { getProvisionQuantities, getProvisionRecommendation, splitIntoStacks } from '../src/lib/data/provisions';
import type { LocationId, MissionLength, ProvisionId, ProvisionRiskProfile } from '../src/lib/data/types';

const locations: LocationId[] = ['ruins', 'warrens', 'weald', 'cove'];
const lengths: MissionLength[] = ['short', 'medium', 'long'];
const risks: ProvisionRiskProfile[] = ['destitute', 'prepared', 'paranoid'];

describe('provision recommendations', () => {
  it('splits quantities into actual stacks', () => {
    expect(splitIntoStacks(18, 12)).toEqual([12, 6]);
    expect(splitIntoStacks(8, 8)).toEqual([8]);
  });

  describe('parity with original site (prepared)', () => {
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
        for (const length of ['medium', 'long'] as MissionLength[]) {
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

  describe('DLC provisions', () => {
    it('courtyard recommends The Blood', () => {
      const q = getProvisionQuantities('courtyard', 'short');
      expect(q.theBlood).toBeGreaterThan(0);
    });

    it('courtyard has no skeleton keys', () => {
      const q = getProvisionQuantities('courtyard', 'epic');
      expect(q.keys ?? 0).toBe(0);
    });

    it('farmstead has no torches or shovels', () => {
      for (const length of ['medium', 'long', 'endless'] as MissionLength[]) {
        const q = getProvisionQuantities('farmstead', length);
        expect(q.torches ?? 0).toBe(0);
        expect(q.shovels ?? 0).toBe(0);
      }
    });

    it('farmstead recommends skeleton keys for Stockpile', () => {
      for (const length of ['medium', 'long', 'endless'] as MissionLength[]) {
        const q = getProvisionQuantities('farmstead', length);
        expect(q.keys ?? 0).toBeGreaterThan(0);
      }
    });

    it('darkest dungeon has no shovels or skeleton keys', () => {
      for (const length of ['short', 'medium', 'long', 'exhausting'] as MissionLength[]) {
        const q = getProvisionQuantities('darkestDungeon', length);
        expect(q.shovels ?? 0).toBe(0);
        expect(q.keys ?? 0).toBe(0);
      }
    });

    it('darkest dungeon recommends antivenom and bandages', () => {
      for (const length of ['medium', 'long', 'exhausting'] as MissionLength[]) {
        const q = getProvisionQuantities('darkestDungeon', length);
        expect(q.antivenoms ?? 0).toBeGreaterThan(0);
        expect(q.bandages ?? 0).toBeGreaterThan(0);
      }
    });

    it('all DLC provision quantities are non-negative', () => {
      const dlcLocations: LocationId[] = ['courtyard', 'farmstead', 'darkestDungeon'];
      const allLengths: MissionLength[] = ['short', 'medium', 'long', 'epic', 'endless', 'exhausting'];

      for (const location of dlcLocations) {
        for (const length of allLengths) {
          const q = getProvisionQuantities(location, length);
          for (const key of Object.keys(q)) {
            expect(q[key as ProvisionId] ?? 0).toBeGreaterThanOrEqual(0);
          }
        }
      }
    });

    it('DLC provisions produce valid recommendations', () => {
      const entries: [LocationId, MissionLength][] = [
        ['courtyard', 'short'],
        ['courtyard', 'epic'],
        ['farmstead', 'medium'],
        ['farmstead', 'long'],
        ['farmstead', 'endless'],
        ['darkestDungeon', 'short'],
        ['darkestDungeon', 'medium'],
        ['darkestDungeon', 'long'],
        ['darkestDungeon', 'exhausting'],
      ];

      for (const [location, length] of entries) {
        for (const risk of risks) {
          const rec = getProvisionRecommendation(location, length, risk);
          expect(rec.totalCost).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });
});