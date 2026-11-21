export type PlannerSection = 'curios' | 'bosses';
export type SectionArrival = 'shortcut' | 'scroll_or_direct';

const sections: PlannerSection[] = ['curios', 'bosses'];
const dwellMs = 1000;
const shortcutWindowMs = 2500;
const introHeight = 160;

export function sectionIntroVisible(top: number, bottom: number, viewportHeight: number) {
  const introBottom = Math.min(top + introHeight, bottom);
  const visible = Math.min(introBottom, viewportHeight) - Math.max(top, 0);
  return visible >= Math.min(100, viewportHeight / 2) && top >= 0 && viewportHeight > 0;
}

export function createSectionReachTracker(
  isVisible: (section: PlannerSection) => boolean,
  record: (section: PlannerSection, arrival: SectionArrival) => void
) {
  const seen = new Set<PlannerSection>();
  const timers = new Map<PlannerSection, ReturnType<typeof setTimeout>>();
  let shortcut: { section: PlannerSection; until: number } | undefined;

  function update() {
    for (const section of sections) {
      if (seen.has(section)) continue;
      if (!isVisible(section)) {
        clearTimeout(timers.get(section));
        timers.delete(section);
        continue;
      }
      if (timers.has(section)) continue;
      const matchingShortcut = shortcut?.section === section && Date.now() <= shortcut.until
        ? shortcut : undefined;
      timers.set(section, setTimeout(() => {
        timers.delete(section);
        if (!isVisible(section)) return;
        seen.add(section);
        record(section, matchingShortcut && shortcut === matchingShortcut ? 'shortcut' : 'scroll_or_direct');
      }, dwellMs));
    }
  }

  return {
    update,
    markShortcut(section: PlannerSection) {
      shortcut = { section, until: Date.now() + shortcutWindowMs };
    },
    cancelShortcut() { shortcut = undefined; },
    destroy() {
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
    }
  };
}
