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
  },
  courtyard: {
    effective: [
      { label: 'bleed', details: 'Bloodsuckers are vulnerable' },
      { label: 'bandages', details: 'many bleed enemies + curios' },
      { label: 'the blood', details: 'for cursed heroes and shrew curios' },
      { label: 'shovels', details: 'Bloodflowers, Disturbing Diversion, Wine Crate' },
      { label: 'holy water', details: 'Damned Fountain stress relief' },
      { label: 'torches', details: 'Throbbing Cocoons, Thronging Hive' }
    ],
    ineffective: [
      { label: 'blight', details: 'Bloodsuckers are resistant' },
      { label: 'skeleton keys', details: 'replaces trinkets with random loot' }
    ],
    dangers: [
      { label: 'Crimson Curse', details: 'infected heroes need The Blood' },
      { label: 'Crocodilian', details: 'powerful mini-boss, high DMG and mobility' },
      { label: 'stress', details: 'Bloodlight causes constant stress gain' }
    ]
  },
  farmstead: {
    effective: [
      { label: 'bleed', details: 'Husks have low bleed resist' },
      { label: 'blight', details: 'Husks have moderate blight resist' },
      { label: 'stalling', details: 'not possible; waves have reinforcements' }
    ],
    ineffective: [
      { label: 'torches', details: 'Light Meter is replaced by Lighting Effects' },
      { label: 'firewood', details: 'no camping except at Miller\'s Hearth' }
    ],
    dangers: [
      { label: 'Crystalline Aberration', details: 'corpses explode for heavy DMG and stress' },
      { label: 'reinforcements', details: 'enemies respawn until 10 kills per wave' },
      { label: 'Sleeper\'s Dream', details: 'teleports party after wave ends' }
    ]
  },
  darkestDungeon: {
    effective: [
      { label: 'holy water', details: 'Eldritch enemies and altar curios' },
      { label: 'direct DMG', details: 'many high-PROT enemies' },
      { label: 'stress heal', details: 'constant stress from enemies and layout' }
    ],
    ineffective: [],
    dangers: [
      { label: 'retreat penalty', details: 'retreating kills a random hero' },
      { label: 'hero refusal', details: 'heroes refuse to return after completion' },
      { label: 'fixed layouts', details: 'rooms and paths are predetermined' }
    ]
  }
};

export function getTipsForLocation(location: LocationId) {
  return tips[location];
}