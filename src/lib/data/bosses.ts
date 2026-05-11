import type { Boss, LocationId } from './types';

export const bosses: Boss[] = [
  // Ruins
  {
    id: 'necromancer',
    location: 'ruins',
    name: 'Necromancer',
    image: '/icons/bosses/necromancer.png',
    imageAlt: 'Necromancer boss sprite',
    enemyTypes: ['Unholy', 'Eldritch'],
    size: '1',
    turns: '1',
    variants: ['Necromancer Apprentice', 'Necromancer', 'Necromancer Lord'],
    winCondition: 'Kill him with back-rank damage before skeleton summons matter.',
    mechanics: [
      { title: 'Skeleton summoning', details: 'Summons a skeleton every action and moves backward 1 rank' },
      { title: 'Life-linked minions', details: 'Summoned enemies die automatically when the Necromancer dies' },
      { title: 'Random attacks', details: 'Has no weighted skill selection — attacks are effectively random' },
      { title: 'Resistances', details: 'High stun resistance (75%) but low bleed and blight resistance' }
    ],
    do: [
      { title: 'Focus the boss', details: 'Ignore most skeletons and pour all damage into the Necromancer' },
      { title: 'Back-rank reach', details: 'Bring heroes who can hit rank 4 (Arbalest, Highwayman, Hellion)' },
      { title: 'Use Blight', details: 'Low resistance makes it reliable damage against the boss' },
      { title: 'Mark and Riposte', details: 'Extra damage output through synergy skills' },
      { title: 'Pull forward', details: 'If needed, but he will keep moving back every turn' }
    ],
    avoid: [
      { title: 'Front-only teams', details: 'Slow teams that cannot hit rank 4 will struggle' },
      { title: 'Bleed reliance', details: 'Skeletons and Bone Defender resist bleed in the Ruins' },
      { title: 'Clearing skeletons', details: 'Wasting turns on adds instead of damaging the boss' }
    ],
    recommendedHeroes: [
      'Arbalest', 'Musketeer', 'Crusader', 'Grave Robber', 'Hellion',
      'Highwayman', 'Houndmaster', 'Occultist', 'Plague Doctor', 'Shieldbreaker'
    ],
    notes: [
      'On higher difficulties, Bone Soldiers have Stealth for 2 rounds',
      'Bone Defenders may Guard him — use Stun or Shieldbreaker Puncture to break Guard'
    ]
  },
  {
    id: 'prophet',
    location: 'ruins',
    name: 'Prophet',
    image: '/icons/bosses/prophet.png',
    imageAlt: 'Prophet boss sprite',
    enemyTypes: ['Unholy'],
    size: '1',
    turns: '1 + 2 free actions',
    variants: ['Sonorous Prophet', 'Fulminating Prophet', 'Gibbering Prophet'],
    winCondition: 'Survive Rubble of Ruin while dealing damage to rank 4; optional: destroy pews for extra gold.',
    mechanics: [
      { title: 'Pew blockade', details: 'Starts in rank 4 behind 3 wooden pews occupying ranks 1-3' },
      { title: 'Prognostication', details: 'Free action at round start marks 1-2 ranks' },
      { title: 'Rubble of Ruin', details: 'Free action at round end hits marked ranks for extreme damage' },
      { title: 'Secondary attacks', details: 'Can inflict Blight with Fulminate and Stun with Eye on You' }
    ],
    do: [
      { title: 'Bring Holy Water and Antivenom', details: 'Mitigate Blight from Fulminate' },
      { title: 'Guard and PROT', details: 'Reduce Rubble of Ruin damage with defensive skills' },
      { title: 'Stack debuffs', details: 'Leper Intimidate and Occultist Weakening Curse neuter his damage' },
      { title: 'Destroy pews', details: 'Up to 7500 gold in Consecrated Pews loot' },
      { title: 'Back-rank damage', details: 'Hit him through the pews with reach skills' }
    ],
    avoid: [
      { title: 'Death\'s Door heroes', details: 'Rubble + Blight or Stun will finish them immediately' },
      { title: 'No stun redundancy', details: 'Eye on You can disable multiple heroes per turn' },
      { title: 'Ignoring positioning', details: 'He never moves from rank 4' }
    ],
    recommendedHeroes: [
      'Abomination', 'Arbalest', 'Crusader', 'Hellion', 'Houndmaster',
      'Leper', 'Man-at-Arms', 'Occultist', 'Shieldbreaker'
    ],
    notes: [
      'Dodge-based strategies work well due to his low speed',
      'Shieldbreaker Aegis Scales can negate a single Rubble of Ruin hit'
    ]
  },

  // Warrens
  {
    id: 'swine-prince',
    location: 'warrens',
    name: 'Swine Prince',
    image: '/icons/bosses/swine-prince.png',
    imageAlt: 'Swine Prince boss sprite',
    enemyTypes: ['Beast'],
    size: '3 (Gigantic)',
    turns: '1 + Wilbur actions',
    variants: ['Swine Prince', 'Swine King', 'Swine God'],
    winCondition: 'Kill the Prince first; leave Wilbur alive until the Prince dies.',
    mechanics: [
      { title: 'Dual target', details: 'Prince occupies ranks 1-3; Wilbur occupies rank 4' },
      { title: 'Wilbur marks', details: 'End This One / End These Two mark heroes for the Prince' },
      { title: 'Obliterate', details: 'Prince hits marked heroes for massive bonus damage' },
      { title: 'Enraged Destruction', details: 'Direct non-DoT damage to Wilbur triggers party-wide heavy damage + stun' }
    ],
    do: [
      { title: 'Focus the Prince', details: 'Completely ignore Wilbur until the Prince dies' },
      { title: 'Protect marked heroes', details: 'Use Guard or clear Marks to reduce Obliterate damage' },
      { title: 'Beast damage', details: 'Bring Houndmaster or other Beast bonus sources' },
      { title: 'Stun resist', details: 'Use trinkets on Veteran/Champion to survive Wilbur stuns' },
      { title: 'Kill Wilbur last', details: 'Only after the Prince is dead' }
    ],
    avoid: [
      { title: 'Hit Wilbur', details: 'Any direct non-DoT damage triggers Enraged Destruction' },
      { title: 'AoE skills', details: 'Damaging AoE skills that clip Wilbur will trigger retaliation' },
      { title: 'Kill Wilbur first', details: 'Prince uses Enraged Destruction every round without Wilbur' }
    ],
    recommendedHeroes: [
      'Arbalest', 'Musketeer', 'Bounty Hunter', 'Houndmaster',
      'Occultist', 'Vestal', 'Man-at-Arms'
    ],
    notes: [
      'Quest completes on Prince death — retreat without killing Wilbur is valid',
      'On Veteran+, Wilbur stuns with Bit o\' Squeal as a free action each round'
    ]
  },
  {
    id: 'flesh',
    location: 'warrens',
    name: 'Flesh',
    image: '/icons/bosses/flesh.png',
    imageAlt: 'Flesh boss sprite',
    enemyTypes: ['Eldritch'],
    classification: 'Shifting Forms',
    size: 'Multiple 1s',
    turns: '1 per part',
    variants: ['Inchoate Flesh', 'Unstable Flesh', 'Formless Flesh'],
    winCondition: 'Deal damage to any exposed body part; shared HP pool means all damage counts.',
    mechanics: [
      { title: 'Shared HP pool', details: 'Four body parts (Head, Bone, Heart, Butt) share a single HP pool' },
      { title: 'Form rotation', details: 'Parts morph at the start of every turn — some are exposed, some are not' },
      { title: 'Variable PROT', details: 'Head, Bone, and Butt have PROT; only Heart has 0 PROT' },
      { title: 'DoT amplification', details: 'Bleed and Blight tick on each part/action, making them extremely effective' }
    ],
    do: [
      { title: 'Use Bleed and Blight', details: 'They tick multiple times per round across all parts' },
      { title: 'Focus exposed parts', details: 'Attack whichever part is currently exposed' },
      { title: 'Any-rank heroes', details: 'Bring heroes who can hit any rank reliably' },
      { title: 'PROT ignore', details: 'Use debuffs or piercing when Head/Bone are exposed' }
    ],
    avoid: [
      { title: 'Moving parts', details: 'They are immobile — do not waste turns repositioning' },
      { title: 'Pure direct damage', details: 'DoTs are the most efficient strategy here' },
      { title: 'Tunnel one part', details: 'Overcommitting to a high-PROT part is inefficient' }
    ],
    recommendedHeroes: [
      'Houndmaster', 'Flagellant', 'Plague Doctor', 'Shieldbreaker', 'Hellion', 'Jester'
    ],
    notes: [
      'Heart part has 0 PROT and low stun resist — prioritize when exposed',
      'Each part has its own speed, so turn order varies by form'
    ]
  },

  // Weald
  {
    id: 'hag',
    location: 'weald',
    name: 'Hag',
    image: '/icons/bosses/hag.png',
    imageAlt: 'Hag boss sprite',
    enemyTypes: ['Human'],
    size: '2 (Large)',
    turns: '2',
    variants: ['Wizened Hag', 'Hag', 'Hag Witch'],
    winCondition: 'Deal back-rank damage while managing the cauldron; kill her before pot deaths spiral.',
    mechanics: [
      { title: 'Fixed positions', details: 'Sits in ranks 3-4 and cannot be moved; pot occupies ranks 1-2' },
      { title: 'Into the Pot!', details: 'Traps a hero in the cauldron on turn 1' },
      { title: 'Pot damage', details: 'Trapped hero takes 8.75% max HP per action from both sides' },
      { title: 'Auto-release', details: 'Pot releases hero at 0 HP (Death\'s Door); Hag throws someone else in on her next move' },
      { title: 'Meat Tenderizer', details: 'Hits the entire party for minor damage' },
    ],
    do: [
      { title: 'Focus the Hag', details: 'Do not tunnel the pot — if she dies, the fight ends' },
      { title: 'Back-rank reach', details: 'Bring heroes who can hit ranks 3-4 from any position' },
      { title: 'Multiple healers', details: 'Save heroes exiting the pot at Death\'s Door immediately' },
      { title: 'Aegis Scales', details: 'Blocks first hit after exiting pot — activate before entering' },
      { title: 'Prepare for movement', details: 'Everyone will move forward at least one slot' }
    ],
    avoid: [
      { title: 'Tunnel the pot', details: 'It respawns immediately — wasted DPS' },
      { title: 'Front-only teams', details: 'Leper and similar heroes cannot reach rank 4' },
      { title: 'Pot death', details: 'Hero dying in the pot counts as death and does not retreat' },
      { title: 'Death\'s Door party', details: 'Meat Tenderizer will finish the entire party' }
    ],
    recommendedHeroes: [
      'Abomination', 'Arbalest', 'Musketeer', 'Grave Robber', 'Hellion',
      'Highwayman', 'Houndmaster', 'Occultist', 'Shieldbreaker'
    ],
    notes: [
      'Grave Robber can use Shadow Fade on turn 1 to avoid being put in the pot',
      'Crusader can heal from any position — excellent for saving potted heroes',
      'If only 1 hero remains alive and another is in the pot, you lose the battle'
    ]
  },
  {
    id: 'brigand-pounder',
    location: 'weald',
    name: 'Brigand Pounder',
    image: '/icons/bosses/brigand-pounder.png',
    imageAlt: 'Brigand Pounder boss sprite',
    enemyTypes: ['Ironwork'],
    classification: 'Ironwork',
    size: '1',
    turns: 'No normal turns; start/end-round auto-actions',
    variants: ['Brigand 8 Pounder', 'Brigand 12 Pounder', 'Brigand 16 Pounder'],
    winCondition: 'Kill the Matchman every round before he lights the fuse; then damage the cannon.',
    mechanics: [
      { title: 'Extreme resistances', details: 'Cannon has 20-25% PROT and is immune to stun/blight/bleed/debuff, with very high move resist' },
      { title: 'Matchman spawn', details: 'Appears every round; if alive at round end, cannon fires for massive damage' },
      { title: 'Fragile Matchman', details: 'Very slow but fragile (8-20 HP depending on difficulty)' },
      { title: 'Reinforcements', details: 'Cannon summons adds if enemy party is not full' }
    ],
    do: [
      { title: 'Kill the Matchman', details: 'Top priority every single round before he acts' },
      { title: 'Accuracy trinkets', details: 'Matchman has moderate dodge — boost accuracy' },
      { title: 'Mark or pierce', details: 'Use Mark synergy for extra damage or PROT-piercing skills on the cannon' },
      { title: 'Control adds', details: 'Stun reinforcements while focusing the Matchman' },
      { title: 'Accuracy and efficiency', details: 'Boost ACC and spend as few actions as possible killing or stunning the Matchman' }
    ],
    avoid: [
      { title: 'Ignore the Matchman', details: 'Cannon fire will wipe your party quickly' },
      { title: 'DoTs on cannon', details: 'It is immune to Bleed and Blight' },
      { title: 'Stun the cannon', details: '200%+ stun resistance — completely wasted' },
      { title: 'Inefficient Matchman control', details: 'Missing or spending too many actions on the Matchman lets the cannon outpace you' }
    ],
    recommendedHeroes: [
      'Hellion', 'Bounty Hunter', 'Houndmaster', 'Arbalest', 'Musketeer', 'Shieldbreaker', 'Highwayman'
    ],
    notes: [
      'Matchman speed is -20 to -18 depending on difficulty — very slow, so most heroes outspeed him',
      'Cannon has low dodge — once PROT is handled, direct damage is reliable'
    ]
  },

  // Cove
  {
    id: 'siren',
    location: 'cove',
    name: 'Siren',
    image: '/icons/bosses/siren.png',
    imageAlt: 'Siren boss sprite',
    enemyTypes: ['Eldritch'],
    size: '2 (Large)',
    turns: '2',
    variants: ['Siren', 'Alluring Siren', 'Beguiling Siren'],
    winCondition: 'Kill her quickly with 3 heroes while managing charm and positioning.',
    mechanics: [
      { title: 'Song of Desire', details: 'Charms one hero for 2 full turns (70% fixed chance)' },
      { title: 'Charmed movement', details: 'Hero moves next to the Siren, uses equipped skills, and returns to rank 4 when released' },
      { title: 'Guaranteed charm', details: 'First turn of each round uses Song of Desire if conditions are met' },
      { title: 'Secondary turns', details: 'Uses Pressure Crash, Devour, or High Tide (summons Pelagics)' }
    ],
    do: [
      { title: 'Safe charmed heroes', details: 'Bring heroes who are not devastating when charmed' },
      { title: 'Holy Water', details: 'Raise debuff resist to influence targeting; charm still has 70% fixed success chance' },
      { title: 'Crit to break charm', details: 'Landing a crit on a charmed hero breaks charm early' },
      { title: 'Guard key heroes', details: 'Houndmaster or Man-at-Arms can prevent charm on specific heroes' },
      { title: 'Stun summons', details: 'Maintain action economy by stunning Pelagic reinforcements' },
      { title: 'Single-target focus', details: 'She has 0 PROT — raw damage hits hard' }
    ],
    avoid: [
      { title: 'Dangerous charmed heroes', details: 'Avoid heroes or equipped skills that are dangerous when charmed; Leper can devastate allies, while Flagellant can heal and reset the Siren' },
      { title: 'AoE skills', details: 'Can hit your own charmed heroes' },
      { title: 'Overbuff one hero', details: 'They might get charmed and use buffs against you' },
      { title: 'Uncontrolled summons', details: 'Letting High Tide bring reinforcements unchecked' }
    ],
    recommendedHeroes: [
      'Antiquarian', 'Occultist', 'Arbalest', 'Musketeer', 'Houndmaster', 'Plague Doctor', 'Man-at-Arms'
    ],
    notes: [
      'Siren targets hero with lowest debuff resistance — manipulate with Holy Water',
      'Antiquarian is ideal bait: low debuff resist, poor combat ability, not dangerous when charmed',
      'If you flee while a hero is charmed, that hero is lost'
    ]
  },
  {
    id: 'drowned-crew',
    location: 'cove',
    name: 'Drowned Crew',
    image: '/icons/bosses/drowned-crew.png',
    imageAlt: 'Drowned Crew boss sprite',
    enemyTypes: ['Unholy'],
    size: '3 (Gigantic)',
    turns: '2 + free action',
    variants: ['Sodden Crew', 'Sunken Crew', 'Drowned Crew'],
    winCondition: 'Kill the Anchorman quickly to break anchor, then burn down the Crew.',
    mechanics: [
      { title: 'All Hands on Deck!', details: 'Free action each round pulls hero to rank 1 and summons Drowned Anchorman' },
      { title: 'Heave to!', details: 'Anchorman anchors rank 1 hero — immobilized and cannot move' },
      { title: 'Anchor healing', details: 'Every action heals Crew 2.5-3.5% max HP and deals 6 stress to anchored hero' },
      { title: 'Anchorman buffs', details: '+50% PROT and resist buffs that transfer to the Crew on successful anchor' }
    ],
    do: [
      { title: 'Kill the Anchorman', details: 'Top priority to break anchor and stop the healing' },
      { title: 'Pre-anchor DoTs', details: 'Apply Bleed or Blight BEFORE Heave to! — they still tick while he is inactive' },
      { title: 'Blight the Crew', details: 'Low blight resistance helps damage stick while anchor healing is active' },
      { title: 'Stress management', details: 'Bring stress healing or high stress resist for the anchored hero' },
      { title: 'Guard rank 1', details: 'Protect the anchored hero from Crew attacks' }
    ],
    avoid: [
      { title: 'Long anchors', details: 'Letting the anchor last multiple rounds heals the Crew too much' },
      { title: 'Direct damage only', details: 'Pure direct damage on Crew while anchor is active is inefficient' },
      { title: 'Retreat while anchored', details: 'Anchored hero dies and does not retreat with the party' },
      { title: 'Moving anchored hero', details: 'They are immobilized — cannot be moved by any skill' }
    ],
    recommendedHeroes: [
      'Plague Doctor', 'Shieldbreaker', 'Occultist', 'Houndmaster', 'Man-at-Arms'
    ],
    notes: [
      'Virtuous heroes refuse to be anchored and instead stress-heal the party',
      'Anchorman is fully healed when he successfully anchors — but DoT damage applied before anchoring still kills him',
      'Crew has three actions per round (free + 2 turns) — action economy matters'
    ]
  }
];

export function getBossesForLocation(location: LocationId) {
  return bosses.filter((boss) => boss.location === location);
}
