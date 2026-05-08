import { describe, expect, it } from 'vitest';
import { getCuriosByItem, getCuriosForLocation } from '../src/lib/data/curios';

describe('curio regressions', () => {
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
});
