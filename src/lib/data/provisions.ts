import type { Difficulty, LocationId, MissionLength, ProvisionDefinition, ProvisionId, ProvisionQuantities } from './types';

const iconPath = '/icons/provisions/';

export const provisions: Record<ProvisionId, ProvisionDefinition> = {
  firewood: { id: 'firewood', label: 'Firewood', icon: `${iconPath}Firewood.png`, cost: 0, stack: 1 },
  food: { id: 'food', label: 'Food', icon: (quantity: number) => {
    if (quantity < 6) return `${iconPath}Food_1.png`;
    if (quantity < 12) return `${iconPath}Food_2.png`;
    return `${iconPath}Food_3.png`;
  }, cost: 75, stack: 12 },
  shovels: { id: 'shovels', label: 'Shovels', icon: `${iconPath}Shovel.png`, cost: 250, stack: 4 },
  antivenoms: { id: 'antivenoms', label: 'Antivenom', icon: `${iconPath}Antivenom.png`, cost: 150, stack: 6 },
  bandages: { id: 'bandages', label: 'Bandages', icon: `${iconPath}Bandage.png`, cost: 150, stack: 6 },
  herbs: { id: 'herbs', label: 'Medicinal Herbs', icon: `${iconPath}Medicinal_Herbs.png`, cost: 200, stack: 6 },
  keys: { id: 'keys', label: 'Skeleton Keys', icon: `${iconPath}Skeleton_Key.png`, cost: 200, stack: 6 },
  holyWaters: { id: 'holyWaters', label: 'Holy Water', icon: `${iconPath}Holy_Water.png`, cost: 150, stack: 6 },
  torches: { id: 'torches', label: 'Torches', icon: `${iconPath}Torch.png`, cost: 75, stack: 8 }
};

const baseByLength: Record<MissionLength, ProvisionQuantities> = {
  short: { food: 12, torches: 8, shovels: 2 },
  medium: { firewood: 1, food: 18, torches: 13, shovels: 3 },
  long: { firewood: 2, food: 20, torches: 16, shovels: 4 }
};

const locationAdditions: Record<LocationId, Partial<Record<MissionLength, ProvisionQuantities>>> = {
  ruins: {
    short: { herbs: 1, holyWaters: 2, bandages: 1, antivenoms: 0, keys: 1 },
    medium: { herbs: 2, holyWaters: 3, bandages: 2, antivenoms: 0, keys: 2 },
    long: { herbs: 3, holyWaters: 4, bandages: 3, antivenoms: 0, keys: 3 }
  },
  warrens: {
    short: { torches: 10, herbs: 3, holyWaters: 2, bandages: 1, antivenoms: 0, keys: 2 },
    medium: { torches: 16, herbs: 4, holyWaters: 3, bandages: 2, antivenoms: 1, keys: 3 },
    long: { torches: 20, herbs: 5, holyWaters: 4, bandages: 3, antivenoms: 1, keys: 3 }
  },
  weald: {
    short: { shovels: 3, herbs: 1, holyWaters: 1, bandages: 2, antivenoms: 2, keys: 1 },
    medium: { shovels: 5, herbs: 2, holyWaters: 2, bandages: 3, antivenoms: 3, keys: 2 },
    long: { shovels: 6, herbs: 2, holyWaters: 3, bandages: 4, antivenoms: 4, keys: 2 }
  },
  cove: {
    short: { shovels: 3, herbs: 2, holyWaters: 0, bandages: 2, antivenoms: 0, keys: 1 },
    medium: { shovels: 5, herbs: 3, holyWaters: 1, bandages: 4, antivenoms: 0, keys: 2 },
    long: { shovels: 6, herbs: 4, holyWaters: 1, bandages: 6, antivenoms: 0, keys: 3 }
  }
};

export const provisionOrder: ProvisionId[] = [
  'firewood',
  'food',
  'shovels',
  'antivenoms',
  'bandages',
  'herbs',
  'keys',
  'holyWaters',
  'torches'
];

function combineQuantities(...sets: ProvisionQuantities[]): ProvisionQuantities {
  return sets.reduce<ProvisionQuantities>((combined, set) => {
    for (const [id, quantity] of Object.entries(set) as [ProvisionId, number][]) {
      combined[id] = Math.max(0, (combined[id] ?? 0) + quantity);
    }
    return combined;
  }, {});
}

export function getProvisionQuantities(location: LocationId, length: MissionLength) {
  return combineQuantities(
    baseByLength[length],
    locationAdditions[location][length] ?? {}
  );
}