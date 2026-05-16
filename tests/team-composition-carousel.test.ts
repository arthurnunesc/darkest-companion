import { describe, expect, it } from 'vitest';
import {
  getChoiceIndex,
  getOffsetCycleTick,
  getResumeCycleOffset
} from '../src/lib/team-composition-carousel';

describe('team composition carousel', () => {
  it('advances on the first tick after unhover even when the global tick wraps to the same choice', () => {
    const frozenCycleTick = 0;
    const releaseCycleTick = 2;
    const choiceCount = 3;
    const offset = getResumeCycleOffset(releaseCycleTick, frozenCycleTick);

    const nextVisibleTick = getOffsetCycleTick(releaseCycleTick + 1, offset);

    expect(getChoiceIndex(frozenCycleTick, choiceCount)).toBe(0);
    expect(getChoiceIndex(releaseCycleTick + 1, choiceCount)).toBe(0);
    expect(getChoiceIndex(nextVisibleTick, choiceCount)).toBe(1);
  });

  it('continues cycling from the paused choice after release', () => {
    const frozenCycleTick = 1;
    const releaseCycleTick = 3;
    const choiceCount = 3;
    const offset = getResumeCycleOffset(releaseCycleTick, frozenCycleTick);

    expect(getChoiceIndex(getOffsetCycleTick(releaseCycleTick + 1, offset), choiceCount)).toBe(2);
    expect(getChoiceIndex(getOffsetCycleTick(releaseCycleTick + 2, offset), choiceCount)).toBe(0);
  });
});
