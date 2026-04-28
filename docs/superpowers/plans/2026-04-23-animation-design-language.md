# Animation & Design Language Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify design language and implement frame-rate-independent animations — tag drop-settle, canvas label texture, staggered panel fade — using a new shared `animState.js` transition module.

**Architecture:** A new `animState.js` module owns all scene-transition state and a subscriber list; `main.js`, `uiPanel.js`, and `model.js` read from it. Tag entry is parametric (easeOutBack over a 600ms window) rather than per-frame lerp. Panel text fades line-by-line via CSS class toggling driven by the transition subscriber.

**Tech Stack:** Three.js 0.165.0 (CDN), GLTFLoader (CDN), vanilla ES modules, CSS transitions

> **Note:** This is a browser-only vanilla JS project with no test runner. Each task ends with a browser verification step instead of an automated test.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `animState.js` | Create | Scene transition state, timing, subscriber pattern |
| `scrollScenes.js` | Modify | Add `tagLabel` placeholder per scene |
| `styles.css` | Modify | Add `is-leaving` / `is-entering` stagger classes |
| `model.js` | Modify | `loadTagGLB()` replaces placeholder; `updateTagTexture()` draws canvas label |
| `uiPanel.js` | Modify | Stagger fade driven by `update()` / `updateInstant()` |
| `main.js` | Modify | dt-lerp, async GLB init, animState wiring, drop-settle |
| `highlights.js` | No change | — |

---

## Task 1: Add `tagLabel` to `scrollScenes.js`

**Files:**
- Modify: `scrollScenes.js`

- [ ] **Step 1: Add `tagLabel` field to every scene object in both `desktopScenes` and `mobileScenes`**

Open `scrollScenes.js`. Add `tagLabel: "— placeholder —"` to each of the 5 objects in `desktopScenes` and the 5 in `mobileScenes` (10 additions total). Example for slide-1 in both arrays:

```js
{
  id: "slide-1",
  label: "slide 1",
  cubeTargetPosition: { x: 0, y: 0, z: 0 },
  tagTargetPosition: { x: -3.8, y: -0.2, z: -0.6 },
  tagVisible: false,
  titleText: "Making Waste Visible",
  bodyText: "A large placeholder cube anchors the opening frame. Replace it later with a garment or another hero object.",
  tagSide: "left",
  tagLabel: "— placeholder —",
},
```

Apply the same `tagLabel: "— placeholder —"` addition to all remaining 9 scene objects.

- [ ] **Step 2: Verify in browser console**

Open the site in a browser (`open index.html` or a local server). In the console run:

```js
import('./scrollScenes.js').then(m => console.log(m.getScenes(false)[0].tagLabel))
```

Expected output: `— placeholder —`

- [ ] **Step 3: Commit**

```bash
git add scrollScenes.js
git commit -m "feat: add tagLabel placeholder field to all scenes"
```

---

## Task 2: Create `animState.js`

**Files:**
- Create: `animState.js`

- [ ] **Step 1: Create the file**

```js
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
```

- [ ] **Step 2: Verify in browser console**

```js
import('./animState.js').then(m => {
  m.onTransition((next, prev) => console.log('transition', prev, '->', next));
  m.setScene(2);
  console.log('activeIndex:', m.activeIndex); // 2
  m.setScene(2); // should be ignored
  console.log('activeIndex still:', m.activeIndex); // still 2
});
```

Expected: logs `transition 0 -> 2`, `activeIndex: 2`, `activeIndex still: 2` (no second transition log).

- [ ] **Step 3: Commit**

```bash
git add animState.js
git commit -m "feat: add animState transition state module"
```

---

## Task 3: Update `styles.css` — stagger classes

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Add transition properties and stagger classes**

Append to the end of `styles.css`:

```css
.info-panel__eyebrow,
.info-panel__title,
.info-panel__body {
  transition: opacity 200ms ease, transform 200ms ease;
}

.info-panel__eyebrow.is-leaving,
.info-panel__title.is-leaving,
.info-panel__body.is-leaving {
  opacity: 0;
  transform: translateY(-6px);
}

.info-panel__eyebrow.is-entering,
.info-panel__title.is-entering,
.info-panel__body.is-entering {
  opacity: 0;
  transform: translateY(8px);
  transition: none;
}
```

- [ ] **Step 2: Verify classes apply in browser**

In DevTools console:

```js
document.getElementById('panel-title').classList.add('is-leaving');
```

Expected: title fades up and out over 200ms. Then:

```js
document.getElementById('panel-title').classList.remove('is-leaving');
```

