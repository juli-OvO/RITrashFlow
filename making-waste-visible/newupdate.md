Rebuild this project as a clean, minimal interactive editorial data visualization titled “Making Waste Visible.”

GOAL
Create a single-page web piece that visualizes Rhode Island municipal waste flow by town. The composition should feel quiet, spatial, editorial, and design-forward — not like a dashboard, app UI, or corporate data product.

CORE CONCEPT
- Each Rhode Island municipality is shown as a node positioned approximately on a simplified Rhode Island map.
- All routes flow inward toward one central destination:
  Johnston Landfill & Recycle Center.
- Waste is represented as repeated small inward-pointing triangles traveling toward Johnston.
- Density of triangles represents magnitude.
- The overall feeling should be centralized intake, accumulation, and invisible systems becoming visible.

VISUAL TONE
- Minimal, restrained, editorial
- Quiet hierarchy
- A lot of whitespace
- Slight asymmetry so it does not feel overly templated
- No glossy interface, no dashboard cards, no bright colors, no “eco green” branding
- Think: design publication / RISD project / soft data poetry

PAGE STRUCTURE
Use a 3-zone composition:

1. LEFT COLUMN
- Small project label at top:
  “MAKING WASTE VISIBLE”
- Large stacked title:
  “RHODE
   ISLAND
   WASTE
   FLOW”
- Short descriptive paragraph below
- Lower-left mode selector and legend

2. CENTER MAP FIELD
- Dominant visual area
- Simplified Rhode Island outline in very light grey
- Municipality nodes positioned approximately geographically
- Johnston as a larger, darker center node
- Animated inward triangular flow routes from towns to Johnston
- Small legend/key near bottom of map
- Small source/update line near bottom edge

3. RIGHT INFO COLUMN
- Floating text, not boxed cards
- Small title:
  “RHODE ISLAND
   WASTE FLOW
   LIVE”
- Short explanatory paragraph
- Flow mode controls
- A few state average stats
- Optional timestamp / live indicator

IMPORTANT:
Do not use hard UI panel cards. The left and right columns should feel like annotations around the central field, not app sidebars.

DATA SOURCE
- Load local JSON file:
  /data/ri_municipal_waste_2024.json
- Use fetch() to load the data before rendering
- Do not hardcode town values
- Ignore average rows if they appear
- Use actual town rows only

EXPECTED DATA FIELDS
Each object includes:
- town
- trash_landfilled_tons_per_hh
- mrf_recycling_lbs_per_hh
- rejected_recycling_lbs_per_hh

If x/y coordinates are not in the file:
- create a separate hardcoded townPositions object mapping town names to approximate x/y positions
- do not randomize positions

DATA TO VISUAL MAPPING
Mode 1: Landfill
- Use trash_landfilled_tons_per_hh
- Triangle density maps to this value
- Color: warm grey

Mode 2: Recycling
- Use mrf_recycling_lbs_per_hh
- Triangle density maps to this value
- Color: muted desaturated blue

Mode 3: Rejected Recycling
- Use rejected_recycling_lbs_per_hh
- Triangle density maps to this value
- Color: dusty muted red

SCALING
- Normalize values per metric using min/max across all towns
- Map normalized values to route triangle count, for example 6–55 triangles
- Clamp extremes so no route becomes empty or overcrowded
- More value = denser route, not larger town node

TYPOGRAPHY
Use the following font system:

1. CANELA
Apply to:
- large main title
- right column title
- short descriptive paragraph if it feels elegant

2. IBM PLEX MONO
Apply to:
- municipality labels
- legend labels
- mode controls
- stats labels and numbers
- source/update line
- tiny UI-like text

Font behavior:
- Canela should be used sparingly
- IBM Plex Mono should carry the system / data layer
- Do not let the whole page become too decorative

TYPOGRAPHIC STYLE
Main title:
- very large
- stacked over 4 lines
- tight line-height
- dark warm charcoal
- editorial, quiet, not loud

Small system text:
- uppercase or small caps feel
- loose letter spacing
- small size
- muted color

Suggested text styling:
- title line-height around 0.9–0.96
- mono labels around 10–12px
- generous spacing between sections

