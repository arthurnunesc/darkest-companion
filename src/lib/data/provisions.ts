import type { LocationId, MissionLength, ProvisionDefinition, ProvisionId, ProvisionQuantities, ProvisionRiskProfile } from './types';

export interface ProvisionStack {
  provision: ProvisionDefinition;
  quantity: number;
}

export interface ProvisionLine extends ProvisionDefinition {
  icon: string;
  quantity: number;
  subCost: number;
  stacks: ProvisionStack[];
}

export interface ProvisionRecommendation {
  totalCost: number;
  lines: ProvisionLine[];
}

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
  torches: { id: 'torches', label: 'Torches', icon: `${iconPath}Torch.png`, cost: 75, stack: 8 },
  theBlood: { id: 'theBlood', label: 'The Blood', icon: `${iconPath}The_Blood.png`, cost: 0, stack: 6 }
};

const baseByLength: Record<MissionLength, ProvisionQuantities> = {
  short: { food: 12, torches: 8, shovels: 2 },
  medium: { firewood: 1, food: 18, torches: 13, shovels: 3 },
  long: { firewood: 2, food: 20, torches: 16, shovels: 4 },
  epic: { food: 24, torches: 8, shovels: 4 },
  endless: { food: 12 },
  exhausting: { firewood: 4, food: 24, torches: 16 }
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
  },
  courtyard: {
    short: { shovels: 1, herbs: 1, holyWaters: 2, bandages: 2, antivenoms: 0, keys: 0, theBlood: 2, torches: 0 },
    epic: { shovels: 2, herbs: 3, holyWaters: 4, bandages: 4, antivenoms: 1, keys: 0, theBlood: 4, torches: 0 }
  },
  farmstead: {
    medium: { firewood: -1, torches: -13, shovels: -3, food: 0, herbs: 1, bandages: 2, holyWaters: 0, antivenoms: 0, keys: 1 },
    long: { firewood: -2, torches: -16, shovels: -4, food: 4, herbs: 2, bandages: 4, holyWaters: 0, antivenoms: 0, keys: 2 },
    endless: { food: 12, herbs: 2, bandages: 4, holyWaters: 1, antivenoms: 1, keys: 3 }
  },
  darkestDungeon: {
    short: { food: -12, torches: -8, shovels: -2, bandages: 2, antivenoms: 1, holyWaters: 1, herbs: 0, keys: 0 },
    medium: { shovels: -3, keys: 0, antivenoms: 2, bandages: 4, holyWaters: 3, herbs: 0 },
    long: { shovels: -4, keys: 0, antivenoms: 4, bandages: 4, holyWaters: 4, herbs: 0 },
    exhausting: { antivenoms: 4, bandages: 4, holyWaters: 4, herbs: 0, keys: 0, shovels: 0 }
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
  'torches',
  'theBlood'
];

export const provisionRiskProfiles = [
  { id: 'destitute' as const, label: 'Destitute', description: 'Spend 20% less, accept more risk.' },
  { id: 'prepared' as const, label: 'Prepared', description: 'Original recommended provisions.' },
  { id: 'paranoid' as const, label: 'Paranoid', description: 'Carry 20% extra supplies for bad luck.' }
];

const fixedRiskProvisionIds = new Set<ProvisionId>(['firewood', 'torches']);

function combineQuantities(...sets: ProvisionQuantities[]): ProvisionQuantities {
  return sets.reduce<ProvisionQuantities>((combined, set) => {
    for (const [id, quantity] of Object.entries(set) as [ProvisionId, number][]) {
      combined[id] = Math.max(0, (combined[id] ?? 0) + quantity);
    }
    return combined;
  }, {});
}

function getPreparedProvisionQuantities(location: LocationId, length: MissionLength) {
  return combineQuantities(
    baseByLength[length],
    locationAdditions[location][length] ?? {}
  );
}

function applyRiskProfile(
  quantities: ProvisionQuantities,
  risk: ProvisionRiskProfile
): ProvisionQuantities {
  if (risk === 'prepared') return quantities;

  const factor = risk === 'destitute' ? 0.8 : 1.2;
  const round = risk === 'destitute' ? Math.floor : Math.ceil;

  return Object.fromEntries(
    Object.entries(quantities).map(([id, quantity]) => {
      if (fixedRiskProvisionIds.has(id as ProvisionId)) {
        return [id, quantity];
      }
      const adjusted = round(quantity * factor);
      return [
        id,
        risk === 'destitute' && quantity > 0
          ? Math.max(1, adjusted)
          : adjusted
      ];
    })
  ) as ProvisionQuantities;
}

export function getProvisionQuantities(location: LocationId, length: MissionLength, risk: ProvisionRiskProfile = 'prepared') {
  return applyRiskProfile(getPreparedProvisionQuantities(location, length), risk);
}

export function splitIntoStacks(quantity: number, stackSize: number): number[] {
  if (quantity <= 0) return [];

  const stacks: number[] = [];
  let remaining = quantity;

  while (remaining > 0) {
    stacks.push(Math.min(stackSize, remaining));
    remaining -= stackSize;
  }

  return stacks;
}

function getProvisionIcon(provision: ProvisionDefinition, quantity: number): string {
  if (typeof provision.icon === 'function') {
    return provision.icon(quantity);
  }
  return provision.icon;
}

export function getProvisionRecommendation(
  location: LocationId,
  length: MissionLength,
  risk: ProvisionRiskProfile = 'prepared'
): ProvisionRecommendation {
  const quantities = getProvisionQuantities(location, length, risk);
  const lines = provisionOrder.flatMap((id) => {
    const quantity = quantities[id] ?? 0;
    if (!quantity) return [];

    const provision = provisions[id];
    const icon = getProvisionIcon(provision, quantity);
    const stacks: ProvisionStack[] = splitIntoStacks(quantity, provision.stack).map((stackQuantity) => ({
      provision: { ...provision, icon: getProvisionIcon(provision, stackQuantity) },
      quantity: stackQuantity
    }));

    return [
      {
        ...provision,
        icon,
        quantity,
        subCost: provision.cost * quantity,
        stacks
      }
    ];
  });

  return {
    totalCost: lines.reduce((total, line) => total + line.subCost, 0),
    lines
  };
}
