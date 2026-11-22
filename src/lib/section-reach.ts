export type PlannerSection = 'curios' | 'bosses';
export type SectionArrival = 'shortcut' | 'scroll_or_direct';

const sections: PlannerSection[] = ['curios', 'bosses'];
const dwellMs = 1000;
const shortcutWindowMs = 2500;
const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

export function sectionPanelVisible(top: number, bottom: number, viewportHeight: number) {
  const visible = Math.min(bottom, viewportHeight) - Math.max(top, 0);
  return viewportHeight > 0 && visible >= Math.min(100, viewportHeight / 2);
}

export function isManualScrollKey(key: string, target: EventTarget | null) {
  if (!scrollKeys.has(key)) return false;
  if (!target || !(target instanceof HTMLElement)) return true;
  if (target.isContentEditable || target.closest('input, textarea, select')) return false;
  return key !== ' ' || !target.closest('button, [role="button"], summary');
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
      const arrival = shortcut?.section === section && Date.now() <= shortcut.until
        ? 'shortcut' : 'scroll_or_direct';
      timers.set(section, setTimeout(() => {
        timers.delete(section);
        if (!isVisible(section)) return;
        seen.add(section);
        record(section, arrival);
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
