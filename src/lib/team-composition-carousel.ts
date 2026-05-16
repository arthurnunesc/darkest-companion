export function getOffsetCycleTick(cycleTick: number, offset = 0) {
  return cycleTick + offset;
}

export function getChoiceIndex(cycleTick: number, choiceCount: number) {
  if (choiceCount <= 0) return 0;
  return ((cycleTick % choiceCount) + choiceCount) % choiceCount;
}

export function getResumeCycleOffset(cycleTick: number, frozenCycleTick: number) {
  return frozenCycleTick - cycleTick;
}
