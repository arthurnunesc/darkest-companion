import type { Hero, HeroId } from './types';

export const heroes: Hero[] = [
  { id: 'arbalest', name: 'Arbalest', image: '/icons/heroes/arbalest.png' },
  { id: 'musketeer', name: 'Musketeer', image: '/icons/heroes/musketeer.png' },
  { id: 'crusader', name: 'Crusader', image: '/icons/heroes/crusader.png' },
  { id: 'grave-robber', name: 'Grave Robber', image: '/icons/heroes/graverobber.png' },
  { id: 'hellion', name: 'Hellion', image: '/icons/heroes/hellion.png' },
  { id: 'highwayman', name: 'Highwayman', image: '/icons/heroes/highwayman.png' },
  { id: 'houndmaster', name: 'Houndmaster', image: '/icons/heroes/houndmaster.png' },
  { id: 'occultist', name: 'Occultist', image: '/icons/heroes/occultist.png' },
  { id: 'plague-doctor', name: 'Plague Doctor', image: '/icons/heroes/plaguedoctor.png' },
  { id: 'shieldbreaker', name: 'Shieldbreaker', image: '/icons/heroes/shieldbreaker.png' },
  { id: 'abomination', name: 'Abomination', image: '/icons/heroes/abomination.png' },
  { id: 'leper', name: 'Leper', image: '/icons/heroes/leper.png' },
  { id: 'man-at-arms', name: 'Man-at-Arms', image: '/icons/heroes/manatarms.png' },
  { id: 'bounty-hunter', name: 'Bounty Hunter', image: '/icons/heroes/bountyhunter.png' },
  { id: 'vestal', name: 'Vestal', image: '/icons/heroes/vestal.png' },
  { id: 'flagellant', name: 'Flagellant', image: '/icons/heroes/flagellant.png' },
  { id: 'jester', name: 'Jester', image: '/icons/heroes/jester.png' },
  { id: 'antiquarian', name: 'Antiquarian', image: '/icons/heroes/antiquarian.png' },
];

export function getHeroById(id: HeroId): Hero | undefined {
  return heroes.find((h) => h.id === id);
}

export function getHeroByName(name: string): Hero | undefined {
  return heroes.find((h) => h.name.toLowerCase() === name.toLowerCase());
}