COLOR PALETTE
Background:
- warm off-white: #f5f3ef

Text dark:
- #3e3a36

Text mid:
- #6b6661

Text light:
- #a8a39e

Landfill:
- #6a6662

Recycling:
- #6f8fa6

Rejected:
- #b07a7a

Map outline:
- very light grey-beige with low opacity

GENERAL RULE:
Everything should be desaturated, calm, and slightly warm.

MAP FIELD DETAILS
- Use SVG for the visualization
- Draw a simplified Rhode Island outline as a faint background path
- Town nodes are small filled circles
- Johnston center node is larger and darker
- Municipality labels are small, subtle, slightly offset from the nodes
- Avoid perfect symmetry in route layout

FLOW ROUTES
- Use repeated small triangles along each route
- All triangles must point inward toward Johnston
- Route direction must clearly converge into the center
- Routes may be straight or gently curved
- Slight route variation is encouraged so the visual system feels alive
- Triangle spacing can tighten slightly near the center to create a feeling of intake / acceleration
- Triangle size should remain small and refined
- Motion should be slow and calm, not flashy

ANIMATION
- Animate triangle motion along each path toward Johnston
- Loop continuously
- Motion should feel like an ongoing municipal stream, not like bouncing particles
- Use subtle speed variation if needed
- Fade transitions between modes should be smooth

INTERACTION
- Provide mode controls for:
  landfill
  recycling
  rejected recycling

CONTROL STYLE
- Do not use glossy buttons or dashboard pills if possible
- Prefer understated rows or quiet toggle controls
- Keep them editorial and minimal

Hover behavior:
- Hovering a town highlights its node and route
- Show a tooltip or small info text with:
  - town name
  - current metric value for active mode
- Hovering Johnston may show a label

STATE AVERAGE SECTION
In the right column, include a few state average figures:
- average tons landfilled per household
- average pounds recycled per household
- average pounds rejected per household

These should appear as:
- medium-size mono numbers
- small light labels underneath
- no card boxes

LEFT COLUMN CONTENT
Top:
- “MAKING WASTE VISIBLE”

Main title:
- “RHODE ISLAND WASTE FLOW”

Body copy:
- Short 2–4 line description explaining that municipal waste is visualized as material moving inward toward Johnston

Below that:
- mode selector
- small “how to read” legend using triangle examples

BOTTOM ANNOTATION
Near the map bottom:
- small source line:
  “DATASET: RIRRC 2024 HOW IS MY CITY OR TOWN DOING?   UPDATED: 2025-04-18”
- keep it quiet and mono

RESPONSIVENESS
Desktop:
- 3-column composition with map dominant

Mobile:
- stack layout cleanly
- map first or title first, whichever feels best
- controls and stats should move below the map
- preserve whitespace and hierarchy
- do not cram labels

FILE STRUCTURE
Create:
- index.html
- styles.css
- main.js
- data.js or direct fetch in main.js
- map.js
- flow.js
- ui.js

IMPLEMENTATION NOTES
- Keep code modular and readable
- Add comments explaining major sections
- Use reusable functions for:
  - loading data
  - computing normalized values
  - drawing town nodes
  - drawing / animating triangle routes
  - switching modes
  - hover interactions

IMPORTANT DESIGN CONSTRAINTS
- No dashboard cards
- No heavy panel borders
- No chart axes
- No bar graphs or standard charts
- No corporate feel
- No over-centered, auto-layout-feeling composition
- Avoid making every route look identical
- Preserve some asymmetry and softness
- The piece should feel designed by a human, not generated from a template

START IN THIS ORDER
1. Set up page layout and typography
2. Build simplified Rhode Island map field
3. Place municipality nodes and Johnston center node
4. Load JSON data
5. Build one flow mode (landfill) first
6. Implement triangle route density based on values
7. Add animation toward Johnston
8. Add mode switching for recycling and rejected recycling
9. Add hover behavior and right-column metric updates
10. Refine spacing, opacity, and hierarchy to match the editorial tone

FINAL QUALITY BAR
The result should look like an interactive design/art project for RISD:
- elegant
- spatial
- data-aware
- slightly poetic
- restrained
- believable as a finished portfolio piece