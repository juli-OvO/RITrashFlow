# Design Spec — Animation, Design Language & Tag Interaction

**Project:** Making Waste Visible  
**Date:** 2026-04-23  
**Status:** Approved

---

## Context

The site is a scroll-based Three.js experience introducing garment parts to the public. Five scenes, each pairing a 3D tag (loaded from `textag.glb`) with an HTML info panel. This spec covers:

- Design language alignment (font, color tokens)
- Tag entry animation
- Canvas texture label on the tag mesh
- Info panel transition
- Frame-rate-independent animation

`plan.md` is the authoritative design target unless explicitly overridden.

---

## 1. Design Language

### Font
- **Primary:** IBM Plex Sans (400, 500, 600)
- **Secondary:** IBM Plex Serif (400, 500, italic) — for quotes, emphasis, conceptual framing

Already applied to `index.html` and `styles.css`. Replaces Manrope.

### Color tokens (in `styles.css`)
All already match `plan.md`. One token added:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#f5f3ef` | Background |
| `--tone-light` | `#d6dce2` | Subtle surfaces |
| `--accent` | `#8fa3b5` | Neutral data accent |
| `--tone-deep` | `#5c6b73` | Deeper grey-blue |
| `--text` | `#1a1f24` | Body text |
| `--accent-green` | `#7a8c5f` | Environmental accent — very limited use |

---

## 2. Architecture

### Approach
Add one new module (`animState.js`) as a shared transition state bus. All other changes are targeted patches to existing files. No external dependencies added.

### Files changed

| File | Change |
|---|---|
| `animState.js` | **New.** Owns scene transition state and subscriber pattern |
| `main.js` | dt-lerp everywhere; awaits GLB load; drives tag drop-settle from animState |
| `uiPanel.js` | Stagger fade via CSS classes; subscribes to `animState.onTransition` |
| `model.js` | `loadTagGLB()` replaces placeholder; `updateTagTexture(mesh, text)` draws canvas label |
| `scrollScenes.js` | Adds `tagLabel` field per scene (placeholder text for now) |
| `styles.css` | Adds stagger transition classes for panel lines |
| `highlights.js` | No change |

---

## 3. `animState.js`

Single source of truth for transition timing.

**Exported interface:**
```js
{
  activeIndex,       // current scene index
  previousIndex,     // scene before last transition
  transitionTime,    // performance.now() at last scene change
  isTransitioning,   // true for 600ms after a scene change
  setScene(index),   // called by main.js on scroll
  onTransition(fn),  // subscribe — fn called with (newIndex, prevIndex)
}
```

**Transition window:** 600ms — long enough for tag drop-settle to complete before panel stagger begins.

**Consumers:**
- `main.js` calls `setScene(index)` on scroll; reads `transitionTime` to compute tag animation `t`
- `uiPanel.js` subscribes via `onTransition` to trigger panel stagger
- `model.js`'s `updateTagTexture` called from the `onTransition` callback

---

## 4. Tag: `textag.glb` + canvas texture

### Loading
Replace `createTagPlaceholder()` with `loadTagGLB()` using the existing `GLTFLoader` stub in `model.js`. The GLB is loaded once on startup; `main.js` awaits it before starting the render loop.

### Canvas texture
`updateTagTexture(mesh, text)` — called on each scene transition:

1. Draws `#f0ece6` background fill on a `280×400` canvas
2. Draws `text` centered, IBM Plex Sans, `#1a1f24`
3. Creates/updates a `THREE.CanvasTexture` from the canvas
4. Assigns it to the tag face material

**GLB mesh selection:** At load time, traverse the GLB scene and log mesh names to identify which child is the flat face of the tag. Apply the texture only to that mesh. If the GLB has a single mesh, use it directly.

`scrollScenes.js` gains a `tagLabel` field per scene. Placeholder strings used until content is finalised.

---

## 5. Tag entry animation — drop and settle

**Trigger:** `animState.setScene()` — fires once per slide change.

**Approach:** Parametric, not lerp. No frame-rate dependency.

```js
t = clamp((now - transitionTime) / 600, 0, 1)
eased = easeOutBack(t)   // overshoots ~1.08, settles at 1.0
tagY = lerp(startY, targetY, eased)
tagRotZ = lerp(0, restingTilt, eased)   // ±8° based on tagSide
```

**Entry:** Tag starts directly above its target position, descends and overshoots slightly, then settles at the resting tilt angle. Position and rotation share the same `eased` value so they arrive together.

**Exit (slide 1 / tagVisible: false):** Tag exits downward off screen using the same parametric approach in reverse.

**Resting tilt:** `−8°` for `tagSide: "left"`, `+8°` for `tagSide: "right"` — matches existing `scrollScenes.js` convention.

---

## 6. Panel: staggered line fade

**Trigger:** `animState.onTransition` subscription in `uiPanel.js`.

### Phase 1 — stagger out
Add `is-leaving` class to each line with offset delays:

| Element | Delay |
|---|---|
| `.info-panel__eyebrow` | 0ms |
| `.info-panel__title` | 60ms |
| `.info-panel__body` | 120ms |

Each line: `translateY(-6px)` + `opacity: 0` over `200ms`.

### Phase 2 — swap + stagger in
After `320ms` (all lines fully out):
1. Swap text content to new slide data
2. Update `panel.dataset.side` (panel repositions while invisible — no visible jump)
3. Remove `is-leaving`, add `is-entering` with same stagger offsets
4. Each line: enter from `translateY(8px)`, fade to `opacity: 1` over `240ms`
5. Remove `is-entering` after transition completes

### CSS additions
```css
.info-panel__eyebrow,
.info-panel__title,
.info-panel__body {
  transition: opacity 200ms ease, transform 200ms ease;
}
.is-leaving  { opacity: 0; transform: translateY(-6px); }
.is-entering { opacity: 0; transform: translateY(8px);  }
```

---

## 7. Animation precision — dt-lerp

Replace every frame-dependent `lerp(factor)` with a dt-normalised equivalent:

```js
const factor = 1 - Math.pow(lerpBase, dt * 60);
object.lerp(target, factor);
```

Where `lerpBase` is the original factor (e.g. `0.08`, `0.12`). This preserves the intended feel at 60Hz while being frame-rate correct at any refresh rate.

`dt` comes from `clock.getDelta()` — already present in `main.js`.

**Applies to:** cube position, cube rotation (x, y, z), tag scale, idle breathing. The tag's main transition motion uses `easeOutBack(t)` instead and does not use lerp.

---

## Out of scope

- Camera choreography per scene (separate future spec)
- Garment model swap (cube → real garment GLB)
- Garment zone highlighting
- Scene content (real text for `tagLabel`, `titleText`, `bodyText`)
