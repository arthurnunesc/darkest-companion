import type { Curio, CurioInteraction, LocationId } from './types';

const curioPath = '/icons/curios/';
const provisionPath = '/icons/provisions/';

const items = {
  none: { label: 'Nothing', icon: '/icons/redCross.png' },
  antivenoms: { label: 'Antivenom', icon: `${provisionPath}Antivenom.png` },
  bandages: { label: 'Bandage', icon: `${provisionPath}Bandage.png` },
  blood: { label: 'The Blood', icon: `${provisionPath}Food_0.png` },
  dogTreats: { label: 'Dog Treats', icon: `${provisionPath}Dog_Treats.png` },
  herbs: { label: 'Medicinal Herbs', icon: `${provisionPath}Medicinal_Herbs.png` },
  holyWaters: { label: 'Holy Water', icon: `${provisionPath}Holy_Water.png` },
  keys: { label: 'Skeleton Key', icon: `${provisionPath}Skeleton_Key.png` },
  shovels: { label: 'Shovel', icon: `${provisionPath}Shovel.png` },
  torches: { label: 'Torch', icon: `${provisionPath}Torch.png` }
} as const;

const universal: Omit<Curio, 'location'>[] = [
  {
    id: 'crate',
    name: 'Crate',
    icon: `${curioPath}crate.png`,
    interactions: [{ item: 'none', ...items.none, outcomes: [{ chance: 75, label: 'Heirlooms', tone: 'positive' }, { chance: 25, label: 'Nothing', tone: 'neutral' }] }]
  },
  {
    id: 'discarded-pack',
    name: 'Discarded Pack',
    icon: `${curioPath}discarded_pack.png`,
    interactions: [{ item: 'none', ...items.none, outcomes: [{ chance: 60, label: 'Gold, gems, or supplies', tone: 'positive' }, { chance: 20, label: 'Scouting', tone: 'positive' }, { chance: 20, label: 'Nothing', tone: 'neutral' }] }]
  },
  {
    id: 'heirloom-chest',
    name: 'Heirloom Chest',
    icon: `${curioPath}heirloom_chest.png`,
    interactions: [
      { item: 'none', ...items.none, outcomes: [{ chance: 75, label: 'Gold or gems', tone: 'positive' }, { chance: 25, label: 'Bleed or blight trap', tone: 'danger' }] },
      { item: 'keys', ...items.keys, recommended: true, outcomes: [{ label: 'Heirlooms', tone: 'positive' }] }
    ]
  },
  {
    id: 'shamblers-altar',
    name: "Shambler's Altar",
    icon: `${curioPath}shamblers_altar.png`,
    interactions: [
      { item: 'none', ...items.none, outcomes: [{ label: 'Nothing', tone: 'neutral' }] },
      { item: 'torches', ...items.torches, outcomes: [{ label: 'Summon Shambler', tone: 'danger' }] }
    ]
  }
];

