import { describe, expect, it } from 'vitest';
import { bosses, getBossesForLocation } from '../src/lib/data/bosses';
import { locations } from '../src/lib/data/locations';

describe('bosses', () => {
  it('has boss notes for every location', () => {
    for (const location of locations) {
      expect(getBossesForLocation(location.id).length).toBeGreaterThan(0);
    }
  });

  it('has required tactical fields for every boss', () => {
    for (const boss of bosses) {
      expect(boss.id).toBeTruthy();
      expect(boss.name).toBeTruthy();
      expect(boss.image).toMatch(/^\/icons\/bosses\//);
      expect(boss.imageAlt).toBeTruthy();
      expect(boss.winCondition).toBeTruthy();
      expect(boss.mechanics.length).toBeGreaterThan(0);
      expect(boss.do.length).toBeGreaterThan(0);
      expect(boss.avoid.length).toBeGreaterThan(0);
      expect(boss.recommendedHeroes.length).toBeGreaterThan(0);

      for (const entry of [...boss.mechanics, ...boss.do, ...boss.avoid]) {
        expect(entry.title).toBeTruthy();
        expect(entry.details).toBeTruthy();
      }
    }
  });

  it('only references known locations', () => {
    const locationIds = new Set(locations.map((location) => location.id));

    for (const boss of bosses) {
      expect(locationIds.has(boss.location)).toBe(true);
    }
  });

  it('has unique boss ids', () => {
    const ids = bosses.map((boss) => boss.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps key boss assignments', () => {
    expect(getBossesForLocation('ruins').some((boss) => boss.id === 'necromancer')).toBe(true);
    expect(getBossesForLocation('ruins').some((boss) => boss.id === 'prophet')).toBe(true);
    expect(getBossesForLocation('warrens').some((boss) => boss.id === 'swine-prince')).toBe(true);
    expect(getBossesForLocation('warrens').some((boss) => boss.id === 'flesh')).toBe(true);
    expect(getBossesForLocation('weald').some((boss) => boss.id === 'hag')).toBe(true);
    expect(getBossesForLocation('weald').some((boss) => boss.id === 'brigand-pounder')).toBe(true);
    expect(getBossesForLocation('cove').some((boss) => boss.id === 'siren')).toBe(true);
    expect(getBossesForLocation('cove').some((boss) => boss.id === 'drowned-crew')).toBe(true);
  });

  it('has exactly two bosses per base location', () => {
    for (const location of locations) {
      expect(getBossesForLocation(location.id).length).toBe(2);
    }
  });

  it('has correct Flesh PROT: only Heart has 0 PROT', () => {
    const flesh = bosses.find((boss) => boss.id === 'flesh')!;
    const protMech = flesh.mechanics.find((m) => m.title === 'Variable PROT')!;

    expect(protMech.details).toContain('only Heart has 0 PROT');
    expect(protMech.details).not.toContain('Butt have none');
  });

  it('describes Brigand Matchman as slow, not fast', () => {
    const pounder = bosses.find((boss) => boss.id === 'brigand-pounder')!;
    const matchmanMech = pounder.mechanics.find((m) => m.title === 'Fragile Matchman')!;

    expect(matchmanMech.details).toMatch(/\bvery slow\b/i);
    expect(matchmanMech.details).not.toMatch(/\bvery fast\b/i);
  });

  it('explains Siren Holy Water targets debuff resist, does not claim it reduces charm', () => {
    const siren = bosses.find((boss) => boss.id === 'siren')!;
    const holyWater = siren.do.find((d) => d.title === 'Holy Water')!;

    expect(holyWater.details).toContain('70% fixed');
    expect(holyWater.details).not.toContain('reduce charm');
  });

  it('notes Drowned Crew Anchorman buffs transfer to Crew', () => {
    const crew = bosses.find((boss) => boss.id === 'drowned-crew')!;
    const buffs = crew.mechanics.find((m) => m.title === 'Anchorman buffs')!;

    expect(buffs.details).toContain('transfer to the Crew');
    expect(buffs.details).not.toContain('until');
  });

  it('uses exact wiki variant names', () => {
    expect(bosses.find((boss) => boss.id === 'necromancer')!.variants).toEqual([
      'Necromancer Apprentice',
      'Necromancer',
      'Necromancer Lord'
    ]);

    expect(bosses.find((boss) => boss.id === 'prophet')!.variants).toEqual([
      'Sonorous Prophet',
      'Fulminating Prophet',
      'Gibbering Prophet'
    ]);

    expect(bosses.find((boss) => boss.id === 'swine-prince')!.variants).toEqual([
      'Swine Prince',
      'Swine King',
      'Swine God'
    ]);

    expect(bosses.find((boss) => boss.id === 'flesh')!.variants).toEqual([
      'Inchoate Flesh',
      'Unstable Flesh',
      'Formless Flesh'
    ]);

    expect(bosses.find((boss) => boss.id === 'hag')!.variants).toEqual([
      'Wizened Hag',
      'Hag',
      'Hag Witch'
    ]);

    expect(bosses.find((boss) => boss.id === 'brigand-pounder')!.variants).toEqual([
      'Brigand 8 Pounder',
      'Brigand 12 Pounder',
      'Brigand 16 Pounder'
    ]);

    expect(bosses.find((boss) => boss.id === 'siren')!.variants).toEqual([
      'Siren',
      'Alluring Siren',
      'Beguiling Siren'
    ]);

    expect(bosses.find((boss) => boss.id === 'drowned-crew')!.variants).toEqual([
      'Sodden Crew',
      'Sunken Crew',
      'Drowned Crew'
    ]);
  });

  it('does not claim Pounder is immune to move', () => {
    const pounder = bosses.find((boss) => boss.id === 'brigand-pounder')!;
    const resist = pounder.mechanics.find((m) => m.title === 'Extreme resistances')!;

    expect(resist.details).not.toContain('/move');
    expect(resist.details).toContain('very high move resist');
  });

  it('describes Prophet Rubble follow-up as Blight or Stun, not Bleed', () => {
    const prophet = bosses.find((boss) => boss.id === 'prophet')!;
    const deathDoor = prophet.avoid.find((entry) => entry.title === 'Death\'s Door heroes')!;

    expect(deathDoor.details).toContain('Blight or Stun');
    expect(deathDoor.details).not.toContain('Bleed');
  });

  it('describes Flesh morph timing as every turn', () => {
    const flesh = bosses.find((boss) => boss.id === 'flesh')!;
    const formRotation = flesh.mechanics.find((entry) => entry.title === 'Form rotation')!;

    expect(formRotation.details).toContain('start of every turn');
    expect(formRotation.details).not.toContain('each round');
  });

  it('specifies Wilbur retaliation is triggered by direct non-DoT damage', () => {
    const swine = bosses.find((boss) => boss.id === 'swine-prince')!;
    const retaliation = swine.mechanics.find((entry) => entry.title === 'Enraged Destruction')!;
    const hitWilbur = swine.avoid.find((entry) => entry.title === 'Hit Wilbur')!;

    expect(retaliation.details).toMatch(/direct non-DoT damage/i);
    expect(hitWilbur.details).toMatch(/direct non-DoT damage/i);
  });

  it('does not claim Hag Meat Tenderizer causes stress', () => {
    const hag = bosses.find((boss) => boss.id === 'hag')!;
    const meatTenderizer = hag.mechanics.find((entry) => entry.title === 'Meat Tenderizer')!;

    expect(meatTenderizer.details).not.toMatch(/stress/i);
    expect(meatTenderizer.details).toMatch(/damage/i);
  });

  it('describes Hag pot rethrow timing as next move, not immediate', () => {
    const hag = bosses.find((boss) => boss.id === 'hag')!;
    const autoRelease = hag.mechanics.find((entry) => entry.title === 'Auto-release')!;

    expect(autoRelease.details).toMatch(/next move/i);
    expect(autoRelease.details).not.toMatch(/immediately throws/i);
  });

  it('does not describe Marks as Pounder PROT debuffs', () => {
    const pounder = bosses.find((boss) => boss.id === 'brigand-pounder')!;
    const markOrPierce = pounder.do.find((entry) => entry.title === 'Mark or pierce')!;

    expect(markOrPierce.details).toContain('Mark synergy');
    expect(markOrPierce.details).toContain('PROT-piercing');
    expect(markOrPierce.title).not.toContain('PROT debuffs');
  });

  it('focuses Pounder Matchman advice on accuracy and action efficiency, not speed', () => {
    const pounder = bosses.find((boss) => boss.id === 'brigand-pounder')!;
    const accuracy = pounder.do.find((entry) => entry.title === 'Accuracy and efficiency')!;
    const inefficient = pounder.avoid.find((entry) => entry.title === 'Inefficient Matchman control')!;

    expect(accuracy.details).toMatch(/ACC/i);
    expect(accuracy.details).toMatch(/actions/i);
    expect(inefficient.details).toMatch(/Missing|actions/i);
    expect(pounder.do.some((entry) => entry.title === 'Speed buffs')).toBe(false);
    expect(pounder.avoid.some((entry) => entry.title === 'Slow teams')).toBe(false);
  });

  it('uses wiki enemy class for Brigand Pounder', () => {
    const pounder = bosses.find((boss) => boss.id === 'brigand-pounder')!;

    expect(pounder.enemyTypes).toEqual(['Ironwork']);
    expect(pounder.enemyTypes).not.toContain('Human');
  });

  it('does not claim Pounder has no dodge', () => {
    const pounder = bosses.find((boss) => boss.id === 'brigand-pounder')!;

    expect(pounder.notes).toContain('Cannon has low dodge — once PROT is handled, direct damage is reliable');
    expect(pounder.notes).not.toContain('Cannon has no dodge — once PROT is handled, direct damage is reliable');
  });

  it('does not recommend Vestal for Drowned Crew', () => {
    const crew = bosses.find((boss) => boss.id === 'drowned-crew')!;

    expect(crew.recommendedHeroes).not.toContain('Vestal');
  });

  it('uses wiki-aligned Siren warning for Flagellant', () => {
    const siren = bosses.find((boss) => boss.id === 'siren')!;
    const dangerous = siren.avoid.find((entry) => entry.title === 'Dangerous charmed heroes')!;

    expect(dangerous.details).toContain('Leper');
    expect(dangerous.details).toContain('Flagellant');
    expect(dangerous.details).toMatch(/heal|reset/i);
    expect(dangerous.details).not.toContain('Leper or Flagellant who can devastate allies');
  });

  it('keeps Necromancer blight advice tied to resistance, not turn frequency', () => {
    const necromancer = bosses.find((boss) => boss.id === 'necromancer')!;
    const blight = necromancer.do.find((entry) => entry.title === 'Use Blight')!;

    expect(blight.details).toContain('Low resistance');
    expect(blight.details).not.toMatch(/infrequent actions/i);
  });

  it('does not describe movement as Swine Prince mark safety', () => {
    const swine = bosses.find((boss) => boss.id === 'swine-prince')!;
    const marked = swine.do.find((entry) => entry.title === 'Protect marked heroes')!;

    expect(marked.details).toMatch(/Guard|clear Marks/i);
    expect(marked.details).not.toMatch(/move .*safety/i);
  });

  it('describes Pounder turns as auto-actions, not normal free turns', () => {
    const pounder = bosses.find((boss) => boss.id === 'brigand-pounder')!;

    expect(pounder.turns).toContain('No normal turns');
    expect(pounder.turns).toContain('auto-actions');
    expect(pounder.turns).not.toContain('2 free actions');
  });

  it('describes Siren charm placement and release rank', () => {
    const siren = bosses.find((boss) => boss.id === 'siren')!;
    const movement = siren.mechanics.find((entry) => entry.title === 'Charmed movement')!;

    expect(movement.details).toContain('next to the Siren');
    expect(movement.details).toContain('rank 4');
    expect(movement.details).not.toContain('random rank');
  });

  it('does not claim Drowned Crew blight bypasses anchor healing', () => {
    const crew = bosses.find((boss) => boss.id === 'drowned-crew')!;
    const blight = crew.do.find((entry) => entry.title === 'Blight the Crew')!;

    expect(blight.details).toContain('Low blight resistance');
    expect(blight.details).toContain('anchor healing is active');
    expect(blight.details).not.toContain('bypasses the anchor healing');
  });
});
