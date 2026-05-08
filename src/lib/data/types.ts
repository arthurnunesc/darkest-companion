export type ContentSet = 'base' | 'crimson-court' | 'color-of-madness';

export type LocationId =
  | 'ruins'
  | 'warrens'
  | 'weald'
  | 'cove'
  | 'courtyard'
  | 'farmstead';

export type MissionLength = 'short' | 'medium' | 'long' | 'endless';
export type Difficulty = 'apprentice' | 'veteran' | 'champion';
export type RiskProfile = 'lean' | 'balanced' | 'safe' | 'overprepared';
export type CurioView = 'by-curio' | 'by-item';

export type ProvisionId =
  | 'firewood'
  | 'food'
  | 'shovels'
  | 'antivenoms'
  | 'bandages'
  | 'herbs'
  | 'keys'
  | 'holyWaters'
  | 'torches'
  | 'laudanum'
  | 'blood';

export type OutcomeTone = 'positive' | 'neutral' | 'danger' | 'mixed';

export interface Location {
  id: LocationId;
  name: string;
  set: ContentSet;
  lengths: MissionLength[];
  enemyTypes: string[];
  note?: string;
}

export interface ProvisionDefinition {
  id: ProvisionId;
  label: string;
  icon: string;
  cost: number;
  stack: number;
}

export type ProvisionQuantities = Partial<Record<ProvisionId, number>>;

export interface ProvisionStack {
  provision: ProvisionDefinition;
  quantity: number;
}

export interface ProvisionLine extends ProvisionDefinition {
  quantity: number;
  subCost: number;
  stacks: ProvisionStack[];
}

export interface ProvisionRecommendation {
  totalCost: number;
  lines: ProvisionLine[];
}

export interface CurioOutcome {
  chance?: number;
  label: string;
  tone: OutcomeTone;
}

export interface CurioInteraction {
  item: ProvisionId | 'none' | 'dogTreats';
  label: string;
  icon: string;
  outcomes: CurioOutcome[];
  recommended?: boolean;
}

export interface Curio {
  id: string;
  name: string;
  location: LocationId;
  icon: string;
  description?: string;
  interactions: CurioInteraction[];
}

export interface Tip {
  label: string;
  details: string;
}

export interface LocationTips {
  effective: Tip[];
  ineffective: Tip[];
  dangers: Tip[];
}
