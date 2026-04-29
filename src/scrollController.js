// Spring-based scroll controller — one slide at a time, no skipping.
// Replaces CSS scroll-snap with a JS-driven transform approach.

const WHEEL_THRESHOLD = 50;  // accumulated deltaY before advancing a slide
const TOUCH_THRESHOLD = 40;  // swipe distance (px) before advancing
const COOLDOWN_MS = 450;     // lock-out after a slide change (prevents multi-skip)
const SPRING_K = 180;        // stiffness  — higher = snappier
const SPRING_D = 22;         // damping    — lower = more bounce

export function createScrollController(totalSlides, onChange) {
  const layer = document.querySelector('.scroll-layer');

  let target = 0;
  let pos = 0;
  let vel = 0;
  let prevTime = performance.now();

  let accum = 0;
  let accumTimer = null;
  let cooldown = false;

  function goTo(index) {
    index = Math.max(0, Math.min(totalSlides - 1, index));
    if (index === target || cooldown) return;
    target = index;
    accum = 0;
    cooldown = true;
    setTimeout(() => { cooldown = false; }, COOLDOWN_MS);
    onChange(target);
  }

  // Instant reposition — used on resize to stay on the correct slide without spring.
  function snapTo(index) {
    index = Math.max(0, Math.min(totalSlides - 1, index));
    target = index;
    pos = index * window.innerHeight;
    vel = 0;
    layer.style.transform = `translateY(${-pos}px)`;
  }

  // --- Wheel ---
  function handleWheel(e) {
    e.preventDefault();
    if (cooldown) return;
    accum += e.deltaY;
    clearTimeout(accumTimer);
    if (accum > WHEEL_THRESHOLD) {
      goTo(target + 1);
    } else if (accum < -WHEEL_THRESHOLD) {
      goTo(target - 1);
    } else {
      // Light touch — clear accumulator after gesture ends; spring snaps back.
      accumTimer = setTimeout(() => { accum = 0; }, 250);
    }
  }

  // --- Touch ---
  let touchStartY = 0;
  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }
  function handleTouchEnd(e) {
    const delta = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(delta) > TOUCH_THRESHOLD) {
      goTo(target + Math.sign(delta));
    }
  }

  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchend', handleTouchEnd, { passive: true });

  // --- Spring tick ---
  function tick() {
    const now = performance.now();
    const dt = Math.min((now - prevTime) / 1000, 0.05);
    prevTime = now;

    const targetY = target * window.innerHeight;
    const force = (targetY - pos) * SPRING_K - vel * SPRING_D;
    vel += force * dt;
    pos += vel * dt;

    layer.style.transform = `translateY(${-pos}px)`;
    requestAnimationFrame(tick);
  }
  tick();

  return { goTo, snapTo };
}
