export type LocationId = 'ruins' | 'warrens' | 'weald' | 'cove';

export type MissionLength = 'short' | 'medium' | 'long';

export type ProvisionRiskProfile = 'destitute' | 'prepared' | 'paranoid';

export type EnemyType = 'Beast' | 'Eldritch' | 'Human' | 'Ironwork' | 'Unholy';

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
  | 'torches';

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

export interface BossTactic {
  title: string;
  details: string;
}

export interface Boss {
  id: string;
  location: LocationId;
  name: string;
  image: string;
  imageAlt: string;
  enemyTypes: EnemyType[];
  classification?: string;
  size?: string;
  turns?: string;
  variants?: string[];
  winCondition: string;
  mechanics: BossTactic[];
  do: BossTactic[];
  avoid: BossTactic[];
  recommendedHeroes: string[];
  notes?: string[];
}

export type HeroId =
  | 'arbalest'
  | 'musketeer'
  | 'crusader'
  | 'grave-robber'
  | 'hellion'
  | 'highwayman'
  | 'houndmaster'
  | 'occultist'
  | 'plague-doctor'
  | 'shieldbreaker'
  | 'abomination'
  | 'leper'
  | 'man-at-arms'
  | 'bounty-hunter'
  | 'vestal'
  | 'flagellant'
  | 'jester'
  | 'antiquarian';

export interface Hero {
  id: HeroId;
  name: string;
  image: string;
}

export interface TeamSkill {
  name: string;
  alternatives?: string[];
}

export interface TeamHeroSlot {
  rank: number;
  type: 'fixed' | 'choice' | 'flexible';
  hero: string;
  options: string[];
  skills: TeamSkill[];
}

export interface TeamComposition {
  id: string;
  name: string;
  source: string;
  ranks: TeamHeroSlot[];
  strategy: string[];
}
