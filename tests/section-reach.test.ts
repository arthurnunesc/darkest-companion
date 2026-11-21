import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSectionReachTracker, isManualScrollKey, sectionIntroVisible } from '../src/lib/section-reach';

describe('planner section reach', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('counts each section once after one second and attributes only the jump target', () => {
    const visible = { curios: false, bosses: false };
    const record = vi.fn();
    const tracker = createSectionReachTracker((section) => visible[section], record);
    tracker.markShortcut('bosses');
    visible.curios = true;
    tracker.update();
    vi.advanceTimersByTime(350);
    visible.curios = false;
    visible.bosses = true;
    tracker.update();
    vi.advanceTimersByTime(999);
    expect(record).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(record.mock.calls).toEqual([['bosses', 'shortcut']]);

    visible.curios = true;
    tracker.update();
    vi.advanceTimersByTime(1000);
    tracker.update();
    vi.advanceTimersByTime(1000);
    expect(record.mock.calls).toEqual([['bosses', 'shortcut'], ['curios', 'scroll_or_direct']]);
  });

  it('ignores a shortcut with no exposure and drops attribution on manual interruption', () => {
    let visible = false;
    const record = vi.fn();
    const tracker = createSectionReachTracker((section) => section === 'bosses' && visible, record);
    tracker.markShortcut('bosses');
    tracker.update();
    vi.advanceTimersByTime(1000);
    expect(record).not.toHaveBeenCalled();

    visible = true;
    tracker.update();
    if (isManualScrollKey('PageDown', null)) tracker.cancelShortcut();
    vi.advanceTimersByTime(1000);
    expect(record.mock.calls).toEqual([['bosses', 'scroll_or_direct']]);
  });

  it('cancels pending exposures on route teardown', () => {
    const record = vi.fn();
    const tracker = createSectionReachTracker(() => true, record);
    tracker.update();
    tracker.destroy();
    vi.advanceTimersByTime(1000);
    expect(record).not.toHaveBeenCalled();
  });

  it('requires the intro to be visible without requiring the entire section to fit', () => {
    expect(sectionIntroVisible(300, 3000, 600)).toBe(true);
    expect(sectionIntroVisible(550, 3000, 600)).toBe(false);
    expect(sectionIntroVisible(-5, 3000, 600)).toBe(true);
    expect(sectionIntroVisible(-61, 3000, 600)).toBe(false);
  });
});
