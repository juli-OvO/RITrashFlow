const SVG_NS = "http://www.w3.org/2000/svg";

// Johnston Landfill & Recycle Center — destination of all routes.
// Coordinate space: matches the Wikipedia RI municipalities SVG (viewBox 0 0 500.01 759.6).
export const CENTER_NODE = {
  x: 242,
  y: 178,
  label: "Johnston Landfill & Recycle Center",
};

// Town centroids derived from the RI municipalities SVG, offset slightly downward
// so the dot appears below each town's label text.
export const TOWN_POSITIONS = {
  Barrington:             { x: 366, y: 256 },
  Bristol:                { x: 397, y: 308 },
  Burrillville:           { x: 130, y: 61  },
  "Central Falls":        { x: 321, y: 130 },
  Charlestown:            { x: 150, y: 547 },
  Coventry:               { x: 151, y: 296 },
  Cranston:               { x: 275, y: 254 },
  Cumberland:             { x: 295, y: 72  },
  "East Greenwich":       { x: 255, y: 347 },
  "East Providence":      { x: 343, y: 205 },
  Exeter:                 { x: 158, y: 415 },
  Foster:                 { x: 107, y: 214 },
  Glocester:              { x: 136, y: 126 },
  Jamestown:              { x: 332, y: 450 },
  Johnston:               { x: 242, y: 178 },
  Lincoln:                { x: 290, y: 96  },
  "Little Compton":       { x: 463, y: 452 },
  Middletown:             { x: 394, y: 444 },
  Narragansett:           { x: 272, y: 516 },
  "New Shoreham":         { x: 204, y: 722 },
  Newport:                { x: 363, y: 470 },
  "North Kingstown":      { x: 276, y: 398 },
  "North Providence":     { x: 279, y: 154 },
  "North Smithfield":     { x: 223, y: 59  },
  Pawtucket:              { x: 328, y: 140 },
  Portsmouth:             { x: 382, y: 382 },
  Providence:             { x: 301, y: 182 },
  "Richmond/Hopkinton":   { x: 125, y: 473 },
  Scituate:               { x: 177, y: 214 },
  Smithfield:             { x: 234, y: 120 },
  "South Kingstown":      { x: 230, y: 507 },
  Tiverton:               { x: 457, y: 366 },
  Warren:                 { x: 404, y: 265 },
  Warwick:                { x: 292, y: 294 },
  "West Greenwich":       { x: 148, y: 350 },
  "West Warwick":         { x: 247, y: 293 },
  Westerly:               { x: 60,  y: 576 },
  Woonsocket:             { x: 254, y: 36  },
};

