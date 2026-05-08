import { getLocation, locations } from '$lib/data/locations';
import type { CurioView, Difficulty, MissionLength, RiskProfile } from '$lib/data/types';

export const difficulties: { id: Difficulty; label: string }[] = [
  { id: 'apprentice', label: 'Apprentice' },
  { id: 'veteran', label: 'Veteran' },
  { id: 'champion', label: 'Champion' }
];

export const riskProfiles: { id: RiskProfile; label: string; description: string }[] = [
  { id: 'lean', label: 'Lean', description: 'Cheaper, fewer backups.' },
  { id: 'balanced', label: 'Balanced', description: 'Moderate supplies.' },
  { id: 'safe', label: 'Safe', description: 'Default safety-first recommendation.' },
  { id: 'overprepared', label: 'Overprepared', description: 'Expensive buffer for bad RNG.' }
];

export const curioViews: { id: CurioView; label: string }[] = [
  { id: 'by-curio', label: 'By Curio' },
  { id: 'by-item', label: 'By Item' }
];

export interface ExpeditionState {
  location: ReturnType<typeof getLocation>;
  length: MissionLength;
  difficulty: Difficulty;
  risk: RiskProfile;
  view: CurioView;
  query: string;
}

function isDifficulty(value: string | null): value is Difficulty {
  return difficulties.some((difficulty) => difficulty.id === value);
}

function isRiskProfile(value: string | null): value is RiskProfile {
  return riskProfiles.some((risk) => risk.id === value);
}

function isCurioView(value: string | null): value is CurioView {
  return curioViews.some((view) => view.id === value);
}

export function parseExpeditionParams(params: URLSearchParams): ExpeditionState {
  const location = getLocation(params.get('location'));
  const requestedLength = params.get('length') as MissionLength | null;
  const requestedDifficulty = params.get('difficulty');
  const requestedRisk = params.get('risk');
  const requestedView = params.get('view');
  const length = requestedLength && location.lengths.includes(requestedLength) ? requestedLength : location.lengths[0];

  return {
    location,
    length,
    difficulty: isDifficulty(requestedDifficulty) ? requestedDifficulty : 'apprentice',
    risk: isRiskProfile(requestedRisk) ? requestedRisk : 'safe',
    view: isCurioView(requestedView) ? requestedView : 'by-curio',
    query: params.get('q') ?? ''
  };
}

export function buildExpeditionParams(state: ExpeditionState) {
  const params = new URLSearchParams();
  params.set('location', state.location.id);
  params.set('length', state.length);
  params.set('difficulty', state.difficulty);
  params.set('risk', state.risk);
  params.set('view', state.view);
  if (state.query.trim()) params.set('q', state.query.trim());
  return params;
}

export function updateParam(params: URLSearchParams, key: string, value: string) {
  const next = new URLSearchParams(params);
  next.set(key, value);

  if (key === 'location') {
    const nextLocation = locations.find((location) => location.id === value);
    if (nextLocation && !nextLocation.lengths.includes(next.get('length') as MissionLength)) {
      next.set('length', nextLocation.lengths[0]);
    }
  }

  if (key === 'q' && !value.trim()) next.delete('q');
  return next;
}