Expected: fades back to full opacity. Remove the class after testing.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: add stagger CSS classes for panel line transitions"
```

---

## Task 4: Update `model.js` — GLB loader + canvas texture

**Files:**
- Modify: `model.js`

- [ ] **Step 1: Replace the file contents with the following**

```js
import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.165.0/examples/jsm/loaders/GLTFLoader.js";

export function createCubePlaceholder() {
  const geometry = new THREE.BoxGeometry(2.35, 2.35, 2.35, 1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: "#d6dce2",
    roughness: 0.88,
    metalness: 0.04,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = false;
  cube.receiveShadow = false;
  return cube;
}

export function loadTagGLB(url = "./textag.glb") {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if (child.isMesh) {
            console.log("Tag mesh found:", child.name || "(unnamed)");
          }
        });
        resolve(model);
      },
      undefined,
      reject,
    );
  });
}

let _tagCanvas = null;
let _tagTexture = null;
let _tagFaceMesh = null;

export function updateTagTexture(tagModel, text) {
  if (!_tagCanvas) {
    _tagCanvas = document.createElement("canvas");
    _tagCanvas.width = 280;
    _tagCanvas.height = 400;
  }

  if (!_tagFaceMesh) {
    tagModel.traverse((child) => {
      if (child.isMesh && !_tagFaceMesh) _tagFaceMesh = child;
    });
  }

  if (!_tagFaceMesh) return;

  const ctx = _tagCanvas.getContext("2d");
  ctx.clearRect(0, 0, 280, 400);

  ctx.fillStyle = "#f0ece6";
  ctx.fillRect(0, 0, 280, 400);

  ctx.fillStyle = "#1a1f24";
  ctx.font = '500 28px "IBM Plex Sans", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 140, 200);

  if (!_tagTexture) {
    _tagTexture = new THREE.CanvasTexture(_tagCanvas);
    _tagFaceMesh.material = new THREE.MeshStandardMaterial({
      map: _tagTexture,
      roughness: 0.96,
      metalness: 0.02,
    });
  } else {
    _tagTexture.needsUpdate = true;
  }
}
```

- [ ] **Step 2: Verify the GLB loads**

Temporarily add to `main.js` after imports (undo after verification):

```js
import { loadTagGLB } from "./model.js";
loadTagGLB().then(m => console.log("GLB loaded:", m)).catch(e => console.error("GLB failed:", e));
```

Open the browser. Expected console output: `Tag mesh found: <name>` and `GLB loaded: Group {...}`. If you see `GLB failed`, check that `textag.glb` is in the same directory as `index.html` and the page is served via a local server (not `file://`).

Remove the temporary test import from `main.js` before continuing.

- [ ] **Step 3: Commit**

```bash
git add model.js
git commit -m "feat: load textag.glb and add updateTagTexture canvas label"
```

---

## Task 5: Update `uiPanel.js` — stagger fade

**Files:**
- Modify: `uiPanel.js`

- [ ] **Step 1: Replace the file contents with the following**

```js
export function createUiPanel() {
  const sectionLabel = document.getElementById("section-label");
  const panel = document.getElementById("info-panel");
  const eyebrow = document.getElementById("panel-eyebrow");
  const title = document.getElementById("panel-title");
  const body = document.getElementById("panel-body");

  const lines = [
    { el: eyebrow, delay: 0 },
    { el: title, delay: 60 },
    { el: body, delay: 120 },
  ];

  let pendingSwap = null;

  function applyContent(slide) {
    sectionLabel.textContent = slide.label;
    eyebrow.textContent = slide.label;
    title.textContent = slide.titleText;
    body.textContent = slide.bodyText;
    panel.dataset.side = slide.tagSide || "left";
  }

  function staggerOut() {
    lines.forEach(({ el, delay }) => {
      setTimeout(() => el.classList.add("is-leaving"), delay);
    });
  }

  function staggerIn() {
    lines.forEach(({ el, delay }) => {
      setTimeout(() => {
        el.classList.remove("is-leaving");
        el.classList.add("is-entering");
        void el.offsetHeight;
        el.classList.remove("is-entering");
      }, delay);
    });
  }

  function update(slide) {
    if (pendingSwap !== null) clearTimeout(pendingSwap);
    staggerOut();
    pendingSwap = setTimeout(() => {
      applyContent(slide);
      staggerIn();
      pendingSwap = null;
    }, 320);
  }

  function updateInstant(slide) {
    applyContent(slide);
  }

  return { update, updateInstant };
}
```

- [ ] **Step 2: Verify stagger in browser**

Temporarily wire a test in the browser console (after page loads):