export function createMap(svg, towns, handlers = {}) {
  // Set viewBox to match the embedded Wikipedia SVG coordinate space with padding
  svg.setAttribute("viewBox", "-160 -40 820 980");
  svg.replaceChildren();

  const backdrop   = svgEl("g", { class: "map-backdrop" });
  const flowRoot   = svgEl("g", { class: "flow-root" });
  const townLayer  = svgEl("g", { class: "town-layer" });
  const centerLayer = svgEl("g", { class: "center-layer" });

  // Rhode Island municipalities SVG as background map
  backdrop.append(
    svgEl("image", {
      href:                "./ri_municipalities.svg",
      x:                   0,
      y:                   0,
      width:               500.01,
      height:              759.6,
      preserveAspectRatio: "xMidYMid meet",
    }),
  );

  const townElements = new Map();

  towns.forEach((town) => {
    const pos = TOWN_POSITIONS[town.town];
    if (!pos) return;

    const group = svgEl("g", {
      class:       "town-node",
      "data-town": town.town,
      tabindex:    "0",
      role:        "button",
      "aria-label": town.town,
    });

    const particles = svgEl("g", {
      class: "town-node__particles",
      "aria-hidden": "true",
    });
    const particleVectors = [
      { dx: -14, dy: -9, delay: 0.02, size: 1.4 },
      { dx: -18, dy: 3, delay: 0.11, size: 1.1 },
      { dx: -7, dy: 15, delay: 0.18, size: 1.2 },
      { dx: 10, dy: -14, delay: 0.07, size: 1.3 },
      { dx: 16, dy: 5, delay: 0.14, size: 1.05 },
      { dx: 8, dy: 16, delay: 0.22, size: 1.15 },
    ];

    particleVectors.forEach(({ dx, dy, delay, size }) => {
      const particle = svgEl("circle", {
        class: "town-node__particle",
        cx: pos.x,
        cy: pos.y,
        r: size,
      });
      particle.style.setProperty("--dx", `${dx}px`);
      particle.style.setProperty("--dy", `${dy}px`);
      particle.style.setProperty("--particle-delay", `${delay}s`);
      particles.append(particle);
    });
    const focusRing = svgEl("circle", { class: "town-node__focus", cx: pos.x, cy: pos.y, r: 5  });
    const hitArea   = svgEl("circle", { class: "town-node__hit",   cx: pos.x, cy: pos.y, r: 10 });
    const dot       = svgEl("circle", {
      class: "town-node__dot",
      cx: pos.x,
      cy: pos.y,
      r: town.town === "Johnston" ? 3.2 : 2.8,
    });

    // No text label — the background SVG map already labels each municipality.
    group.append(particles, focusRing, hitArea, dot);

    group.addEventListener("pointerenter", (e) => handlers.onTownEnter?.(town, e));
    group.addEventListener("pointermove",  (e) => handlers.onTownMove?.(town, e));
    group.addEventListener("pointerleave", (e) => handlers.onTownLeave?.(town, e));
    group.addEventListener("focus",        (e) => handlers.onTownEnter?.(town, e));
    group.addEventListener("blur",         (e) => handlers.onTownLeave?.(town, e));
    group.addEventListener("click",        (e) => handlers.onTownClick?.(town, e));

    townElements.set(town.town, group);
    townLayer.append(group);
  });

  // Johnston Landfill center node
  const centerGroup = svgEl("g", {
    class:        "center-node",
    tabindex:     "0",
    role:         "img",
    "aria-label": CENTER_NODE.label,
  });

  centerGroup.append(
    svgEl("circle", { class: "center-node__ring", cx: CENTER_NODE.x, cy: CENTER_NODE.y, r: 14 }),
    svgEl("circle", { class: "center-node__ring", cx: CENTER_NODE.x, cy: CENTER_NODE.y, r: 22 }),
    svgEl("circle", { class: "center-node__dot",  cx: CENTER_NODE.x, cy: CENTER_NODE.y, r: 4.5 }),
  );

  [
    ["Johnston", CENTER_NODE.y + 29, "center-node__label"],
    ["Landfill & Recycle", CENTER_NODE.y + 41, "center-node__sub"],
  ].forEach(([text, y, cls]) => {
    const line = svgEl("text", { class: cls, x: CENTER_NODE.x, y });
    line.textContent = text;
    centerGroup.append(line);
  });

  centerGroup.addEventListener("pointerenter", (e) => handlers.onCenterEnter?.(e));
  centerGroup.addEventListener("pointermove",  (e) => handlers.onCenterMove?.(e));
  centerGroup.addEventListener("pointerleave", (e) => handlers.onCenterLeave?.(e));
  centerGroup.addEventListener("focus",        (e) => handlers.onCenterEnter?.(e));
  centerGroup.addEventListener("blur",         (e) => handlers.onCenterLeave?.(e));

  centerLayer.append(centerGroup);
  svg.append(backdrop, flowRoot, townLayer, centerLayer);

  return {
    flowRoot,
    centerNode: CENTER_NODE,
    setHoveredTown(townName, modeColor) {
      townElements.forEach((element, name) => {
        const isActive = name === townName;
        element.classList.toggle("is-hovered", isActive);
        if (isActive && modeColor) {
          element.style.setProperty("--mode-color", modeColor);
        } else {
          element.style.removeProperty("--mode-color");
        }
      });
    },
    setSelectedTown(townName) {
      townElements.forEach((element, name) => {
        element.classList.toggle("is-selected", name === townName);
      });
    },
  };
}

export function svgEl(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}
