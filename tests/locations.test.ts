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
    expect(locations.find((l) => l.id === 'weald')?.enemyTypes).toEqual(['Beast', 'Eldritch', 'Human', 'Unholy']);
    expect(locations.find((l) => l.id === 'cove')?.enemyTypes).toEqual(['Eldritch', 'Unholy']);
  });

  it('has DLC locations with expected enemy types', () => {
    expect(locations.find((l) => l.id === 'courtyard')?.enemyTypes).toEqual(['Bloodsucker', 'Eldritch', 'Beast']);
    expect(locations.find((l) => l.id === 'farmstead')?.enemyTypes).toEqual(['Husk', 'Human', 'Beast']);
    expect(locations.find((l) => l.id === 'darkestDungeon')?.enemyTypes).toEqual(['Eldritch', 'Human', 'Unholy', 'Beast']);
  });

  it('has DLC locations with correct length options', () => {
    expect(locations.find((l) => l.id === 'courtyard')?.lengths).toEqual(['short', 'epic']);
    expect(locations.find((l) => l.id === 'farmstead')?.lengths).toEqual(['medium', 'long', 'endless']);
    expect(locations.find((l) => l.id === 'darkestDungeon')?.lengths).toEqual(['medium', 'long', 'exhausting', 'short']);
  });

  it('has seven locations total', () => {
    expect(locations.length).toBe(7);
  });
});