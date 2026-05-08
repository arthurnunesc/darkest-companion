import { provisionOrder, provisions, getProvisionQuantities } from '$lib/data/provisions';
import type { Difficulty, LocationId, MissionLength, ProvisionRecommendation, ProvisionStack, RiskProfile } from '$lib/data/types';

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

export function getProvisionRecommendation(
  location: LocationId,
  length: MissionLength,
  difficulty: Difficulty,
  risk: RiskProfile
): ProvisionRecommendation {
  const quantities = getProvisionQuantities(location, length, difficulty, risk);
  const lines = provisionOrder.flatMap((id) => {
    const quantity = quantities[id] ?? 0;
    if (!quantity) return [];

    const provision = provisions[id];
    const stacks: ProvisionStack[] = splitIntoStacks(quantity, provision.stack).map((stackQuantity) => ({
      provision,
      quantity: stackQuantity
    }));

    return [
      {
        ...provision,
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
