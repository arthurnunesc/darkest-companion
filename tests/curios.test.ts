import { describe, expect, it } from 'vitest';
import { curios, getCuriosByItem, getCuriosForLocation } from '../src/lib/data/curios';

describe('curio regressions', () => {
  it('has 49 total curio entries (9 universal x 4 locations + 40 location-specific)', () => {
    expect(curios.length).toBe(76);
  });

  it('keeps Moonshine Barrel in Warrens', () => {
    expect(getCuriosForLocation('warrens').some((curio) => curio.id === 'moonshine-barrel')).toBe(true);
  });

  it('keeps Fish Idol activated by Holy Water', () => {
    const fishIdol = getCuriosForLocation('cove').find((curio) => curio.id === 'fish-idol');

    expect(fishIdol?.interactions.some((interaction) => interaction.item === 'holyWaters')).toBe(true);
  });

  it('supports per-item curio lookup', () => {
    const holyWaterGroup = getCuriosByItem('cove').find((group) => group.item === 'holyWaters');

    expect(holyWaterGroup?.curios.some((curio) => curio.id === 'fish-idol')).toBe(true);
  });

  it('includes amounts in curio outcomes', () => {
    const artifact = curios.find((curio) => curio.id === 'ancient-artifact');
    const noneOutcome = artifact?.interactions[0]?.outcomes[0];

    expect(noneOutcome?.amount).toBe(2.5);
  });

  it('has curios in all four locations', () => {
    const locationIds = new Set(curios.map((curio) => curio.location));

    expect(locationIds.has('ruins')).toBe(true);
    expect(locationIds.has('warrens')).toBe(true);
    expect(locationIds.has('weald')).toBe(true);
    expect(locationIds.has('cove')).toBe(true);
    expect(locationIds.size).toBe(4);
  });
});