const byLocation: Record<LocationId, Omit<Curio, 'location'>[]> = {
  ruins: [
    {
      id: 'alchemy-table',
      name: 'Alchemy Table',
      icon: `${curioPath}alchemy_table.png`,
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Blight', tone: 'danger' }, { chance: 25, label: 'Gold or gems', tone: 'positive' }, { chance: 25, label: 'Nothing', tone: 'neutral' }] },
        { item: 'herbs', ...items.herbs, recommended: true, outcomes: [{ label: 'Gold or gems', tone: 'positive' }] },
        { item: 'torches', ...items.torches, outcomes: [{ label: 'Set light to 100', tone: 'positive' }] }
      ]
    },
    {
      id: 'bookshelf',
      name: 'Bookshelf',
      icon: `${curioPath}bookshelf.png`,
      interactions: [{ item: 'none', ...items.none, outcomes: [{ chance: 25, label: 'Scouting', tone: 'positive' }, { chance: 16, label: 'Positive quirk', tone: 'positive' }, { chance: 33, label: 'Stress, quirk, or disease', tone: 'danger' }, { chance: 25, label: 'Nothing', tone: 'neutral' }] }]
    },
    {
      id: 'confession-booth',
      name: 'Confession Booth',
      icon: `${curioPath}confession_booth.png`,
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Stress', tone: 'danger' }, { chance: 25, label: 'Gold or trinket', tone: 'positive' }, { chance: 25, label: 'Purge negative quirk', tone: 'positive' }] },
        { item: 'holyWaters', ...items.holyWaters, recommended: true, outcomes: [{ label: 'Stress heal', tone: 'positive' }] }
      ]
    },
    {
      id: 'sarcophagus',
      name: 'Sarcophagus',
      icon: `${curioPath}sarcophagus.png`,
      interactions: [{ item: 'none', ...items.none, outcomes: [{ chance: 60, label: 'Gold or heirlooms', tone: 'positive' }, { chance: 20, label: 'Negative quirk', tone: 'danger' }, { chance: 20, label: 'Nothing', tone: 'neutral' }] }]
    }
  ],
  warrens: [
    {
      id: 'dinner-cart',
      name: 'Dinner Cart',
      icon: `${curioPath}dinner_cart.png`,
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 25, label: 'Food or gold', tone: 'positive' }, { chance: 25, label: 'Disease', tone: 'danger' }, { chance: 50, label: 'Nothing', tone: 'neutral' }] },
        { item: 'herbs', ...items.herbs, recommended: true, outcomes: [{ label: 'Gold, food, or trinket', tone: 'positive' }] }
      ]
    },
    {
      id: 'moonshine-barrel',
      name: 'Moonshine Barrel',
      icon: `${curioPath}moonshine_barrel.png`,
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 33, label: 'Gold, food, or supplies', tone: 'positive' }, { chance: 44, label: 'Blight, disease, or nothing', tone: 'danger' }] },
        { item: 'herbs', ...items.herbs, recommended: true, outcomes: [{ label: '+30% damage until camp', tone: 'positive' }] }
      ]
    },
    {
      id: 'sacrificial-stone',
      name: 'Sacrificial Stone',
      icon: `${curioPath}sacrificial_stone.png`,
      interactions: [{ item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Positive quirk', tone: 'positive' }, { chance: 50, label: 'Negative quirk or stress', tone: 'danger' }] }]
    }
  ],
  weald: [
    {
      id: 'beast-carcass',
      name: 'Beast Carcass',
      icon: `${curioPath}beast_carcass.png`,
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 42, label: 'Food', tone: 'positive' }, { chance: 42, label: 'Disease or blight', tone: 'danger' }, { chance: 16, label: 'Nothing', tone: 'neutral' }] },
        { item: 'herbs', ...items.herbs, recommended: true, outcomes: [{ label: 'Food', tone: 'positive' }] }
      ]
    },
    {
      id: 'eerie-spiderweb',
      name: 'Eerie Spiderweb',
      icon: `${curioPath}eerie_spiderweb.png`,
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 40, label: 'Gold or trinket', tone: 'positive' }, { chance: 40, label: 'Blight or negative quirk', tone: 'danger' }, { chance: 20, label: 'Nothing', tone: 'neutral' }] },
        { item: 'bandages', ...items.bandages, recommended: true, outcomes: [{ label: 'Gold or trinket', tone: 'positive' }] }
      ]
    },
    {
      id: 'old-tree',
      name: 'Old Tree',
      icon: `${curioPath}old_tree.png`,
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Gold or gems', tone: 'positive' }, { chance: 50, label: 'Blight or nothing', tone: 'mixed' }] },
        { item: 'antivenoms', ...items.antivenoms, recommended: true, outcomes: [{ label: 'Gold or gems', tone: 'positive' }] }
      ]
    }
  ],
  cove: [
    {
      id: 'eerie-coral',
      name: 'Eerie Coral',
      icon: `${curioPath}eerie_coral.png`,
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Stress heal', tone: 'positive' }, { chance: 25, label: 'Stress', tone: 'danger' }, { chance: 25, label: 'Nothing', tone: 'neutral' }] },
        { item: 'herbs', ...items.herbs, recommended: true, outcomes: [{ label: 'Purge negative quirk', tone: 'positive' }] }
      ]
    },
    {
      id: 'fish-idol',
      name: 'Fish Idol',
      icon: `${curioPath}fish_idol.png`,
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 100, label: 'Debuff', tone: 'danger' }] },
        { item: 'holyWaters', ...items.holyWaters, recommended: true, outcomes: [{ label: 'Damage or accuracy buff', tone: 'positive' }] }
      ]
    },
    {
      id: 'giant-oyster',
      name: 'Giant Oyster',
      icon: `${curioPath}giant_oyster.png`,
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 40, label: 'Gold or trinket', tone: 'positive' }, { chance: 40, label: 'Bleed', tone: 'danger' }, { chance: 20, label: 'Nothing', tone: 'neutral' }] },
        { item: 'shovels', ...items.shovels, recommended: true, outcomes: [{ label: 'Gold or trinket', tone: 'positive' }] }
      ]
    }
  ],
  courtyard: [
    {
      id: 'bloodflowers',
      name: 'Bloodflowers',
      icon: `${curioPath}troubling_effigy.png`,
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ label: 'Stress or bleed risk', tone: 'danger' }] },
        { item: 'shovels', ...items.shovels, recommended: true, outcomes: [{ label: 'Treasure', tone: 'positive' }] },
        { item: 'blood', ...items.blood, outcomes: [{ label: 'Powerful but risky Crimson Court interaction', tone: 'mixed' }] }
      ]
    },
    {
      id: 'wine-crate',
      name: 'Wine Crate',
      icon: `${curioPath}crate.png`,
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ label: 'Supplies or nothing', tone: 'mixed' }] },
        { item: 'antivenoms', ...items.antivenoms, recommended: true, outcomes: [{ label: 'The Blood', tone: 'positive' }] }
      ]
    }
  ],
  farmstead: [
    {
      id: 'gleaming-shard',
      name: 'Gleaming Shard',
      icon: `${curioPath}ancient_artifact.png`,
      interactions: [{ item: 'none', ...items.none, outcomes: [{ label: 'Shard reward or wave modifier', tone: 'mixed' }] }]
    },
    {
      id: 'miller-cache',
      name: "Miller's Cache",
      icon: `${curioPath}locked_display_cabinet.png`,
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ label: 'Supplies with risk', tone: 'mixed' }] },
        { item: 'keys', ...items.keys, recommended: true, outcomes: [{ label: 'Supplies and shards', tone: 'positive' }] }
      ]
    }
  ]
};

export const curios: Curio[] = Object.entries(byLocation).flatMap(([location, locationCurios]) => [
  ...universal.map((curio) => ({ ...curio, location: location as LocationId })),
  ...locationCurios.map((curio) => ({ ...curio, location: location as LocationId }))
]);

export function getCuriosForLocation(location: LocationId) {
  return curios.filter((curio) => curio.location === location);
}

export function getCuriosByItem(location: LocationId) {
  const groups = new Map<CurioInteraction['item'], { label: string; icon: string; curios: Curio[] }>();

  for (const curio of getCuriosForLocation(location)) {
    for (const interaction of curio.interactions) {
      if (interaction.item === 'none') continue;
      const existing = groups.get(interaction.item) ?? { label: interaction.label, icon: interaction.icon, curios: [] };
      existing.curios.push(curio);
      groups.set(interaction.item, existing);
    }
  }

  return Array.from(groups.entries()).map(([item, group]) => ({ item, ...group }));
}
