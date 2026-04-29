export let activeIndex = 0;
export let previousIndex = 0;
export let transitionTime = -Infinity;
export let isTransitioning = false;
export const TRANSITION_DURATION = 600;

const subscribers = [];

export function setScene(index) {
  if (index === activeIndex) return;
  previousIndex = activeIndex;
  activeIndex = index;
  transitionTime = performance.now();
  isTransitioning = true;
  subscribers.forEach(fn => fn(activeIndex, previousIndex));
  setTimeout(() => { isTransitioning = false; }, TRANSITION_DURATION);
}

export function onTransition(fn) {
  subscribers.push(fn);
}
