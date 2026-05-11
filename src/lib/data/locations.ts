import type { Location } from './types';

export const locations: Location[] = [
  { id: 'ruins', name: 'Ruins', lengths: ['short', 'medium', 'long'], enemyTypes: ['Unholy', 'Human'] },
  { id: 'warrens', name: 'Warrens', lengths: ['short', 'medium', 'long'], enemyTypes: ['Beast', 'Human'] },
  { id: 'weald', name: 'Weald', lengths: ['short', 'medium', 'long'], enemyTypes: ['Beast', 'Eldritch', 'Human', 'Unholy'] },
  { id: 'cove', name: 'Cove', lengths: ['short', 'medium', 'long'], enemyTypes: ['Eldritch', 'Unholy'] },
  { id: 'courtyard', name: 'Courtyard', lengths: ['short', 'epic'], enemyTypes: ['Bloodsucker', 'Eldritch', 'Beast'] },
  { id: 'farmstead', name: 'Farmstead', lengths: ['medium', 'long', 'endless'], enemyTypes: ['Husk', 'Human', 'Beast'] },
  { id: 'darkestDungeon', name: 'Darkest Dungeon', lengths: ['medium', 'long', 'exhausting', 'short'], enemyTypes: ['Eldritch', 'Human', 'Unholy', 'Beast'] }
];

export const defaultLocation = locations[0];

export function getLocation(id: string | null | undefined) {
  return locations.find((location) => location.id === id) ?? defaultLocation;
}