```js
// Simulate a slide change — paste in console
const panel = document.getElementById('info-panel');
const eyebrow = document.getElementById('panel-eyebrow');
const title = document.getElementById('panel-title');
const body = document.getElementById('panel-body');

// Manually trigger is-leaving on all
[eyebrow, title, body].forEach((el, i) => {
  setTimeout(() => el.classList.add('is-leaving'), i * 60);
});

// After 320ms, swap content and stagger in
setTimeout(() => {
  eyebrow.textContent = 'slide 2';
  title.textContent = 'Sleeve Seam';
  body.textContent = 'Structural stitching holds shape under tension.';
  [eyebrow, title, body].forEach((el, i) => {
    setTimeout(() => {
      el.classList.remove('is-leaving');
      el.classList.add('is-entering');
      void el.offsetHeight;
      el.classList.remove('is-entering');
    }, i * 60);
  });
}, 320);
```

Expected: eyebrow, title, body fade up and out sequentially, then new content fades up into place with the same stagger.

- [ ] **Step 3: Commit**

```bash
git add uiPanel.js
git commit -m "feat: staggered line fade in uiPanel with update/updateInstant"
```

---

## Task 6: Update `main.js` — full integration

**Files:**
- Modify: `main.js`

- [ ] **Step 1: Replace the file contents with the following**

```js
import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";
import { createCubePlaceholder, loadTagGLB, updateTagTexture } from "./model.js";
import { getScenes } from "./scrollScenes.js";
import { createUiPanel } from "./uiPanel.js";
import { applyHighlightState } from "./highlights.js";
import * as animState from "./animState.js";

const canvas = document.getElementById("webgl-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#f5f3ef");

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 12);

const ambientLight = new THREE.AmbientLight("#ffffff", 1.8);
const directionalLight = new THREE.DirectionalLight("#ffffff", 1.1);
directionalLight.position.set(4, 6, 8);
const fillLight = new THREE.DirectionalLight("#d6dce2", 0.6);
fillLight.position.set(-6, -2, 6);
scene.add(ambientLight, directionalLight, fillLight);

const cube = createCubePlaceholder();
scene.add(cube);
const cubeBaseScale = 1.55;
cube.scale.setScalar(cubeBaseScale);

let tag = null;

const sections = [...document.querySelectorAll(".scroll-section")];
let isMobile = window.innerWidth <= 820;
let scenes = getScenes(isMobile);

const ui = createUiPanel();

animState.onTransition((newIndex) => {
  ui.update(scenes[newIndex]);
  if (tag) updateTagTexture(tag, scenes[newIndex].tagLabel);
});

function updateResponsiveSceneSet() {
  isMobile = window.innerWidth <= 820;
  scenes = getScenes(isMobile);
  camera.fov = isMobile ? 44 : 35;
  camera.position.z = isMobile ? 14 : 12;
  camera.updateProjectionMatrix();
}

function findActiveSection() {
  const midpoint = window.innerHeight * 0.5;
  let bestIndex = 0;
  let bestDistance = Infinity;
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height * 0.5;
    const distance = Math.abs(midpoint - sectionCenter);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });
  animState.setScene(bestIndex);
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  camera.aspect = window.innerWidth / window.innerHeight;
  updateResponsiveSceneSet();
}

window.addEventListener("resize", onResize);
window.addEventListener("scroll", findActiveSection, { passive: true });

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

const clock = new THREE.Clock();

function animate() {
  const dt = Math.min(clock.getDelta(), 0.1);
  const elapsed = clock.elapsedTime;

  const lf = (base) => 1 - Math.pow(base, dt * 60);

  const activeScene = scenes[animState.activeIndex];

  // Cube
  const cubeTarget = new THREE.Vector3(
    activeScene.cubeTargetPosition.x,
    activeScene.cubeTargetPosition.y,
    activeScene.cubeTargetPosition.z,
  );
  cube.position.lerp(cubeTarget, lf(0.08));

  const cubeIdleX = Math.sin(elapsed * 0.7) * 0.08;
  const cubeIdleY = Math.sin(elapsed * 1.1) * 0.12;
  cube.rotation.x = THREE.MathUtils.lerp(cube.rotation.x, cubeIdleY * 0.15, lf(0.08));
  cube.rotation.y = THREE.MathUtils.lerp(
    cube.rotation.y,
    cubeIdleX * 0.55 + animState.activeIndex * 0.08,
    lf(0.08),
  );
  cube.rotation.z = THREE.MathUtils.lerp(cube.rotation.z, Math.sin(elapsed * 0.45) * 0.03, lf(0.08));
  cube.scale.lerp(new THREE.Vector3(cubeBaseScale, cubeBaseScale, cubeBaseScale), lf(0.08));

  // Tag — drop-settle
  if (tag) {
    const now = performance.now();
    const t = Math.min(
      (now - animState.transitionTime) / animState.TRANSITION_DURATION,
      1,
    );
    const eased = easeOutBack(t);

    if (activeScene.tagVisible) {
      const startY = activeScene.tagTargetPosition.y + 2;
      const targetX = activeScene.tagTargetPosition.x;
      const targetY = activeScene.tagTargetPosition.y;
      const targetZ = activeScene.tagTargetPosition.z;

      tag.position.x = THREE.MathUtils.lerp(tag.position.x, targetX, lf(0.08));
      tag.position.y = THREE.MathUtils.lerp(startY, targetY, eased);
      tag.position.z = THREE.MathUtils.lerp(tag.position.z, targetZ, lf(0.08));

      const restingTilt = THREE.MathUtils.degToRad(activeScene.tagSide === "right" ? 8 : -8);
      tag.rotation.z = THREE.MathUtils.lerp(0, restingTilt, eased);
      tag.rotation.x = THREE.MathUtils.lerp(tag.rotation.x, Math.sin(elapsed * 0.9) * 0.04, lf(0.08));
      tag.rotation.y = THREE.MathUtils.lerp(tag.rotation.y, Math.sin(elapsed * 0.6) * 0.12, lf(0.08));

      const targetOpacity = Math.max(0, Math.min(1, eased));
      tag.traverse((child) => {
        if (child.material) {
          child.material.transparent = true;
          child.material.opacity = THREE.MathUtils.lerp(
            child.material.opacity ?? 0,
            targetOpacity,
            lf(0.12),
          );
        }
      });
    } else {
      tag.position.y = THREE.MathUtils.lerp(tag.position.y, -4, lf(0.08));
      tag.traverse((child) => {
        if (child.material) {
          child.material.transparent = true;
          child.material.opacity = THREE.MathUtils.lerp(
            child.material.opacity ?? 0,
            0,
            lf(0.12),
          );
        }
      });
    }
  }

  applyHighlightState(cube, animState.activeIndex === 0, elapsed);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

async function init() {
  updateResponsiveSceneSet();

  try {
    tag = await loadTagGLB();
    scene.add(tag);
    tag.position.set(0, -4, -1);
    tag.traverse((child) => {
      if (child.material) {
        child.material.transparent = true;
        child.material.opacity = 0;
      }
    });
    updateTagTexture(tag, scenes[animState.activeIndex].tagLabel);
  } catch (e) {
    console.warn("textag.glb failed to load:", e);
  }

  ui.updateInstant(scenes[animState.activeIndex]);
  findActiveSection();
  animate();
}

init();
```

