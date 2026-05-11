import type { Curio, CurioInteraction, LocationId } from './types';

const curioPath = '/icons/curios/';
const provisionPath = '/icons/provisions/';

const items = {
  none: { label: 'Nothing', icon: '/icons/redCross.png' },
  antivenom: { label: 'Antivenom', icon: `${provisionPath}Antivenom.png` },
  bandage: { label: 'Bandage', icon: `${provisionPath}Bandage.png` },
  dogTreats: { label: 'Dog Treats', icon: `${provisionPath}Dog_Treats.png` },
  holyWater: { label: 'Holy Water', icon: `${provisionPath}Holy_Water.png` },
  medicinalHerb: { label: 'Medicinal Herbs', icon: `${provisionPath}Medicinal_Herbs.png` },
  shovel: { label: 'Shovel', icon: `${provisionPath}Shovel.png` },
  skeletonKey: { label: 'Skeleton Key', icon: `${provisionPath}Skeleton_Key.png` },
  torch: { label: 'Torch', icon: `${provisionPath}Torch.png` },
  theBlood: { label: 'The Blood', icon: `${provisionPath}The_Blood.png` }
} as const;

// Courtyard curios data
const courtyardCurios: Omit<Curio, 'location'>[] = [
  {
    id: 'pile-of-strange-bones',
    name: 'Pile of Strange Bones',
    icon: `${curioPath}pile_of_strange_bones.png`,
    description: 'A heap of peculiar bones and dusty sinew litters the floor.',
    interactions: [
      { item: 'bandages', ...items.bandage, recommended: true, outcomes: [
        { chance: 50, label: 'Any Loot', amount: 1, tone: 'positive' },
        { chance: 50, label: 'The Blood', tone: 'positive' }
      ]},
      { item: 'theBlood', ...items.theBlood, outcomes: [
        { label: 'Summon Supplicant, Sycophant, and Esquire', tone: 'danger' }
      ]},
      { item: 'none', ...items.none, outcomes: [
        { chance: 50, label: 'Bleed', tone: 'danger' },
        { chance: 20, label: 'Any Loot x2 + 16.7% The Blood', tone: 'positive' },
        { chance: 10, label: 'Crimson Curse', tone: 'danger' },
        { chance: 20, label: 'Nothing', tone: 'neutral' }
      ]}
    ]
  },
  {
    id: 'bloodflowers',
    name: 'Bloodflowers',
    icon: `${curioPath}bloodflowers.png`,
    description: 'The soil is soaked through with half-clotted blood which seemingly feeds these vital blooms.',
    interactions: [
      { item: 'shovels', ...items.shovel, recommended: true, outcomes: [
        { label: 'Heirlooms x2 + Any Loot x1', tone: 'positive' }
      ]},
      { item: 'holyWaters', ...items.holyWater, outcomes: [
        { label: 'Stress +15', tone: 'danger' }
      ]},
      { item: 'theBlood', ...items.theBlood, outcomes: [
        { label: 'Nothing', tone: 'neutral' }
      ]},
      { item: 'none', ...items.none, outcomes: [
        { chance: 38.5, label: 'Stress +15', tone: 'danger' },
        { chance: 23.1, label: 'Scouting', tone: 'positive' },
        { chance: 15.3, label: 'Any Loot x2 + 16.7% The Blood', tone: 'positive' },
        { chance: 5.1, label: 'Disease: Tetanus', tone: 'danger' },
        { chance: 2.5, label: 'Random Disease', tone: 'danger' },
        { chance: 15.3, label: 'Nothing', tone: 'neutral' }
      ]}
    ]
  },
  {
    id: 'damned-fountain',
    name: 'Damned Fountain',
    icon: `${curioPath}damned_fountain.png`,
    description: 'A bubbling fountain spews crimson ichor from some damnable source.',
    interactions: [
      { item: 'holyWaters', ...items.holyWater, recommended: true, outcomes: [
        { label: 'Reduce Stress: -30', tone: 'positive' }
      ]},
      { item: 'torches', ...items.torch, outcomes: [
        { label: 'Stress +5', tone: 'danger' }
      ]},
      { item: 'none', ...items.none, outcomes: [
        { chance: 60, label: 'Bleed', tone: 'danger' },
        { chance: 20, label: 'Crimson Curse', tone: 'danger' },
        { chance: 20, label: 'Any Loot x2 + 16.7% Bleed', tone: 'mixed' }
      ]}
    ]
  },
  {
    id: 'disturbing-diversion',
    name: 'Disturbing Diversion',
    icon: `${curioPath}disturbing_diversion.png`,
    description: "Mouldering evidence of a society's depravity.",
    interactions: [
      { item: 'shovels', ...items.shovel, recommended: true, outcomes: [
        { label: 'Heirlooms x3', tone: 'positive' }
      ]},
      { item: 'none', ...items.none, outcomes: [
        { chance: 40, label: 'Stress +25', tone: 'danger' },
        { chance: 15, label: 'Random Positive Quirk', tone: 'positive' },
        { chance: 15, label: 'Random Negative Quirk', tone: 'danger' },
        { chance: 10, label: 'Any Loot x2 + 16.7% The Blood x2', tone: 'positive' },
        { chance: 20, label: 'Nothing', tone: 'neutral' }
      ]}
    ]
  },
  {
    id: 'forgotten-delicacies',
    name: 'Forgotten Delicacies',
    icon: `${curioPath}forgotten_delicacies.png`,
    description: 'An anachronistic mixture of both rotted and fresh victuals adorn the cart.',
    interactions: [
      { item: 'herbs', ...items.medicinalHerb, recommended: true, outcomes: [
        { label: 'Food x2 + Gold/Supplies x1', tone: 'positive' }
      ]},
      { item: 'none', ...items.none, outcomes: [
        { chance: 20, label: 'Gold/Supplies x4 + Supplies x1 + 25% The Blood', tone: 'positive' },
        { chance: 20, label: 'Negative Quirk: Stress Eater', tone: 'danger' },
        { chance: 20, label: 'Blight', tone: 'danger' },
        { chance: 13.3, label: 'Crimson Curse', tone: 'danger' },
        { chance: 6.7, label: 'Random Disease', tone: 'danger' },
        { chance: 20, label: 'Nothing', tone: 'neutral' }
      ]}
    ]
  },
  {
    id: 'hooded-shrew',
    name: 'Hooded Shrew',
    icon: `${curioPath}hooded_shrew.png`,
    description: 'A mysterious figure, not fully human, not fully insect, kneels here on the ground.',
    interactions: [
      { item: 'theBlood', ...items.theBlood, recommended: true, outcomes: [
        { label: '(non-set) Trinkets x2', tone: 'positive' }
      ]},
      { item: 'none', ...items.none, outcomes: [
        { chance: 42.8, label: 'Stress +15', tone: 'danger' },
        { chance: 28.5, label: 'Any Loot x1', tone: 'positive' },
        { chance: 7.6, label: 'Random Disease', tone: 'danger' },
        { chance: 14.2, label: 'Nothing', tone: 'neutral' }
      ]}
    ]
  },
  {
    id: 'throbbing-cocoons',
    name: 'Throbbing Cocoons',
    icon: `${curioPath}throbbing_cocoons.png`,
    description: 'Shifting and bulging organisms hide behind translucent walls.',
    interactions: [
      { item: 'torches', ...items.torch, recommended: true, outcomes: [
        { label: 'Reduce Stress: -30', tone: 'positive' }
      ]},
      { item: 'none', ...items.none, outcomes: [
        { chance: 75, label: 'Summon Supplicant, Sycophant, and Esquire', tone: 'danger' },
        { chance: 12.5, label: 'Any Loot x3 + 16.7% The Blood', tone: 'positive' },
        { chance: 12.5, label: 'Nothing', tone: 'neutral' }
      ]}
    ]
  },
  {
    id: 'thronging-hive',
    name: 'Thronging Hive',
    icon: `${curioPath}thronging_hive.png`,
    description: 'The hive is twisted and unnatural - the work of cursed vermin.',
    interactions: [
      { item: 'torches', ...items.torch, recommended: true, outcomes: [
        { label: 'Any Loot x3 + 16.7% Blood', tone: 'positive' }
      ]},
      { item: 'none', ...items.none, outcomes: [
        { chance: 75, label: 'Any Loot x2 + 20% Blood', tone: 'positive' },
        { chance: 25, label: 'Bleed', tone: 'danger' }
      ]}
    ]
  },
  {
    id: 'wine-crate',
    name: 'Wine Crate',
    icon: `${curioPath}wine_crate.png`,
    description: 'You can see that some of the bottles are still intact.',
    interactions: [
      { item: 'shovels', ...items.shovel, recommended: true, outcomes: [
        { label: 'Firewood', tone: 'positive' }
      ]},
      { item: 'antivenoms', ...items.antivenom, outcomes: [
        { label: 'Reduce Stress: -30', tone: 'positive' }
      ]},
      { item: 'none', ...items.none, outcomes: [
        { chance: 41.7, label: 'The Blood (33.3%) x2 + Any Loot x1 + Gold/Supplies x4', tone: 'positive' },
        { chance: 16.7, label: 'Crimson Curse', tone: 'danger' },
        { chance: 16.7, label: 'Negative Quirk: Tippler', tone: 'danger' },
        { chance: 8.3, label: 'Scouting', tone: 'positive' },
        { chance: 8.3, label: 'Bleed', tone: 'danger' },
        { chance: 8.3, label: 'Nothing', tone: 'neutral' }
      ]}
    ]
  },
  {
    id: 'wizened-shrew',
    name: 'Wizened Shrew',
    icon: `${curioPath}wizened_shrew.png`,
    description: 'This appears to be an elderly but shunned member of this damned court.',
    interactions: [
      { item: 'theBlood', ...items.theBlood, recommended: true, outcomes: [
        { label: '(non-set) Trinkets x3', tone: 'positive' }
      ]},
      { item: 'none', ...items.none, outcomes: [
        { chance: 33.3, label: 'Scouting', tone: 'positive' },
        { chance: 16.7, label: 'Random Disease', tone: 'danger' },
        { chance: 33.3, label: 'Nothing', tone: 'neutral' },
        { chance: 16.7, label: 'Nothing', tone: 'neutral' }
      ]}
    ]
  },
  {
    id: 'winemakers-reserve',
    name: "Winemaker's Reserve",
    icon: `${curioPath}winemakers_reserve.png`,
    description: 'Bottles of The Blood disguised as wine. Only appears during Gather the Blood expeditions.',
    interactions: [
      { item: 'none', ...items.none, outcomes: [
        { label: 'The Blood x3-5', tone: 'positive' }
      ]}
    ]
  },
  {
    id: 'lost-treasure-box',
    name: 'Lost Treasure Box',
    icon: `${curioPath}lost_treasure_box.png`,
    description: 'This chest must hold some kind of loot.',
    interactions: [
      { item: 'keys', ...items.skeletonKey, recommended: true, outcomes: [
        { label: 'Heirlooms x2 + Any Loot x1', tone: 'positive' }
      ]},
      { item: 'none', ...items.none, outcomes: [
        { label: 'Any loot x1 + (non-set) Trinket x2 + Gems x1', tone: 'positive' }
      ]}
    ]
  },
  {
    id: 'trinket-chest',
    name: 'Trinket Chest',
    icon: `${curioPath}trinket_chest.png`,
    description: 'Only appears during the main Courtyard campaign expeditions.',
    interactions: [
      { item: 'keys', ...items.skeletonKey, recommended: true, outcomes: [
        { label: 'Heirlooms x2 + Any Loot x1', tone: 'positive' }
      ]},
      { item: 'none', ...items.none, outcomes: [
        { label: 'Set Trinket x1', tone: 'positive' }
      ]}
    ]
  }
];

