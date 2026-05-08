import type { Difficulty, LocationId, MissionLength, ProvisionDefinition, ProvisionId, ProvisionQuantities, RiskProfile } from './types';

const iconPath = '/icons/provisions/';

export const provisions: Record<ProvisionId, ProvisionDefinition> = {
  firewood: { id: 'firewood', label: 'Firewood', icon: `${iconPath}Firewood.png`, cost: 0, stack: 1 },
  food: { id: 'food', label: 'Food', icon: `${iconPath}Food_3.png`, cost: 75, stack: 12 },
  shovels: { id: 'shovels', label: 'Shovels', icon: `${iconPath}Shovel.png`, cost: 250, stack: 4 },
  antivenoms: { id: 'antivenoms', label: 'Antivenom', icon: `${iconPath}Antivenom.png`, cost: 150, stack: 6 },
  bandages: { id: 'bandages', label: 'Bandages', icon: `${iconPath}Bandage.png`, cost: 150, stack: 6 },
  herbs: { id: 'herbs', label: 'Medicinal Herbs', icon: `${iconPath}Medicinal_Herbs.png`, cost: 200, stack: 6 },
  keys: { id: 'keys', label: 'Skeleton Keys', icon: `${iconPath}Skeleton_Key.png`, cost: 200, stack: 6 },
  holyWaters: { id: 'holyWaters', label: 'Holy Water', icon: `${iconPath}Holy_Water.png`, cost: 150, stack: 6 },
  torches: { id: 'torches', label: 'Torches', icon: `${iconPath}Torch.png`, cost: 75, stack: 8 },
  laudanum: { id: 'laudanum', label: 'Laudanum', icon: `${iconPath}Laudanum.svg`, cost: 100, stack: 6 },
  blood: { id: 'blood', label: 'The Blood', icon: `${iconPath}The_Blood.svg`, cost: 0, stack: 6 }
};

const baseByLength: Record<MissionLength, ProvisionQuantities> = {
  short: { food: 12, torches: 8, shovels: 2 },
  medium: { firewood: 1, food: 18, torches: 13, shovels: 3 },
  long: { firewood: 2, food: 24, torches: 16, shovels: 4 },
  endless: { food: 24, torches: 12, shovels: 1, bandages: 2, holyWaters: 2 }
};

const locationAdditions: Record<LocationId, Partial<Record<MissionLength, ProvisionQuantities>>> = {
  ruins: {
    short: { herbs: 1, holyWaters: 2, bandages: 1, keys: 1 },
    medium: { herbs: 2, holyWaters: 3, bandages: 2, keys: 2 },
    long: { herbs: 3, holyWaters: 4, bandages: 3, keys: 3 }
  },
  warrens: {
    short: { torches: 2, herbs: 3, holyWaters: 2, bandages: 1, keys: 2 },
    medium: { torches: 3, herbs: 4, holyWaters: 3, bandages: 2, antivenoms: 1, keys: 3 },
    long: { torches: 4, herbs: 5, holyWaters: 4, bandages: 3, antivenoms: 1, keys: 3 }
  },
  weald: {
    short: { shovels: 1, herbs: 1, holyWaters: 1, bandages: 2, antivenoms: 2, keys: 1 },
    medium: { shovels: 2, herbs: 2, holyWaters: 2, bandages: 3, antivenoms: 3, keys: 2 },
    long: { shovels: 2, herbs: 2, holyWaters: 3, bandages: 4, antivenoms: 4, keys: 2 }
  },
  cove: {
    short: { shovels: 1, herbs: 2, bandages: 2, keys: 1 },
    medium: { shovels: 2, herbs: 3, holyWaters: 1, bandages: 4, keys: 2 },
    long: { shovels: 2, herbs: 4, holyWaters: 1, bandages: 6, keys: 3 }
  },
  courtyard: {
    short: { food: 4, torches: -4, shovels: 1, bandages: 2, herbs: 2, blood: 2 },
    medium: { food: 6, torches: -6, shovels: 2, bandages: 3, herbs: 3, blood: 4 },
    long: { food: 8, torches: -8, shovels: 3, bandages: 4, herbs: 4, blood: 6 }
  },
  farmstead: {
    endless: { torches: -8, shovels: -1, food: 12, bandages: 4, holyWaters: 3, laudanum: 3 }
  }
};

const difficultyAdditions: Record<Difficulty, ProvisionQuantities> = {
  apprentice: {},
  veteran: { food: 4, torches: 2, bandages: 1 },
  champion: { food: 8, torches: 4, bandages: 2, antivenoms: 1, herbs: 1 }
};

const riskAdditions: Record<RiskProfile, ProvisionQuantities> = {
  lean: { food: -6, torches: -4, shovels: -1, keys: -1, holyWaters: -1, herbs: -1, bandages: -1, antivenoms: -1 },
  balanced: { food: -2, torches: -1 },
  safe: {},
  overprepared: { food: 6, torches: 4, shovels: 1, keys: 1, holyWaters: 1, herbs: 1, bandages: 1, antivenoms: 1 }
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
  'torches',
  'laudanum',
  'blood'
];

export function combineQuantities(...sets: ProvisionQuantities[]) {
  return sets.reduce<ProvisionQuantities>((combined, set) => {
    for (const [id, quantity] of Object.entries(set) as [ProvisionId, number][]) {
      combined[id] = Math.max(0, (combined[id] ?? 0) + quantity);
    }
    return combined;
  }, {});
}

export function getProvisionQuantities(location: LocationId, length: MissionLength, difficulty: Difficulty, risk: RiskProfile) {
  return combineQuantities(
    baseByLength[length],
    locationAdditions[location][length] ?? {},
    difficultyAdditions[difficulty],
    riskAdditions[risk]
  );
}
