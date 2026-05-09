import type { Location } from './types';

export const locations: Location[] = [
  { id: 'ruins', name: 'Ruins', lengths: ['short', 'medium', 'long'] },
  { id: 'warrens', name: 'Warrens', lengths: ['short', 'medium', 'long'] },
  { id: 'weald', name: 'Weald', lengths: ['short', 'medium', 'long'] },
  { id: 'cove', name: 'Cove', lengths: ['short', 'medium', 'long'] }
];

export const defaultLocation = locations[0];

export function getLocation(id: string | null | undefined) {
  return locations.find((location) => location.id === id) ?? defaultLocation;
}