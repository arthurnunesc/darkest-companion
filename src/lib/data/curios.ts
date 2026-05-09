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
  torch: { label: 'Torch', icon: `${provisionPath}Torch.png` }
} as const;

const universal: Omit<Curio, 'location'>[] = [
  {
    id: 'ancient-artifact',
    name: 'Ancient Artifact',
    icon: `${curioPath}ancient_artifact.png`,
    interactions: [
      { item: 'none', ...items.none, outcomes: [{ chance: 100, label: 'Gold or gems', amount: 2.5, tone: 'positive' }] },
      { item: 'keys', ...items.skeletonKey, recommended: true, outcomes: [{ chance: 100, label: 'Special trinket or Puzzling Trapezohedron', amount: 3, tone: 'positive' }] }
    ]
  },
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
    interactions: [{ item: 'none', ...items.none, outcomes: [{ chance: 60, label: 'Gold, gems or supplies', amount: 1.5, tone: 'positive' }, { chance: 20, label: 'Scouting', tone: 'positive' }, { chance: 20, label: 'Nothing', tone: 'neutral' }] }]
  },
  {
    id: 'eldritch-altar',
    name: 'Eldritch Altar',
    icon: `${curioPath}eldritch_alter.png`,
    description: 'A weird and unnatural statuette that appears to be an item of unholy worship.',
    interactions: [
      { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Stress +50', tone: 'danger' }, { chance: 33, label: 'Gain positive quirk', tone: 'positive' }, { chance: 16, label: 'Gain negative quirk', tone: 'danger' }, { chance: 16, label: 'Nothing', tone: 'neutral' }] },
      { item: 'holyWaters', ...items.holyWater, recommended: true, outcomes: [{ label: 'Purge a negative quirk', tone: 'positive' }] }
    ]
  },
  {
    id: 'heirloom-chest',
    name: 'Heirloom Chest',
    icon: `${curioPath}heirloom_chest.png`,
    description: "A chest with your family's sigil.",
    interactions: [
      { item: 'none', ...items.none, outcomes: [{ chance: 75, label: 'Gold or gems', amount: 2, tone: 'positive' }, { chance: 12.5, label: 'Bleed', tone: 'danger' }, { chance: 12.5, label: 'Blight', tone: 'danger' }] },
      { item: 'keys', ...items.skeletonKey, recommended: true, outcomes: [{ label: 'Heirlooms', amount: 3, tone: 'positive' }] },
      { item: 'antivenoms', ...items.antivenom, recommended: true, outcomes: [{ label: 'Heirlooms', amount: 3, tone: 'positive' }] }
    ]
  },
  {
    id: 'sack',
    name: 'Sack',
    icon: `${curioPath}sack.png`,
    interactions: [{ item: 'none', ...items.none, outcomes: [{ chance: 75, label: 'Gold or gems', tone: 'positive' }, { chance: 25, label: 'Nothing', tone: 'neutral' }] }]
  },
  {
    id: 'sconce',
    name: 'Sconce',
    icon: `${curioPath}sconce.png`,
    interactions: [{ item: 'none', ...items.none, outcomes: [{ label: 'Torch', tone: 'positive' }] }]
  },
  {
    id: 'shamblers-altar',
    name: "Shambler's Altar",
    icon: `${curioPath}shamblers_altar.png`,
    description: 'It says: "The sacrifice of fire is the gate to ruin! Place a torch if you crave the void!"',
    interactions: [
      { item: 'none', ...items.none, outcomes: [{ label: 'Nothing', tone: 'neutral' }] },
      { item: 'torches', ...items.torch, outcomes: [{ label: 'Summon Shambler', tone: 'danger' }] }
    ]
  },
  {
    id: 'unlocked-strongbox',
    name: 'Unlocked Strongbox',
    icon: `${curioPath}unlocked_strongbox.png`,
    description: 'A long-forgotten strongbox sits on the cold stone floor, its contents unknown.',
    interactions: [{ item: 'none', ...items.none, outcomes: [{ chance: 75, label: 'Any loot', amount: 2, tone: 'positive' }, { chance: 25, label: 'Blight', tone: 'danger' }] }]
  }
];

