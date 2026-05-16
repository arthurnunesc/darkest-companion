const WIKI_BASE = 'https://darkestdungeon.wiki.gg/wiki/';

const wikiPages = new Set([
  // Curios
  'Ancient Artifact',
  'Eldritch Altar',
  'Heirloom Chest',
  'Sack',
  "Shambler's Altar",
  'Altar of Light',
  'Bookshelf',
  'Confession Booth',
  'Decorative Urn',
  'Locked Display Cabinet',
  'Locked Sarcophagus',
  'Sarcophagus',
  'Suit of Armor',
  'Bone Altar',
  'Dinner Cart',
  'Pile of Bones',
  'Pile of Scrolls',
  'Ancient Coffin',
  'Beast Carcass',
  'Eerie Spiderweb',
  'Left Luggage',
  'Mummified Remains',
  'Old Tree',
  'Pristine Fountain',
  'Shallow Grave',
  "Traveler's Tent",
  'Troubling Effigy',
  'Brackish Tide Pool',
  'Fish Idol',
  'Stack of books',
  'Holy fountain',
  'Iron maiden',
  'Alchemy table',
  'Sacrificial stone',
  'Eerie coral',

  // Bosses
  'Necromancer',
  'Prophet',
  'Swine Prince',
  'Flesh',
  'Hag',
  'Brigand Pounder',
  'Siren',
  'Drowned Crew',

  // Heroes
  'Abomination',
  'Antiquarian',
  'Arbalest',
  'Bounty Hunter',
  'Crusader',
  'Flagellant',
  'Grave Robber',
  'Hellion',
  'Highwayman',
  'Houndmaster',
  'Jester',
  'Leper',
  'Man-at-Arms',
  'Musketeer',
  'Occultist',
  'Plague Doctor',
  'Shieldbreaker',
  'Vestal',

  // Enemy Types
  'Beast',
  'Eldritch',
  'Human',
  'Unholy',
]);

export function wikiPageExists(name: string): boolean {
  return wikiPages.has(name);
}

export function getWikiUrl(name: string): string | null {
  if (!wikiPageExists(name)) return null;
  const slug = name.replace(/ /g, '_');
  return `${WIKI_BASE}${encodeURIComponent(slug)}`;
}

export function getCurioWikiUrl(name: string): string {
  if (wikiPageExists(name)) {
    const slug = name.replace(/ /g, '_');
    return `${WIKI_BASE}${encodeURIComponent(slug)}`;
  }
  const anchor = name.replace(/ /g, '_');
  return `${WIKI_BASE}Curios#${encodeURIComponent(anchor)}`;
}
