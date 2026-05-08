import type { Location } from './types';

export const locations: Location[] = [
  {
    id: 'ruins',
    name: 'Ruins',
    set: 'base',
    lengths: ['short', 'medium', 'long'],
    enemyTypes: ['Unholy', 'Human']
  },
  {
    id: 'warrens',
    name: 'Warrens',
    set: 'base',
    lengths: ['short', 'medium', 'long'],
    enemyTypes: ['Beast', 'Human']
  },
  {
    id: 'weald',
    name: 'Weald',
    set: 'base',
    lengths: ['short', 'medium', 'long'],
    enemyTypes: ['Beast', 'Human', 'Unholy']
  },
  {
    id: 'cove',
    name: 'Cove',
    set: 'base',
    lengths: ['short', 'medium', 'long'],
    enemyTypes: ['Eldritch', 'Unholy']
  },
  {
    id: 'courtyard',
    name: 'Courtyard',
    set: 'crimson-court',
    lengths: ['short', 'medium', 'long'],
    enemyTypes: ['Bloodsucker', 'Human'],
    note: 'Crimson Court provisions assume Blood management matters more than low-cost runs.'
  },
  {
    id: 'farmstead',
    name: 'Farmstead',
    set: 'color-of-madness',
    lengths: ['endless'],
    enemyTypes: ['Husk', 'Eldritch'],
    note: 'Farmstead is modeled as an Endless expedition profile.'
  }
];

export const defaultLocation = locations[0];

export function getLocation(id: string | null | undefined) {
  return locations.find((location) => location.id === id) ?? defaultLocation;
}