const byLocation: Record<LocationId, Omit<Curio, 'location'>[]> = {
  ruins: [
    {
      id: 'alchemy-table',
      name: 'Alchemy Table',
      icon: `${curioPath}alchemy_table.png`,
      description: 'A partially intact set of experimental equipment.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Blight', tone: 'danger' }, { chance: 25, label: 'Gold or gems', tone: 'positive' }, { chance: 25, label: 'Nothing', tone: 'neutral' }] },
        { item: 'torches', ...items.torch, outcomes: [{ label: 'Set light to 100', tone: 'positive' }] },
        { item: 'herbs', ...items.medicinalHerb, recommended: true, outcomes: [{ label: 'Gold or gems', amount: 2, tone: 'positive' }] }
      ]
    },
    {
      id: 'altar-of-light',
      name: 'Altar of Light',
      icon: `${curioPath}altar_of_light.png`,
      description: 'A small holy altar seems out of place against the backdrop of corruption.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ label: 'Buff +20% DMG until camp', tone: 'positive' }] },
        { item: 'holyWaters', ...items.holyWater, recommended: true, outcomes: [{ label: 'Buff +30% DMG until camp', tone: 'positive' }] }
      ]
    },
    {
      id: 'bookshelf',
      name: 'Bookshelf',
      icon: `${curioPath}bookshelf.png`,
      description: 'A bookshelf full of old, leather-bound books.',
      interactions: [{ item: 'none', ...items.none, outcomes: [{ chance: 25, label: 'Scouting', tone: 'positive' }, { chance: 25, label: 'Stress +50', tone: 'danger' }, { chance: 16, label: 'Positive quirk', tone: 'positive' }, { chance: 8, label: 'Negative quirk or disease', tone: 'danger' }, { chance: 25, label: 'Nothing', tone: 'neutral' }] }]
    },
    {
      id: 'confession-booth',
      name: 'Confession Booth',
      icon: `${curioPath}confession_booth.png`,
      description: "A forsaken confession booth. It hasn't been used in years.",
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Stress +20', tone: 'danger' }, { chance: 25, label: 'Gold or trinket', tone: 'positive' }, { chance: 25, label: 'Purge a negative quirk', tone: 'positive' }] },
        { item: 'holyWaters', ...items.holyWater, recommended: true, outcomes: [{ label: 'Stress heal 30', tone: 'positive' }] }
      ]
    },
    {
      id: 'decorative-urn',
      name: 'Decorative Urn',
      icon: `${curioPath}decorative_urn.png`,
      description: 'An urn holds ashes of the departed.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 44, label: 'Gold or trinket', amount: 2, tone: 'positive' }, { chance: 22, label: 'Blight', tone: 'danger' }, { chance: 7, label: 'Creeping Cough disease', tone: 'danger' }, { chance: 3, label: 'Random disease', tone: 'danger' }, { chance: 22, label: 'Nothing', tone: 'neutral' }] },
        { item: 'holyWaters', ...items.holyWater, recommended: true, outcomes: [{ label: 'Gold or trinket', amount: 2, tone: 'positive' }] },
        { item: 'shovels', ...items.shovel, outcomes: [{ label: 'Gain negative quirk: Guilty Conscience', tone: 'danger' }] }
      ]
    },
    {
      id: 'holy-fountain',
      name: 'Holy Fountain',
      icon: `${curioPath}holy_fountain.png`,
      description: 'An ornate fountain of holy purport.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Heal 10 stress, cure status effect, heal 5 HP', tone: 'positive' }, { chance: 50, label: 'Gold or gems', tone: 'positive' }] },
        { item: 'holyWaters', ...items.holyWater, recommended: true, outcomes: [{ label: 'Heal 20 stress, cure status effect, heal 12 HP', tone: 'positive' }] }
      ]
    },
    {
      id: 'iron-maiden',
      name: 'Iron Maiden',
      icon: `${curioPath}iron_maiden.png`,
      description: 'A rusty iron maiden stands against the wall, clasped shut.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 40, label: 'Any loot', amount: 2, tone: 'positive' }, { chance: 20, label: 'Gain negative quirk: Claustrophobia', tone: 'danger' }, { chance: 13, label: 'Tetanus disease', tone: 'danger' }, { chance: 6, label: 'Random disease', tone: 'danger' }, { chance: 20, label: 'Nothing', tone: 'neutral' }] },
        { item: 'herbs', ...items.medicinalHerb, recommended: true, outcomes: [{ label: 'Any loot', tone: 'positive' }] }
      ]
    },
    {
      id: 'locked-display-cabinet',
      name: 'Locked Display Cabinet',
      icon: `${curioPath}locked_display_cabinet.png`,
      description: 'There could be valuables left inside, but this cabinet is locked.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Bleed', amount: 2, tone: 'danger' }, { chance: 50, label: 'Blight', tone: 'danger' }] },
        { item: 'keys', ...items.skeletonKey, recommended: true, outcomes: [{ label: 'Gold, gems or heirlooms', amount: 2.5, tone: 'positive' }] },
        { item: 'shovels', ...items.shovel, outcomes: [{ label: 'Gold, gems or heirlooms', amount: 2, tone: 'positive' }] }
      ]
    },
    {
      id: 'locked-sarcophagus',
      name: 'Locked Sarcophagus',
      icon: `${curioPath}locked_sarcophagus.png`,
      description: "An ornate sarcophagus. It's locked.",
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Bleed', amount: 2, tone: 'danger' }, { chance: 50, label: 'Blight', tone: 'danger' }] },
        { item: 'keys', ...items.skeletonKey, recommended: true, outcomes: [{ label: 'Gold, gems or heirlooms', amount: 1.5, tone: 'positive' }] },
        { item: 'shovels', ...items.shovel, outcomes: [{ label: 'Gold, gems or heirlooms', tone: 'positive' }] }
      ]
    },
    {
      id: 'sarcophagus',
      name: 'Sarcophagus',
      icon: `${curioPath}sarcophagus.png`,
      description: 'An ornate sarcophagus. It is slightly ajar.',
      interactions: [{ item: 'none', ...items.none, outcomes: [{ chance: 60, label: 'Gold or heirlooms', amount: 2, tone: 'positive' }, { chance: 20, label: 'Gain negative quirk: Thanatophobia', tone: 'danger' }, { chance: 20, label: 'Nothing', tone: 'neutral' }] }]
    },
    {
      id: 'stack-of-books',
      name: 'Stack of Books',
      icon: `${curioPath}stack_of_books.png`,
      description: 'A stack of literary treasures in an unlikely location.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 26, label: 'Stress +25', tone: 'danger' }, { chance: 26, label: 'Positive quirk', tone: 'positive' }, { chance: 13, label: 'Negative quirk', tone: 'danger' }, { chance: 13, label: 'Decrease light by 25', tone: 'danger' }, { chance: 20, label: 'Nothing', tone: 'neutral' }] },
        { item: 'torches', ...items.torch, outcomes: [{ label: 'Stress +100', tone: 'danger' }] }
      ]
    },
    {
      id: 'suit-of-armor',
      name: 'Suit of Armor',
      icon: `${curioPath}suit_of_armor.png`,
      description: 'An antique suit of armor stands amidst the ruins.',
      interactions: [{ item: 'none', ...items.none, outcomes: [{ chance: 75, label: 'Buff +10 DODGE, +10% PROT until camp', tone: 'positive' }, { chance: 12.5, label: 'Gain positive quirk: Ruins Adventurer', tone: 'positive' }, { chance: 12.5, label: 'Gain positive quirk: Ruins Tactician', tone: 'positive' }] }]
    }
  ],
  warrens: [
    {
      id: 'bone-altar',
      name: 'Bone Altar',
      icon: `${curioPath}bone_altar.png`,
      description: 'A dark altar with skulls prominently on display. A strange power can be felt in its presence.',
      interactions: [{ item: 'none', ...items.none, outcomes: [{ label: 'Buff +15% DMG, +10 ACC, +5% CRT, Cure Status Effects', tone: 'positive' }] }]
    },
    {
      id: 'dinner-cart',
      name: 'Dinner Cart',
      icon: `${curioPath}dinner_cart.png`,
      description: 'A cart of human remains. It looks much like a feeding trough. Disgusting.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 25, label: 'Gold, food or trinket', amount: 1, tone: 'positive' }, { chance: 25, label: 'Blight', tone: 'danger' }, { chance: 25, label: 'Random disease', tone: 'danger' }, { chance: 25, label: 'Nothing', tone: 'neutral' }] },
        { item: 'herbs', ...items.medicinalHerb, recommended: true, outcomes: [{ label: 'Gold, food or trinket', amount: 2, tone: 'positive' }] }
      ]
    },
    {
      id: 'makeshift-dining-table',
      name: 'Makeshift Dining Table',
      icon: `${curioPath}makeshift_dining_table.png`,
      description: 'An oddly assembled dining table. There might still be food scraps around.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 25, label: 'Gold, food or trinket', amount: 1, tone: 'positive' }, { chance: 25, label: 'Blight', tone: 'danger' }, { chance: 25, label: 'Random disease', tone: 'danger' }, { chance: 25, label: 'Nothing', tone: 'neutral' }] },
        { item: 'herbs', ...items.medicinalHerb, recommended: true, outcomes: [{ label: 'Gold, food or trinket', amount: 2, tone: 'positive' }] }
      ]
    },
    {
      id: 'moonshine-barrel',
      name: 'Moonshine Barrel',
      icon: `${curioPath}moonshine_barrel.png`,
      description: 'A barrel that reeks of powerful liquors.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 33.3, label: 'Gold, food or supplies', amount: 1, tone: 'positive' }, { chance: 33.3, label: 'Blight', tone: 'danger' }, { chance: 11.1, label: 'Alcoholism disease', tone: 'danger' }, { chance: 22.2, label: 'Nothing', tone: 'neutral' }] },
        { item: 'herbs', ...items.medicinalHerb, recommended: true, outcomes: [{ label: 'Buff +30% DMG until camp', tone: 'positive' }] }
      ]
    },
    {
      id: 'occult-scrawlings',
      name: 'Occult Scrawlings',
      icon: `${curioPath}occult_scrawlings.png`,
      description: 'Scrawlings written on what looks like stretched and tanned human flesh...',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 33.3, label: 'Positive quirk', tone: 'positive' }, { chance: 25, label: 'Stress +25', tone: 'danger' }, { chance: 17.6, label: 'Negative quirk', tone: 'danger' }, { chance: 25, label: 'Nothing', tone: 'neutral' }] },
        { item: 'holyWaters', ...items.holyWater, outcomes: [{ label: 'Debuff -20 DODGE', tone: 'danger' }] }
      ]
    },
    {
      id: 'pile-of-bones',
      name: 'Pile of Bones',
      icon: `${curioPath}pile_of_bones.png`,
      description: "All that's left of a previous adventurer, perhaps.",
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 25, label: 'Any loot', amount: 2, tone: 'positive' }, { chance: 25, label: 'Random disease', tone: 'danger' }, { chance: 25, label: 'Gain negative quirk: Bloodthirsty', tone: 'danger' }, { chance: 25, label: 'Nothing', tone: 'neutral' }] },
        { item: 'holyWaters', ...items.holyWater, outcomes: [{ label: 'Any loot', amount: 2, tone: 'positive' }] }
      ]
    },
    {
      id: 'pile-of-scrolls',
      name: 'Pile of Scrolls',
      icon: `${curioPath}pile_of_scrolls.png`,
      description: 'A bunch of scrolls. The cursive is sloppy and difficult to read.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 33.3, label: 'Scouting', tone: 'positive' }, { chance: 16.7, label: 'Stress +15', tone: 'danger' }, { chance: 11.1, label: 'Positive quirk', tone: 'positive' }, { chance: 5.6, label: 'Negative quirk', tone: 'danger' }, { chance: 33.3, label: 'Nothing', tone: 'neutral' }] },
        { item: 'torches', ...items.torch, outcomes: [{ label: 'Purge a negative quirk', tone: 'positive' }] }
      ]
    },
    {
      id: 'rack-of-blades',
      name: 'Rack of Blades',
      icon: `${curioPath}rack_of_blades.png`,
      description: 'A rack of dulled, rusty knives. They are covered in fresh blood.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 40, label: 'Gold, gems or food', tone: 'positive' }, { chance: 40, label: 'Bleed', tone: 'danger' }, { chance: 20, label: 'Nothing', tone: 'neutral' }] },
        { item: 'bandages', ...items.bandage, recommended: true, outcomes: [{ label: 'Gold, gems or food', amount: 1.5, tone: 'positive' }] }
      ]
    },
    {
      id: 'sacrificial-stone',
      name: 'Sacrificial Stone',
      icon: `${curioPath}sacrificial_stone.png`,
      description: 'A stone used for ancient, barbaric rituals.',
      interactions: [{ item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Stress +50', tone: 'danger' }, { chance: 25, label: 'Purge a negative quirk', tone: 'positive' }, { chance: 12.5, label: 'Gain positive quirk: Warrens Explorer', tone: 'positive' }, { chance: 12.5, label: 'Gain positive quirk: Warrens Explorer', tone: 'positive' }] }]
    },
    {
      id: 'stack-of-books-warrens',
      name: 'Stack of Books',
      icon: `${curioPath}stack_of_books.png`,
      description: 'A stack of literary treasures in an unlikely location.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 26.7, label: 'Stress +25', tone: 'danger' }, { chance: 26.7, label: 'Positive quirk', tone: 'positive' }, { chance: 13.3, label: 'Negative quirk', tone: 'danger' }, { chance: 13.3, label: 'Decrease light by 25', tone: 'danger' }, { chance: 20, label: 'Nothing', tone: 'neutral' }] },
        { item: 'torches', ...items.torch, outcomes: [{ label: 'Stress +100', tone: 'danger' }] }
      ]
    }
  ],
  weald: [
    {
      id: 'ancient-coffin',
      name: 'Ancient Coffin',
      icon: `${curioPath}ancient_coffin.png`,
      description: 'An old coffin. It is slightly ajar.',
      interactions: [{ item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Gold or heirlooms', amount: 2, tone: 'positive' }, { chance: 8.3, label: 'Gain positive quirk: Weald Adventurer', tone: 'positive' }, { chance: 8.3, label: 'Gain positive quirk: Weald Adventurer', tone: 'positive' }, { chance: 33.3, label: 'Nothing', tone: 'neutral' }] }]
    },
    {
      id: 'beast-carcass',
      name: 'Beast Carcass',
      icon: `${curioPath}beast_carcass.png`,
      description: 'Something has recently mutilated this creature...',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 42.9, label: 'Food', tone: 'positive' }, { chance: 28.6, label: 'Rabies disease', tone: 'danger' }, { chance: 14.3, label: 'Gain negative quirk: Zoophobia', tone: 'danger' }, { chance: 14.3, label: 'Nothing', tone: 'neutral' }] },
        { item: 'herbs', ...items.medicinalHerb, recommended: true, outcomes: [{ label: 'Food', amount: 2, tone: 'positive' }] }
      ]
    },
    {
      id: 'eerie-spiderweb',
      name: 'Eerie Spiderweb',
      icon: `${curioPath}eerie_spiderweb.png`,
      description: 'A spiderweb with a strange glow to it. There might be something behind it.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 40, label: 'Gold, gems or trinket', tone: 'positive' }, { chance: 10, label: 'Gain negative quirk: Slow Reflexes', tone: 'danger' }, { chance: 10, label: 'Gain negative quirk: Slowdraw', tone: 'danger' }, { chance: 40, label: 'Nothing', tone: 'neutral' }] },
        { item: 'bandages', ...items.bandage, recommended: true, outcomes: [{ label: 'Gold, gems or trinket', amount: 1.5, tone: 'positive' }] }
      ]
    },
    {
      id: 'left-luggage',
      name: 'Left Luggage',
      icon: `${curioPath}left_luggage.png`,
      description: 'Someone dropped this recently. Probably on the run. It has a lock on it.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Any loot', tone: 'positive' }, { chance: 50, label: 'Blight', tone: 'danger' }] },
        { item: 'keys', ...items.skeletonKey, recommended: true, outcomes: [{ label: 'Any loot', amount: 3, tone: 'positive' }] },
        { item: 'antivenoms', ...items.antivenom, recommended: true, outcomes: [{ label: 'Any loot', amount: 3, tone: 'positive' }] }
      ]
    },
    {
      id: 'mummified-remains',
      name: 'Mummified Remains',
      icon: `${curioPath}mummified_remains.png`,
      description: 'Ancient remains. The body looks well preserved.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 40, label: 'Gold or trinket', tone: 'positive' }, { chance: 40, label: 'Blight', tone: 'danger' }, { chance: 20, label: 'Nothing', tone: 'neutral' }] },
        { item: 'bandages', ...items.bandage, recommended: true, outcomes: [{ label: 'Gold or trinket', amount: 2, tone: 'positive' }] }
      ]
    },
    {
      id: 'old-tree',
      name: 'Old Tree',
      icon: `${curioPath}old_tree.png`,
      description: "This tree has a huge hole in the trunk. Perhaps there's something inside...",
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Any loot', amount: 2, tone: 'positive' }, { chance: 25, label: 'Blight', tone: 'danger' }, { chance: 25, label: 'Nothing', tone: 'neutral' }] },
        { item: 'antivenoms', ...items.antivenom, recommended: true, outcomes: [{ label: 'Any loot', amount: 3, tone: 'positive' }] }
      ]
    },
    {
      id: 'pristine-fountain',
      name: 'Pristine Fountain',
      icon: `${curioPath}pristine_fountain.png`,
      description: 'A beautiful fountain. It looks unaffected by the surrounding chaos.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ label: 'Stress heal 20', tone: 'positive' }] },
        { item: 'holyWaters', ...items.holyWater, recommended: true, outcomes: [{ label: 'Stress heal 30', tone: 'positive' }] }
      ]
    },
    {
      id: 'shallow-grave',
      name: 'Shallow Grave',
      icon: `${curioPath}shallow_grave.png`,
      description: 'A grave, dug in haste.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Blight', tone: 'danger' }, { chance: 50, label: 'Random disease', tone: 'danger' }] },
        { item: 'shovels', ...items.shovel, recommended: true, outcomes: [{ label: 'Gems or heirlooms', amount: 3, tone: 'positive' }] }
      ]
    },
    {
      id: 'travelers-tent',
      name: "Traveler's Tent",
      icon: `${curioPath}travelers_tent.png`,
      description: 'Someone has camped here recently.',
      interactions: [{ item: 'none', ...items.none, outcomes: [{ chance: 37.5, label: 'Gold, supplies or heirlooms', amount: 2, tone: 'positive' }, { chance: 37.5, label: 'Scouting', tone: 'positive' }, { chance: 12.5, label: 'Stress +25', tone: 'danger' }, { chance: 12.5, label: 'Nothing', tone: 'neutral' }] }]
    },
    {
      id: 'troubling-effigy',
      name: 'Troubling Effigy',
      icon: `${curioPath}troubling_effigy.png`,
      description: 'An unsettling effigy erected in service to a mysterious god.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 18.7, label: 'Positive quirk', tone: 'positive' }, { chance: 18.7, label: 'Negative quirk', tone: 'danger' }, { chance: 18.7, label: 'Bleed', tone: 'danger' }, { chance: 9.4, label: 'Blight', tone: 'danger' }, { chance: 9.4, label: 'Stress +15', tone: 'danger' }, { chance: 25, label: 'Nothing', tone: 'neutral' }] },
        { item: 'holyWaters', ...items.holyWater, outcomes: [{ label: 'Gain positive quirk', tone: 'positive' }] }
      ]
    }
  ],
  cove: [
    {
      id: 'barnacle-crusted-chest',
      name: 'Barnacle Crusted Chest',
      icon: `${curioPath}bernacle_crusted_chest.png`,
      description: 'A treasure chest blanketed in barnacles.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Gold, gems, heirlooms or supplies', amount: 2, tone: 'positive' }, { chance: 25, label: 'Bleed', tone: 'danger' }, { chance: 25, label: 'Nothing', tone: 'neutral' }] },
        { item: 'shovels', ...items.shovel, recommended: true, outcomes: [{ label: 'Any loot', amount: 3, tone: 'positive' }] }
      ]
    },
    {
      id: 'bas-relief',
      name: 'Bas-Relief',
      icon: `${curioPath}bas_relief.png`,
      description: 'A puzzlingly ancient sculpture of dizzying implication...',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 66.7, label: 'Positive quirk', tone: 'positive' }, { chance: 25, label: 'Negative quirk', tone: 'danger' }, { chance: 8.3, label: 'Random disease', tone: 'danger' }] },
        { item: 'shovels', ...items.shovel, outcomes: [{ label: 'Stress +100', tone: 'danger' }] }
      ]
    },
    {
      id: 'brackish-tidepool',
      name: 'Brackish Tidepool',
      icon: `${curioPath}brackish_tidepool.png`,
      description: 'A pool of water cupped in smooth stone. Its color looks slightly off...',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 75, label: 'Buff +33% Bleed/Blight/Disease/Debuff resist until camp', tone: 'positive' }, { chance: 25, label: 'Random disease', tone: 'danger' }] },
        { item: 'antivenoms', ...items.antivenom, recommended: true, outcomes: [{ label: 'Heal 5 stress, cure status effect, heal 5 HP', tone: 'positive' }] }
      ]
    },
    {
      id: 'eerie-coral',
      name: 'Eerie Coral',
      icon: `${curioPath}eerie_coral.png`,
      description: 'There is something odd about this coral.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Stress heal 10', tone: 'positive' }, { chance: 25, label: 'Stress +25', tone: 'danger' }, { chance: 25, label: 'Nothing', tone: 'neutral' }] },
        { item: 'herbs', ...items.medicinalHerb, recommended: true, outcomes: [{ label: 'Purge a negative quirk', tone: 'positive' }] }
      ]
    },
    {
      id: 'fish-idol',
      name: 'Fish Idol',
      icon: `${curioPath}fish_idol.png`,
      description: 'A strange presence is felt near this statue of worship.',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 50, label: 'Debuff -25% DMG, -10 ACC until camp', tone: 'danger' }, { chance: 50, label: 'Debuff -12 DODGE, Marked 3 rounds', tone: 'danger' }] },
        { item: 'holyWaters', ...items.holyWater, recommended: true, outcomes: [{ chance: 50, label: 'Buff +18% DMG until camp', tone: 'positive' }, { chance: 50, label: 'Buff +10% DMG, +5 ACC until camp', tone: 'positive' }] }
      ]
    },
    {
      id: 'giant-fish-carcass',
      name: 'Giant Fish Carcass',
      icon: `${curioPath}giant_fish_carcass.png`,
      description: 'A stuffed sea creature has washed ashore. Wonder what it ate...',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 16.7, label: 'Gold, gems or supplies', tone: 'positive' }, { chance: 16.7, label: 'The Red Plague disease', tone: 'danger' }, { chance: 11.1, label: 'Blight', tone: 'danger' }, { chance: 5.5, label: 'Bleed', tone: 'danger' }, { chance: 50, label: 'Nothing', tone: 'neutral' }] },
        { item: 'herbs', ...items.medicinalHerb, recommended: true, outcomes: [{ label: 'Any loot', amount: 3, tone: 'positive' }] }
      ]
    },
    {
      id: 'giant-oyster',
      name: 'Giant Oyster',
      icon: `${curioPath}giant_oyster.png`,
      description: 'A live oyster. Who knows what value it hides...',
      interactions: [
        { item: 'none', ...items.none, outcomes: [{ chance: 40, label: 'Gold or trinket', amount: 2, tone: 'positive' }, { chance: 40, label: 'Bleed', tone: 'danger' }, { chance: 20, label: 'Nothing', tone: 'neutral' }] },
        { item: 'shovels', ...items.shovel, recommended: true, outcomes: [{ label: 'Gold or trinket', amount: 3, tone: 'positive' }] },
        { item: 'dogTreats', ...items.dogTreats, outcomes: [{ label: 'Buff +25 DODGE', tone: 'positive' }] }
      ]
    },
    {
      id: 'ships-figurehead',
      name: "Ship's Figurehead",
      icon: `${curioPath}ships_figurehead.png`,
      description: 'The figurehead emits a marvelous aura.',
      interactions: [{ item: 'none', ...items.none, outcomes: [{ chance: 66.7, label: 'Buff +20% SPD until camp', tone: 'positive' }, { chance: 33.3, label: 'Stress heal 30', tone: 'positive' }] }]
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