# Project: Making Waste Visible — Web Experience Spec

## Overview

A scroll-based interactive web experience that extends the garment as a data object.

The website is not a dashboard or informational page.  
It is a **material, spatial narrative** that reveals hidden waste systems through gradual interaction.

Users move through the experience via **scroll**, while a 3D garment responds through camera transitions, zooms, and contextual overlays.

---

## Core Experience Principles

- **Material-first**: The garment is the primary interface
- **Slow revelation**: Information appears progressively, not all at once
- **Embodied data**: Data is encoded into form, texture, and distortion
- **Low UI presence**: Avoid traditional web UI elements
- **Narrative through movement**: Scroll = camera choreography

---

## Interaction Model

### Input
- Vertical scroll (primary interaction)

### Output
- Camera movement through predefined viewpoints
- Highlighting of garment regions
- Appearance of contextual text panels

---

## Scroll Structure (Scene Breakdown)

### Scene 1 — Introduction
- Full garment in empty space
- Slow rotation
- Minimal text:
  > "Where does your waste go?"

---

### Scene 2 — Recycling Rates
- Camera zooms to garment region
- Subtle highlight
- Fabric density / brightness variation becomes visible
- Text panel appears

---

### Scene 3 — Contamination
- Transition to distorted fabric region
- Visual glitch / warping
- Text explains rejected recycling

---

### Scene 4 — Waste Flow
- Threads / directional patterns become visible
- Movement suggests flow toward landfill
- Reference to :contentReference[oaicite:0]{index=0}

---

### Scene 5 — System View
- Camera pulls back
- Full garment recontextualized
- Optional call to action / reflection

---

## Visual System

### Overall Feel

**Material Minimalism with System Tension**

- Quiet, restrained, atmospheric
- Emphasis on surface, density, and subtle imperfection
- Avoid bright eco-branding or futuristic aesthetics

---

### Color Palette

Base:
- `#F5F3EF` — soft off-white (background)
- `#D6DCE2` — light desaturated grey-blue

Data accents:
- `#8FA3B5` — muted blue (recycling / neutral data)
- `#5C6B73` — deeper grey-blue

Text:
- `#1A1F24` — near-black

Optional accent (very limited use):
- `#7A8C5F` — oxidized green (subtle environmental tone)

---

### Material Language

- Fabric-inspired textures (subtle grain)
- No glossy or plastic surfaces
- Slight noise / irregularity in patterns
- Distortion used to represent system failure

---

## Typography

### Primary Font

Sans-serif:
- **IBM Plex Sans** or **Inter**

Characteristics:
- neutral
- readable
- slightly human, not overly geometric

---

### Secondary Font (optional)

Serif:
- **IBM Plex Serif** or similar

Use for:
- emphasis
- quotes
- conceptual framing text

---

### Type Usage

- Keep text minimal and concise
- Avoid long paragraphs on screen
- Use hierarchy:
  - Title
  - Short explanation (1–2 sentences)
  - Data point

---

## Layout System

### Structure

- Fullscreen sections (100vh)
- Scroll-driven transitions between scenes
- No visible grid or traditional layout

---

### Text Panels

- Represented as **fabric-like planes**
- Off-white surface with subtle texture
- Slight shadow / depth
- Positioned near garment in 3D space

---

## Motion & Interaction

### Motion Style

- Slow, eased transitions
- No abrupt snapping
- Slight delay before text appears

---

### Camera Behavior

- Predefined positions for each scene
- Smooth interpolation between views
- Subtle idle movement (breathing effect)

---

### Highlight Behavior

- Soft glow or brightness shift
- No harsh outlines
- Fade in/out on hover or scroll trigger

---

## Technology Stack

### Core

- **:contentReference[oaicite:1]{index=1}** — 3D rendering and interaction

---

### Supporting

- HTML / CSS — text and layout
- JavaScript — scroll handling and state management

Optional:
- GSAP (for smooth scroll-based animation control)

---

## 3D Asset Structure

### Garment Model

- Format: `.glb` (glTF)
- Polycount: ~15k–25k triangles

Structure:
- Main garment mesh
- Separate meshes for interactive zones:
  - chest_zone
  - sleeve_zone
  - etc.

---

### Additional Elements

- Fabric text panels (plane geometry)
- Optional overlay meshes for highlights

---

## Performance Considerations

- Keep total scene under ~100k triangles
- Use textures instead of high geometry detail
- Optimize lighting (avoid heavy real-time shadows)

---

## Design Goals

- Make waste systems **visible but not overwhelming**
- Encourage **reflection, not instruction**
- Maintain a balance between:
  - clarity
  - ambiguity
  - material presence

---

## Tone Summary

Not:
- corporate sustainability site
- data dashboard
- futuristic tech demo

But:
> a quiet, material interface that reveals the hidden structure of everyday waste