// Farmstead curios data
const farmsteadCurios: Omit<Curio, 'location'>[] = [
  {
    id: 'corrupted-harvest',
    name: 'Corrupted Harvest',
    icon: `${curioPath}corrupted_harvest.png`,
    description: 'Take up the axe. Blow off some steam.',
    interactions: [
      { item: 'none', ...items.none, outcomes: [
        { label: 'Reduce Stress: -60 (Party)', tone: 'positive' }
      ]}
    ]
  },
  {
    id: 'fresh-harvest',
    name: 'Fresh Harvest',
    icon: `${curioPath}fresh_harvest.png`,
    description: 'Tantalizing provisions to renew a body.',
    interactions: [
      { item: 'none', ...items.none, outcomes: [
        { label: 'Heal 90% of MAX HP', tone: 'positive' }
      ]}
    ]
  },
  {
    id: 'gleaming-shards',
    name: 'Gleaming Shards',
    icon: `${curioPath}gleaming_shards.png`,
    description: 'Glittering crystals spill onto the ground.',
    interactions: [
      { item: 'none', ...items.none, outcomes: [
        { label: 'Comet Shards x5 to 15', tone: 'positive' }
      ]}
    ]
  },
  {
    id: 'millers-hearth',
    name: "Miller's Hearth",
    icon: `${curioPath}millers_hearth.png`,
    description: 'The fireplace is slowly coming apart but looks functional.',
    interactions: [
      { item: 'none', ...items.none, outcomes: [
        { label: 'Camp', tone: 'positive' }
      ]}
    ]
  },
  {
    id: 'plentiful-bounty',
    name: 'Plentiful Bounty',
    icon: `${curioPath}plentiful_bounty.png`,
    description: 'Tantalizing provisions to renew our energies.',
    interactions: [
      { item: 'none', ...items.none, outcomes: [
        { label: 'Heal 65% of MAX HP (Party)', tone: 'positive' }
      ]}
    ]
  },
  {
    id: 'rotted-fare',
    name: 'Rotted Fare',
    icon: `${curioPath}rotted_fare.png`,
    description: 'Take up the hatchet. Blow off some steam.',
    interactions: [
      { item: 'none', ...items.none, outcomes: [
        { label: 'Reduce Stress: -100', tone: 'positive' }
      ]}
    ]
  },
  {
    id: 'stockpile',
    name: 'Stockpile',
    icon: `${curioPath}stockpile.png`,
    description: 'Useful supplies for this harrowing journey.',
    interactions: [
      { item: 'keys', ...items.skeletonKey, recommended: true, outcomes: [
        { label: 'Food x6-12 + Any Supplies + Trinket', tone: 'positive' }
      ]},
      { item: 'none', ...items.none, outcomes: [
        { chance: 66.7, label: 'Laudanum/Medicinal Herbs/Food', tone: 'positive' },
        { chance: 33.3, label: 'Nothing', tone: 'neutral' }
      ]}
    ]
  },
  {
    id: 'mildred',
    name: 'Mildred',
    icon: `${curioPath}mildred.png`,
    description: 'This anguished creature does not seem hostile, yet.',
    interactions: [
      { item: 'none', ...items.none, outcomes: [
        { label: "Trinket: Mildred's Locket (First encounter only) / Any Trinket/Shards (Subsequent encounters)", tone: 'positive' }
      ]}
    ]
  }
];

export { courtyardCurios, farmsteadCurios };
