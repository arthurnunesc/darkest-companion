export type LocationId = 'ruins' | 'warrens' | 'weald' | 'cove' | 'courtyard' | 'farmstead' | 'darkestDungeon';

export type MissionLength = 'short' | 'medium' | 'long';

export type ProvisionRiskProfile = 'destitute' | 'prepared' | 'paranoid';

export type EnemyType = 'Beast' | 'Bloodsucker' | 'Eldritch' | 'Human' | 'Husk' | 'Unholy';

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
  | 'theBlood';

export type OutcomeTone = 'positive' | 'neutral' | 'danger' | 'mixed';

export interface Location {
  id: LocationId;
  name: string;
  lengths: MissionLength[];
  enemyTypes: EnemyType[];
}

export interface ProvisionDefinition {
  id: ProvisionId;
  label: string;
  icon: string | ((quantity: number) => string);
  cost: number;
  stack: number;
}

export type ProvisionQuantities = Partial<Record<ProvisionId, number>>;

export interface CurioOutcome {
  chance?: number;
  label: string;
  amount?: number;
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