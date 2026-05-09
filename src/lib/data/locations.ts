import type { Location } from './types';

export const locations: Location[] = [
  { id: 'ruins', name: 'Ruins', lengths: ['short', 'medium', 'long'], enemyTypes: ['Unholy', 'Human'] },
  { id: 'warrens', name: 'Warrens', lengths: ['short', 'medium', 'long'], enemyTypes: ['Beast', 'Human'] },
  { id: 'weald', name: 'Weald', lengths: ['short', 'medium', 'long'], enemyTypes: ['Beast', 'Eldritch', 'Human', 'Unholy'] },
  { id: 'cove', name: 'Cove', lengths: ['short', 'medium', 'long'], enemyTypes: ['Eldritch', 'Unholy'] }
];

export const defaultLocation = locations[0];

export function getLocation(id: string | null | undefined) {
  return locations.find((location) => location.id === id) ?? defaultLocation;
}