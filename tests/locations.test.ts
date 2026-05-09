import { describe, expect, it } from 'vitest';
import { locations } from '../src/lib/data/locations';

describe('locations', () => {
  it('defines enemy types for every location', () => {
    for (const location of locations) {
      expect(location.enemyTypes.length).toBeGreaterThan(0);
    }
  });

  it('keeps expected base dungeon enemy types', () => {
    expect(locations.find((l) => l.id === 'ruins')?.enemyTypes).toEqual(['Unholy', 'Human']);
    expect(locations.find((l) => l.id === 'warrens')?.enemyTypes).toEqual(['Beast', 'Human']);
    expect(locations.find((l) => l.id === 'weald')?.enemyTypes).toEqual(['Beast', 'Human', 'Unholy']);
    expect(locations.find((l) => l.id === 'cove')?.enemyTypes).toEqual(['Eldritch', 'Unholy']);
  });

  it('has exactly four locations', () => {
    expect(locations.length).toBe(4);
  });
});