- [ ] **Step 2: Verify scroll and animation in browser**

Open the site. Check each of the following:

1. **Cube moves smoothly** when scrolling between slides — no snapping.
2. **Tag is hidden on slide 1** — not visible.
3. **Tag drops in on slide 2** — appears from above, overshoots slightly, settles at a tilt. Canvas label shows `— placeholder —`.
4. **Tag is on the correct side** per slide (left on slides 2 and 4, right on slides 3 and 5).
5. **Panel text staggers** out and in when scrolling — eyebrow leaves first, then title, then body; they re-enter in the same order.
6. **No console errors.**

- [ ] **Step 3: Check 120Hz behaviour (if available)**

If you have a 120Hz display, scroll through the slides. The motion should feel identical in speed to 60Hz — the dt-lerp normalises it. Previously at 120Hz the cube would settle in half the time.

- [ ] **Step 4: Commit**

```bash
git add main.js
git commit -m "feat: wire animState, dt-lerp, GLB tag, and drop-settle animation"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** All 7 spec sections covered — design language (Tasks 1–3), animState (Task 2), GLB + canvas texture (Task 4), drop-settle (Task 6), panel stagger (Tasks 3 + 5), dt-lerp (Task 6)
- [x] **No placeholders:** All code is complete. No TBDs.
- [x] **Type consistency:** `updateTagTexture(tagModel, text)` defined in Task 4, called in Task 6 as `updateTagTexture(tag, scenes[newIndex].tagLabel)` — matches. `ui.update(slide)` / `ui.updateInstant(slide)` defined in Task 5, used in Task 6 — matches. `animState.setScene`, `animState.onTransition`, `animState.TRANSITION_DURATION`, `animState.transitionTime`, `animState.activeIndex` all defined in Task 2, used in Task 6 — match.
