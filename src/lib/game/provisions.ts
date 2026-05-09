import { provisionOrder, provisions, getProvisionQuantities } from '$lib/data/provisions';
import type { LocationId, MissionLength, ProvisionRecommendation, ProvisionRiskProfile, ProvisionStack } from '$lib/data/types';

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

function getProvisionIcon(provision: typeof provisions[string], quantity: number): string {
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