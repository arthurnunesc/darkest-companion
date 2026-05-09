import type { LocationId, LocationTips } from './types';

export const tips: Record<LocationId, LocationTips> = {
  ruins: {
    effective: [
      { label: 'blight', details: 'low resist' },
      { label: 'crusader', details: 'bonus vs unholy' },
      { label: 'direct DMG', details: 'few high PROT enemies' }
    ],
    ineffective: [
      { label: 'bleed', details: 'high resist' }
    ],
    dangers: [
      { label: 'bone spearman', details: 'at low ranks' },
      { label: 'stress dealers', details: 'courtier, acolyte, madman' },
      { label: 'books and bookshelves', details: 'high risk of bad outcome' }
    ]
  },
  warrens: {
    effective: [
      { label: 'bleed', details: 'low resist' },
      { label: 'houndmaster', details: 'bonus vs beast' },
      { label: 'scouting', details: 'specific map layouts' }
    ],
    ineffective: [
      { label: 'blight', details: 'high resist' }
    ],
    dangers: [
      { label: 'swinetaur', details: 'especially in back rows' },
      { label: 'swine chopper', details: 'high bleed, hard to kill' }
    ]
  },
  weald: {
    effective: [
      { label: 'bandages', details: 'many curios + bleed enemies' },
      { label: 'antivenom', details: 'many curios + blight enemies' },
      { label: 'shovels', details: 'more obstruction walls' },
      { label: 'holy water', details: 'curios affecting quirks and stress' }
    ],
    ineffective: [],
    dangers: [
      { label: 'crone', details: 'in front rows' },
      { label: 'ectoplasm', details: 'can summon others' },
      { label: 'rabid gnasher', details: 'fast + deals bleed and disease' }
    ]
  },
  cove: {
    effective: [
      { label: 'medicinal herbs', details: 'curios, traps, and debuff curio interactions' },
      { label: 'shovels', details: 'curio interactions' },
      { label: 'bandages', details: 'many bleed-inflicting enemies' },
      { label: 'blight', details: 'enemies have low resist + high PROT' },
      { label: 'PROT debuff', details: 'enemies often have high PROT' },
      { label: 'occultist', details: 'bonus vs eldritch' }
    ],
    ineffective: [
      { label: 'bleed', details: 'high resist' }
    ],
    dangers: [
      { label: 'pelagic groupers', details: 'high DMG output' },
      { label: 'thrall', details: 'explodes for massive DMG if alive' }
    ]
  }
};

export function getTipsForLocation(location: LocationId) {
  return tips[location];
}