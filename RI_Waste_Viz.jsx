import { useState, useMemo, useEffect } from "react";

// ── DATA ────────────────────────────────────────────────────────────────────
const MUNICIPALITIES = [
  { name: "Providence",        rejected: 654, mrf: 78,  rejRate: 89.3, hh: 51541, diversion: 7.8,  landfilled: 1.34 },
  { name: "Cranston",          rejected: 201, mrf: 371, rejRate: 35.1, hh: 29275, diversion: 27.3, landfilled: 0.96 },
  { name: "Pawtucket",         rejected: 178, mrf: 252, rejRate: 41.4, hh: 30000, diversion: 17.4, landfilled: 0.90 },
  { name: "West Warwick",      rejected: 112, mrf: 366, rejRate: 23.4, hh: 9500,  diversion: 21.6, landfilled: 1.16 },
  { name: "Johnston",          rejected: 82,  mrf: 456, rejRate: 15.2, hh: 9867,  diversion: 14.3, landfilled: 1.76 },
  { name: "East Providence",   rejected: 70,  mrf: 372, rejRate: 15.8, hh: 17022, diversion: 36.6, landfilled: 0.91 },
  { name: "Central Falls",     rejected: 66,  mrf: 497, rejRate: 11.7, hh: 5293,  diversion: 20.4, landfilled: 1.12 },
  { name: "North Providence",  rejected: 58,  mrf: 358, rejRate: 13.9, hh: 12545, diversion: 22.8, landfilled: 0.94 },
  { name: "Tiverton",          rejected: 38,  mrf: 424, rejRate: 8.2,  hh: 6782,  diversion: 35.3, landfilled: 0.52 },
  { name: "Middletown",        rejected: 32,  mrf: 585, rejRate: 5.2,  hh: 4733,  diversion: 49.1, landfilled: 0.58 },
  { name: "Scituate",          rejected: 22,  mrf: 522, rejRate: 4.0,  hh: 4184,  diversion: 25.6, landfilled: 0.97 },
  { name: "North Smithfield",  rejected: 20,  mrf: 471, rejRate: 4.1,  hh: 4537,  diversion: 33.6, landfilled: 0.79 },
  { name: "East Greenwich",    rejected: 19,  mrf: 601, rejRate: 3.1,  hh: 4332,  diversion: 35.7, landfilled: 1.02 },
  { name: "Foster",            rejected: 15,  mrf: 578, rejRate: 2.5,  hh: 1575,  diversion: 20.3, landfilled: 1.21 },
  { name: "Cumberland",        rejected: 14,  mrf: 453, rejRate: 3.0,  hh: 13922, diversion: 28.6, landfilled: 0.93 },
  { name: "Burrillville",      rejected: 12,  mrf: 537, rejRate: 2.2,  hh: 6022,  diversion: 32.7, landfilled: 0.80 },
  { name: "Barrington",        rejected: 9,   mrf: 622, rejRate: 1.4,  hh: 6050,  diversion: 49.4, landfilled: 0.95 },
  { name: "Coventry",          rejected: 9,   mrf: 526, rejRate: 1.7,  hh: 12884, diversion: 33.8, landfilled: 0.83 },
  { name: "Lincoln",           rejected: 9,   mrf: 660, rejRate: 1.3,  hh: 6114,  diversion: 29.5, landfilled: 1.22 },
  { name: "Richmond/Hopkinton",rejected: 8,   mrf: 441, rejRate: 1.8,  hh: 2500,  diversion: 39.9, landfilled: 0.52 },
  { name: "Smithfield",        rejected: 7,   mrf: 514, rejRate: 1.3,  hh: 7603,  diversion: 39.2, landfilled: 0.77 },
  { name: "Warwick",           rejected: 5,   mrf: 537, rejRate: 0.9,  hh: 31503, diversion: 50.2, landfilled: 0.87 },
  { name: "Woonsocket",        rejected: 5,   mrf: 474, rejRate: 1.0,  hh: 10543, diversion: 30.1, landfilled: 0.95 },
  { name: "Bristol",           rejected: 3,   mrf: 493, rejRate: 0.6,  hh: 8700,  diversion: 33.2, landfilled: 0.74 },
  { name: "Glocester",         rejected: 1,   mrf: 371, rejRate: 0.3,  hh: 3500,  diversion: 33.0, landfilled: 0.62 },
  { name: "Charlestown",       rejected: 0,   mrf: 196, rejRate: 0.0,  hh: 2193,  diversion: 35.0, landfilled: 0.32 },
  { name: "Exeter",            rejected: 0,   mrf: 247, rejRate: 0.0,  hh: 1800,  diversion: 29.4, landfilled: 0.53 },
  { name: "Jamestown",         rejected: 0,   mrf: 670, rejRate: 0.0,  hh: 2700,  diversion: 45.8, landfilled: 0.78 },
  { name: "Little Compton",    rejected: 0,   mrf: 337, rejRate: 0.0,  hh: 1500,  diversion: 31.1, landfilled: 0.63 },
  { name: "Narragansett",      rejected: 0,   mrf: 542, rejRate: 0.0,  hh: 6159,  diversion: 30.7, landfilled: 0.64 },
  { name: "New Shoreham",      rejected: 0,   mrf: 504, rejRate: 0.0,  hh: 250,   diversion: 34.3, landfilled: 1.41 },
  { name: "Newport",           rejected: 0,   mrf: 476, rejRate: 0.0,  hh: 10100, diversion: 42.4, landfilled: 0.56 },
  { name: "North Kingstown",   rejected: 0,   mrf: 510, rejRate: 0.0,  hh: 10464, diversion: 55.1, landfilled: 0.57 },
  { name: "Portsmouth",        rejected: 0,   mrf: 439, rejRate: 0.0,  hh: 3213,  diversion: 54.0, landfilled: 0.60 },
  { name: "South Kingstown",   rejected: 0,   mrf: 513, rejRate: 0.0,  hh: 5844,  diversion: 37.3, landfilled: 0.68 },
  { name: "Warren",            rejected: 0,   mrf: 429, rejRate: 0.0,  hh: 5020,  diversion: 36.1, landfilled: 0.77 },
  { name: "West Greenwich",    rejected: 0,   mrf: 610, rejRate: 0.0,  hh: 2000,  diversion: 29.2, landfilled: 1.25 },
  { name: "Westerly",          rejected: 0,   mrf: 656, rejRate: 0.0,  hh: 8000,  diversion: 40.7, landfilled: 0.89 },
];

// ── VARIABLES ────────────────────────────────────────────────────────────────
const VARIABLES = [
  { key: "rejRate",    label: "Rejection Rate (%)",         unit: "%",     desc: "% of recycling rejected at MRF" },
  { key: "rejected",  label: "Rejected Recycling (lbs/HH)",unit: "lbs/HH",desc: "Pounds of rejected recycling per household" },
  { key: "landfilled",label: "Trash Landfilled (tons/HH)", unit: "t/HH",  desc: "Tons of trash sent to landfill per household" },
  { key: "diversion", label: "Diversion Rate (%)",         unit: "%",     desc: "Overall % of waste diverted from landfill" },
  { key: "mrf",       label: "MRF Recycling (lbs/HH)",     unit: "lbs/HH",desc: "Pounds of successfully processed recycling" },
  { key: "cost",      label: "Est. Rejection Cost ($)",    unit: "$",     desc: "Estimated cost of rejected recycling (over-cap $115/ton)" },
];

// ── PALETTES ─────────────────────────────────────────────────────────────────
const PALETTES = [
  { key: "landfill",  label: "Landfill Grey",   stops: ["#e8f4f8","#b0bec5","#607d8b","#37474f","#1a2329"] },
  { key: "heat",      label: "Urgency Heat",    stops: ["#fff9c4","#ffcc02","#ff6b35","#c62828","#4a0000"] },
  { key: "ocean",     label: "Ocean Depth",     stops: ["#e0f7fa","#4dd0e1","#0097a7","#006064","#001f26"] },
  { key: "moss",      label: "Recycle Moss",    stops: ["#f9fbe7","#aed581","#558b2f","#1b5e20","#0a1f0d"] },
  { key: "dusk",      label: "Dusk",            stops: ["#fce4ec","#ce93d8","#7b1fa2","#311b92","#0d0d1a"] },
  { key: "rust",      label: "Industrial Rust", stops: ["#fbe9e7","#ffab91","#bf360c","#6d1f0a","#1a0800"] },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function getValue(m, variable) {
  if (variable === "cost") return Math.round((m.rejected * m.hh / 2000) * 115);
  return m[variable];
}

function lerp(a, b, t) { return a + (b - a) * t; }

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r,g,b];
}

function interpolateColor(stops, t) {
  const n = stops.length - 1;
  const i = Math.min(Math.floor(t * n), n - 1);
  const local = (t * n) - i;
  const [r1,g1,b1] = hexToRgb(stops[i]);
  const [r2,g2,b2] = hexToRgb(stops[i+1]);
  const r = Math.round(lerp(r1,r2,local));
  const g = Math.round(lerp(g1,g2,local));
  const b = Math.round(lerp(b1,b2,local));
  return `rgb(${r},${g},${b})`;
}

function normalise(val, min, max) {
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (val - min) / (max - min)));
}

function fmtVal(val, unit) {
  if (unit === "$") return "$" + val.toLocaleString();
  if (unit === "%") return val.toFixed(1) + "%";
  return val.toLocaleString() + " " + unit;
}

function cssId(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "_");
}

const PATTERN_SLOT_COUNT = 5;
const DEFAULT_LEVEL_PATTERN_SLOTS = Object.fromEntries(
  Array.from({ length: PATTERN_SLOT_COUNT }, (_, i) => [
    i,
    { pattern: null, scale: 1, opacity: 100, color: null },
  ])
);

function patternSlotIndex(t) {
  return Math.min(PATTERN_SLOT_COUNT - 1, Math.floor(t * PATTERN_SLOT_COUNT));
}

function levelMidpoint(index) {
  return (index + 0.5) / PATTERN_SLOT_COUNT;
}

function colorToHex(color) {
  if (!color) return "#000000";
  if (color.startsWith("#")) return color;
  const match = color.match(/\d+/g);
  if (!match || match.length < 3) return "#000000";
  return "#" + match.slice(0, 3).map(n => {
    const hex = Math.max(0, Math.min(255, Number(n))).toString(16);
    return hex.padStart(2, "0");
  }).join("");
}

function formatLevelRange(range, unit) {
  if (!range) return "";
  if (range.above !== undefined) return `above ${fmtVal(range.above, unit)}`;
  if (range.below !== undefined) return `below ${fmtVal(range.below, unit)}`;
  return `${fmtVal(range.min, unit)} - ${fmtVal(range.max, unit)}`;
}

function isLowerValueWorse(variable) {
  return variable === "diversion";
}

function computeQuantileThresholds(municipalities, variable) {
  const sorted = [...municipalities].sort((a, b) => {
    const diff = getValue(a, variable) - getValue(b, variable);
    return diff || a.name.localeCompare(b.name);
  });
  const base = Math.floor(sorted.length / PATTERN_SLOT_COUNT);
  const remainder = sorted.length % PATTERN_SLOT_COUNT;
  const assignments = {};
  const ranges = [];
  const thresholds = [];
  let cursor = 0;

  for (let level = 0; level < PATTERN_SLOT_COUNT; level += 1) {
    const size = base + (level < remainder ? 1 : 0);
    const group = sorted.slice(cursor, cursor + size);
    const values = group.map(m => getValue(m, variable));
    ranges[level] = {
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0,
    };
    group.forEach(m => { assignments[m.name] = level; });
    if (level < PATTERN_SLOT_COUNT - 1) {
      thresholds[level] = group.length ? getValue(group[group.length - 1], variable) : 0;
    }
    cursor += size;
  }

  return { ranges, thresholds, assignments };
}

function computeLevelInfo(municipalities, variable, splitMethod) {
  const vals = municipalities.map(m => getValue(m, variable));
  const min = vals.length ? Math.min(...vals) : 0;
  const max = vals.length ? Math.max(...vals) : 0;
  const mean = vals.length ? vals.reduce((sum, val) => sum + val, 0) / vals.length : 0;
  const variance = vals.length ? vals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / vals.length : 0;
  const stdDev = Math.sqrt(variance);
  const lowerWorse = isLowerValueWorse(variable);
  const quantiles = computeQuantileThresholds(municipalities, variable);

  function getLevel(municipality) {
    const value = getValue(municipality, variable);
    if (splitMethod === "stddev") {
      if (stdDev === 0) return 2;
      const z = (value - mean) / stdDev;
      const worseZ = lowerWorse ? -z : z;
      if (worseZ > 1.5) return 4;
      if (worseZ >= 0.5) return 3;
      if (worseZ >= -0.5) return 2;
      if (worseZ >= -1.5) return 1;
      return 0;
    }
    if (splitMethod === "quantile") {
      const quantileLevel = quantiles.assignments[municipality.name] ?? 0;
      return lowerWorse ? PATTERN_SLOT_COUNT - 1 - quantileLevel : quantileLevel;
    }
    const equalLevel = patternSlotIndex(normalise(value, min, max));
    return lowerWorse ? PATTERN_SLOT_COUNT - 1 - equalLevel : equalLevel;
  }

  let ranges;
  if (splitMethod === "stddev") {
    const b1 = mean - 1.5 * stdDev;
    const b2 = mean - 0.5 * stdDev;
    const b3 = mean + 0.5 * stdDev;
    const b4 = mean + 1.5 * stdDev;
    ranges = lowerWorse
      ? [
          { above: b4 },
          { min: b3, max: b4 },
          { min: b2, max: b3 },
          { min: b1, max: b2 },
          { below: b1 },
        ]
      : [
          { below: b1 },
          { min: b1, max: b2 },
          { min: b2, max: b3 },
          { min: b3, max: b4 },
          { above: b4 },
        ];
  } else if (splitMethod === "quantile") {
    ranges = lowerWorse ? [...quantiles.ranges].reverse() : quantiles.ranges;
  } else {
    ranges = Array.from({ length: PATTERN_SLOT_COUNT });
    for (let i = 0; i < PATTERN_SLOT_COUNT; i += 1) {
      const rawStart = min + (max - min) * (i / PATTERN_SLOT_COUNT);
      const rawEnd = min + (max - min) * ((i + 1) / PATTERN_SLOT_COUNT);
      const levelIndex = lowerWorse ? PATTERN_SLOT_COUNT - 1 - i : i;
      ranges[levelIndex] = {
        min: rawStart,
        max: rawEnd,
        normalized: true,
        start: levelIndex * 20,
        end: (levelIndex + 1) * 20,
      };
    }
  }

  const counts = Array.from({ length: PATTERN_SLOT_COUNT }, () => 0);
  municipalities.forEach(m => { counts[getLevel(m)] += 1; });

  return { splitMethod, ranges, counts, getLevel, min, max, mean, stdDev, quantileThresholds: quantiles.thresholds };
}

function getPatternSlot(importedPattern, t) {
  if (!importedPattern?.slots?.length) return null;
  const target = patternSlotIndex(t);
  for (let i = target; i >= 0; i -= 1) {
    if (importedPattern.slots[i]) return importedPattern.slots[i];
  }
  return importedPattern.slots.find(Boolean) || null;
}

function getLevelPatternSlot(levelPatternSlots, municipality, levelInfo) {
  return levelPatternSlots?.[levelInfo.getLevel(municipality)] || null;
}

// ── RI MUNICIPALITY POSITIONS (for cartogram / choropleth bubbles) ────────────
// Approximate geographic centroids mapped to a 400×480 canvas
const POSITIONS = {
  "Providence":         [200, 145],
  "Cranston":           [195, 178],
  "Pawtucket":          [215, 125],
  "West Warwick":       [175, 195],
  "Johnston":           [168, 158],
  "East Providence":    [225, 148],
  "Central Falls":      [218, 118],
  "North Providence":   [205, 128],
  "Tiverton":           [295, 242],
  "Middletown":         [295, 310],
  "Scituate":           [148, 168],
  "North Smithfield":   [188, 95],
  "East Greenwich":     [205, 228],
  "Foster":             [118, 178],
  "Cumberland":         [205, 88],
  "Burrillville":       [148, 88],
  "Barrington":         [248, 205],
  "Coventry":           [158, 208],
  "Lincoln":            [205, 108],
  "Richmond/Hopkinton": [155, 298],
  "Smithfield":         [178, 125],
  "Warwick":            [218, 205],
  "Woonsocket":         [178, 78],
  "Bristol":            [268, 228],
  "Glocester":          [138, 118],
  "Charlestown":        [165, 348],
  "Exeter":             [185, 278],
  "Jamestown":          [278, 298],
  "Little Compton":     [308, 268],
  "Narragansett":       [228, 318],
  "New Shoreham":       [258, 418],
  "Newport":            [295, 330],
  "North Kingstown":    [218, 268],
  "Portsmouth":         [288, 268],
  "South Kingstown":    [198, 318],
  "Warren":             [258, 215],
  "West Greenwich":     [168, 238],
  "Westerly":           [148, 368],
};

// ── RI MUNICIPAL SVG EXTRACTION ───────────────────────────────────────────────
const RI_MAP_VIEWBOX = "0 0 500.01 759.6";
const BASE_MUNICIPAL_FILL = "#f7f7f7";
const BASE_MUNICIPAL_STROKE = "#888888";

const SVG_ID_ALIAS = {
  Barrington: "Barrington",
  Bristol: "Bristol",
  Burrillville: "Burrillville",
  Central_Falls: "Central Falls",
  Charlestown: "Charlestown",
  Coventry: "Coventry",
  Cranston: "Cranston",
  Cumberland: "Cumberland",
  East_Greenwich: "East Greenwich",
  East_Providence: "East Providence",
  Exeter: "Exeter",
  Foster: "Foster",
  Glocester: "Glocester",
  Hopkinton: "Richmond/Hopkinton",
  Jamestown: "Jamestown",
  Johnston: "Johnston",
  Lincoln: "Lincoln",
  Little_Compton: "Little Compton",
  Middletown: "Middletown",
  Narragansett: "Narragansett",
  New_Shoreham: "New Shoreham",
  Newport: "Newport",
  North_Kingstown: "North Kingstown",
  North_Providence: "North Providence",
  North_Smithfield: "North Smithfield",
  Pawtucket: "Pawtucket",
  Portsmouth: "Portsmouth",
  Providence: "Providence",
  Richmond: "Richmond/Hopkinton",
  Scituate: "Scituate",
  Smithfield: "Smithfield",
  South_Kingstown: "South Kingstown",
  Tiverton: "Tiverton",
  Warren: "Warren",
  WARWICK: "Warwick",
  "WARWICK-3": "Warwick",
  "Warwick-2": "Warwick",
  West_Greenwich: "West Greenwich",
  West_Warwick: "West Warwick",
  Westerly: "Westerly",
  Woonsocket: "Woonsocket",
};

const MUNICIPALITY_BY_NORMALIZED = MUNICIPALITIES.reduce((acc, m) => {
  acc[normaliseName(m.name)] = m.name;
  return acc;
}, {});

function normaliseName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[_-]/g, " ")
    .replace(/[^a-z0-9/ ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveMunicipalityName(rawName) {
  if (!rawName) return null;
  if (SVG_ID_ALIAS[rawName]) return SVG_ID_ALIAS[rawName];
  const spaced = rawName.replace(/_/g, " ");
  if (MUNICIPALITY_BY_NORMALIZED[normaliseName(spaced)]) {
    return MUNICIPALITY_BY_NORMALIZED[normaliseName(spaced)];
  }
  const compact = normaliseName(spaced).replace(/\s/g, "");
  const match = MUNICIPALITIES.find(m => normaliseName(m.name).replace(/\s/g, "") === compact);
  return match?.name || null;
}

function polygonPointsToPath(points) {
  const nums = String(points || "").trim().split(/[\s,]+/).filter(Boolean);
  if (nums.length < 4) return "";
  const pairs = [];
  for (let i = 0; i + 1 < nums.length; i += 2) {
    pairs.push(`${nums[i]},${nums[i + 1]}`);
  }
  return `M${pairs[0]} L${pairs.slice(1).join(" L")} Z`;
}

function extractPathsFromSvgText(svgText) {
  if (typeof DOMParser === "undefined") return {};
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) return {};

  const lookup = {};

  function addElement(el, municipalityOverride) {
    const rawName = municipalityOverride || el.getAttribute("data-name") || el.getAttribute("id");
    const municipality = resolveMunicipalityName(rawName);
    if (!municipality) return;
    const tag = el.tagName.toLowerCase();
    const d = tag === "polygon"
      ? polygonPointsToPath(el.getAttribute("points"))
      : el.getAttribute("d");
    if (!d) return;
    lookup[municipality] = lookup[municipality] || [];
    if (!lookup[municipality].includes(d)) lookup[municipality].push(d);
  }

  svg.querySelectorAll("path[id], polygon[id], path[data-name], polygon[data-name]").forEach(el => {
    addElement(el);
  });

  return lookup;
}

async function fetchFirstText(urls) {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.text();
    } catch {
      // Try the next likely same-origin location.
    }
  }
  return "";
}

async function loadMunicipalityPathLookup() {
  const gazetteText = await fetchFirstText([
    "making-waste-visible/RIWasteGazette.html",
    "./making-waste-visible/RIWasteGazette.html",
    "RIWasteGazette.html",
    "riwastegazette.html",
  ]);

  if (gazetteText) {
    const inlineStart = gazetteText.indexOf("<svg");
    const inlineEnd = gazetteText.lastIndexOf("</svg>");
    if (inlineStart !== -1 && inlineEnd !== -1) {
      const inlineLookup = extractPathsFromSvgText(gazetteText.slice(inlineStart, inlineEnd + 6));
      if (Object.keys(inlineLookup).length) return inlineLookup;
    }
  }

  const mapText = await fetchFirstText([
    "making-waste-visible/ri_municipalities.svg",
    "./making-waste-visible/ri_municipalities.svg",
    "ri_municipalities.svg",
  ]);
  return mapText ? extractPathsFromSvgText(mapText) : {};
}

function useMunicipalityPathLookup() {
  const [pathLookup, setPathLookup] = useState({});

  useEffect(() => {
    let cancelled = false;
    loadMunicipalityPathLookup().then(paths => {
      if (!cancelled) setPathLookup(paths);
    });
    return () => { cancelled = true; };
  }, []);

  return pathLookup;
}

function PatternImportDefs({ importedPattern, levelPatternSlots, levelInfo, data, variable, min, max, prefix }) {
  if (!importedPattern && !levelPatternSlots) return null;
  return (
    <>
      {data.map(m => {
        const t = normalise(getValue(m, variable), min, max);
        const levelSlot = getLevelPatternSlot(levelPatternSlots, m, levelInfo);
        const slot = levelSlot?.pattern || getPatternSlot(importedPattern, t);
        if (!slot) return null;
        const tile = Math.max(20, 72 - t * 44);
        const scale = levelSlot?.pattern ? levelSlot.scale : 1;
        const opacity = levelSlot?.pattern ? levelSlot.opacity / 100 : 0.22 + t * 0.78;
        return (
          <pattern key={m.name} id={`${prefix}-import-${cssId(m.name)}`}
            patternUnits="userSpaceOnUse" width={tile} height={tile}
            patternTransform={`scale(${scale})`}>
            <image href={slot.dataUrl} width={tile} height={tile}
              preserveAspectRatio="xMidYMid slice" opacity={opacity} />
          </pattern>
        );
      })}
    </>
  );
}

function MunicipalityFallback({ label = "Loading RI municipal paths..." }) {
  return (
    <svg viewBox={RI_MAP_VIEWBOX} style={{ width: "100%", height: "auto", display: "block" }}>
      <rect width="500.01" height="759.6" fill="#ffffff" />
      <text x="250" y="380" textAnchor="middle" fill="#666666" fontSize="12" fontFamily="monospace">
        {label}
      </text>
    </svg>
  );
}

// ── PATTERN GENERATOR ────────────────────────────────────────────────────────
function PatternMap({ data, palette, variable, onHover, hovered, pathLookup, importedPattern, levelPatternSlots, levelInfo }) {
  const vals = data.map(m => getValue(m, variable));
  const mn = vals.length ? Math.min(...vals) : 0, mx = vals.length ? Math.max(...vals) : 0;
  const stops = PALETTES.find(p => p.key === palette)?.stops || PALETTES[0].stops;
  const hasPaths = data.some(m => pathLookup[m.name]?.length);

  if (!hasPaths) return <MunicipalityFallback />;
  const allMunicipalityPaths = Object.entries(pathLookup).flatMap(([name, paths]) =>
    paths.map((d, index) => ({ name, d, index }))
  );

  return (
    <div>
      <svg id="pattern-map-svg" viewBox={RI_MAP_VIEWBOX} style={{ width: "100%", height: "auto", display: "block" }}>
        <rect width="500.01" height="759.6" fill="#ffffff" />
        {allMunicipalityPaths.map(({ name, d, index }) => (
          <path key={`base-${name}-${index}`} d={d} fill={BASE_MUNICIPAL_FILL} stroke={BASE_MUNICIPAL_STROKE}
            strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
        ))}
        <defs>
          <filter id="pattern-hover-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#333333" floodOpacity="0.28" />
          </filter>
          <PatternImportDefs importedPattern={importedPattern} levelPatternSlots={levelPatternSlots} levelInfo={levelInfo}
            data={data} variable={variable} min={mn} max={mx} prefix="pattern" />
          {data.map(m => (pathLookup[m.name] || []).map((d, index) => {
            const levelIndex = levelInfo.getLevel(m);
            const levelT = levelMidpoint(levelIndex);
            const levelSlot = getLevelPatternSlot(levelPatternSlots, m, levelInfo);
            const color = levelSlot?.color || interpolateColor(stops, levelT);
            const spacing = Math.max(4, 24 - levelT * 18);
            const lineWidth = 0.45 + levelT * 1.15;
            const id = `municipality-clip-${cssId(m.name)}-${index}`;
            const patternId = `woven-${cssId(m.name)}-${index}`;
            return (
              <g key={`${m.name}-${index}`}>
                <clipPath id={id}><path d={d} /></clipPath>
                <pattern id={patternId} patternUnits="userSpaceOnUse" width={spacing} height={spacing} patternTransform="rotate(0)">
                  <path d={`M0 ${spacing / 2} H${spacing}`} stroke={color} strokeWidth={lineWidth} opacity={0.85} />
                  {levelT > 0.28 && <path d={`M${spacing / 2} 0 V${spacing}`} stroke={color} strokeWidth={lineWidth * 0.8} opacity={Math.min(0.75, levelT)} />}
                  {levelT > 0.62 && <path d={`M0 0 L${spacing} ${spacing}`} stroke={color} strokeWidth={lineWidth * 0.6} opacity={Math.min(0.65, levelT)} />}
                </pattern>
              </g>
            );
          }))}
        </defs>
        {data.map(m => (pathLookup[m.name] || []).map((d, index) => {
          const levelIndex = levelInfo.getLevel(m);
          const levelT = levelMidpoint(levelIndex);
          const levelSlot = getLevelPatternSlot(levelPatternSlots, m, levelInfo);
          const color = levelSlot?.color || interpolateColor(stops, levelT);
          const isHov = hovered === m.name;
          const fill = levelSlot?.pattern || importedPattern ? `url(#pattern-import-${cssId(m.name)})` : `url(#woven-${cssId(m.name)}-${index})`;
          return (
            <g key={`${m.name}-${index}`} onMouseEnter={() => onHover(m.name)} onMouseLeave={() => onHover(null)}
              filter={isHov ? "url(#pattern-hover-glow)" : undefined}>
              <path d={d} fill={color} opacity={0.16 + levelT * 0.26} />
              <path d={d} fill={fill} clipPath={`url(#municipality-clip-${cssId(m.name)}-${index})`} />
              <path d={d} fill="none" stroke={isHov ? "#111111" : "#888888"}
                strokeWidth={isHov ? 1.5 : 0.75} vectorEffect="non-scaling-stroke" />
            </g>
          );
        }))}
        <text x="472" y="742" fontSize="11" fill="#8a8a8a" fontFamily="monospace" textAnchor="end">Rhode Island</text>
      </svg>
    </div>
  );
}

// ── CARTOGRAM ────────────────────────────────────────────────────────────────
function CartogramView({ data, palette, variable, onHover, hovered }) {
  const vals = data.map(m => getValue(m, variable));
  const mn = vals.length ? Math.min(...vals) : 0, mx = vals.length ? Math.max(...vals) : 0;
  const stops = PALETTES.find(p => p.key === palette)?.stops || PALETTES[0].stops;

  const maxR = 38, minR = 6;

  return (
    <svg id="cartogram-svg" viewBox="0 0 400 480" style={{ width: "100%", height: "auto" }}>
      <rect width="400" height="480" fill="#ffffff" />
      {data.map(m => {
        const val = getValue(m, variable);
        const t = normalise(val, mn, mx);
        const [cx, cy] = POSITIONS[m.name] || [200, 240];
        const r = minR + t * (maxR - minR);
        const color = interpolateColor(stops, t);
        const isHov = hovered === m.name;
        return (
          <g key={m.name} onMouseEnter={() => onHover(m.name)} onMouseLeave={() => onHover(null)}>
            <circle cx={cx} cy={cy} r={r} fill={color} opacity={isHov ? 1 : 0.82}
              stroke={isHov ? "#111111" : "none"} strokeWidth={isHov ? 1.5 : 0} />
            {r > 14 && (
              <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
                fontSize={Math.min(7, r * 0.45)} fill="#111111" fontFamily="monospace" fontWeight="bold">
                {m.name.length > 8 ? m.name.slice(0,7)+"…" : m.name}
              </text>
            )}
          </g>
        );
      })}
      {/* RI label */}
      <text x="370" y="470" fontSize="9" fill="#8a8a8a" fontFamily="monospace" textAnchor="end">Rhode Island</text>
    </svg>
  );
}

// ── CHOROPLETH ────────────────────────────────────────────────────────────────
function ChoroplethView({ data, palette, variable, onHover, hovered, pathLookup, importedPattern, levelPatternSlots, levelInfo }) {
  const vals = data.map(m => getValue(m, variable));
  const mn = vals.length ? Math.min(...vals) : 0, mx = vals.length ? Math.max(...vals) : 0;
  const stops = PALETTES.find(p => p.key === palette)?.stops || PALETTES[0].stops;
  const hasPaths = data.some(m => pathLookup[m.name]?.length);

  if (!hasPaths) return <MunicipalityFallback />;
  const allMunicipalityPaths = Object.entries(pathLookup).flatMap(([name, paths]) =>
    paths.map((d, index) => ({ name, d, index }))
  );

  return (
    <svg id="choropleth-map-svg" viewBox={RI_MAP_VIEWBOX} style={{ width: "100%", height: "auto", display: "block" }}>
      <rect width="500.01" height="759.6" fill="#ffffff" />
      {allMunicipalityPaths.map(({ name, d, index }) => (
        <path key={`base-${name}-${index}`} d={d} fill={BASE_MUNICIPAL_FILL} stroke={BASE_MUNICIPAL_STROKE}
          strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
      ))}
      <defs>
        <filter id="choropleth-hover-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="3" floodColor="#333333" floodOpacity="0.24" />
        </filter>
        <PatternImportDefs importedPattern={importedPattern} levelPatternSlots={levelPatternSlots} levelInfo={levelInfo}
          data={data} variable={variable} min={mn} max={mx} prefix="choro" />
      </defs>
      {data.map(m => (pathLookup[m.name] || []).map((d, index) => {
        const val = getValue(m, variable);
        const t = normalise(val, mn, mx);
        const levelIndex = levelInfo.getLevel(m);
        const levelT = levelMidpoint(levelIndex);
        const isHov = hovered === m.name;
        const levelSlot = getLevelPatternSlot(levelPatternSlots, m, levelInfo);
        const color = levelSlot?.color || interpolateColor(stops, levelT);
        const fill = levelSlot?.pattern || importedPattern ? `url(#choro-import-${cssId(m.name)})` : color;
        return (
          <path key={`${m.name}-${index}`} d={d} fill={fill}
            opacity={levelSlot?.pattern || importedPattern ? 0.35 + t * 0.65 : (isHov ? 1 : 0.9)}
            stroke={isHov ? "#111111" : "#888888"} strokeWidth={isHov ? 1.6 : 0.55}
            vectorEffect="non-scaling-stroke" filter={isHov ? "url(#choropleth-hover-glow)" : undefined}
            onMouseEnter={() => onHover(m.name)} onMouseLeave={() => onHover(null)} />
        );
      }))}
      <text x="472" y="742" fontSize="11" fill="#8a8a8a" fontFamily="monospace" textAnchor="end">Rhode Island</text>
    </svg>
  );
}

// ── BAR CHART ────────────────────────────────────────────────────────────────
function BarChart({ data, palette, variable }) {
  const vals = data.map(m => getValue(m, variable));
  const mx = vals.length ? Math.max(...vals) : 0;
  const stops = PALETTES.find(p => p.key === palette)?.stops || PALETTES[0].stops;
  const sorted = [...data].sort((a,b) => getValue(b,variable) - getValue(a,variable));
  const vari = VARIABLES.find(v => v.key === variable);
  const BAR_H = 13, GAP = 3, PAD_L = 108, PAD_R = 70, PAD_T = 10;
  const totalH = sorted.length * (BAR_H + GAP) + PAD_T + 10;
  const chartW = 520;

  return (
    <svg id="bar-chart-svg" viewBox={`0 0 ${chartW} ${totalH}`} style={{ width: "100%", height: "auto" }}>
      <rect width={chartW} height={totalH} fill="#ffffff" />
      {sorted.map((m, i) => {
        const val = getValue(m, variable);
        const t = normalise(val, 0, mx);
        const color = interpolateColor(stops, t);
        const bw = Math.max(2, t * (chartW - PAD_L - PAD_R));
        const y = PAD_T + i * (BAR_H + GAP);
        return (
          <g key={m.name}>
            <text x={PAD_L - 4} y={y + BAR_H/2 + 1} textAnchor="end"
              fontSize="7" fill="#333333" fontFamily="monospace" dominantBaseline="middle">
              {m.name.length > 14 ? m.name.slice(0,13)+"…" : m.name}
            </text>
            <rect x={PAD_L} y={y} width={bw} height={BAR_H} fill={color} rx={1} opacity={0.9} />
            <text x={PAD_L + bw + 4} y={y + BAR_H/2 + 1} fontSize="7"
              fill={color} fontFamily="monospace" dominantBaseline="middle">
              {fmtVal(val, vari?.unit || "")}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── LEGEND ────────────────────────────────────────────────────────────────────
function Legend({ palette, min, max, variable, importedPattern }) {
  const stops = PALETTES.find(p => p.key === palette)?.stops || PALETTES[0].stops;
  const vari = VARIABLES.find(v => v.key === variable);
  const steps = 80;
  if (importedPattern) {
    return (
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 9, color: "#555555", fontFamily: "monospace" }}>{fmtVal(min, vari?.unit || "")}</span>
        <div style={{ height: 14, flex: 1, display: "grid", gridTemplateColumns: `repeat(${PATTERN_SLOT_COUNT}, 1fr)`, gap: 2 }}>
          {Array.from({ length: PATTERN_SLOT_COUNT }).map((_, i) => {
            const slot = importedPattern.slots?.[i] || getPatternSlot(importedPattern, i / (PATTERN_SLOT_COUNT - 1));
            return (
              <div key={i} style={{
                borderRadius: 2, overflow: "hidden", border: "1px solid #d0d0d0",
                backgroundColor: "#f5f5f5",
                backgroundImage: slot ? `linear-gradient(90deg, rgba(5,5,5,${0.68 - i * 0.11}), rgba(5,5,5,0.04)), url(${slot.dataUrl})` : "none",
                backgroundSize: "auto, 34px 34px"
              }} />
            );
          })}
        </div>
        <span style={{ fontSize: 9, color: "#555555", fontFamily: "monospace" }}>{fmtVal(max, vari?.unit || "")}</span>
      </div>
    );
  }
  return (
    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 9, color: "#555555", fontFamily: "monospace" }}>{fmtVal(min, vari?.unit || "")}</span>
      <div style={{ position: "relative", height: 10, flex: 1, borderRadius: 3, overflow: "hidden" }}>
        <svg width="100%" height="10" preserveAspectRatio="none" viewBox={`0 0 ${steps} 10`}>
          {Array.from({length: steps}).map((_,i) => (
            <rect key={i} x={i} y={0} width={1.5} height={10}
              fill={interpolateColor(stops, i/steps)} />
          ))}
        </svg>
      </div>
      <span style={{ fontSize: 9, color: "#555555", fontFamily: "monospace" }}>{fmtVal(max, vari?.unit || "")}</span>
    </div>
  );
}

// ── TOOLTIP ───────────────────────────────────────────────────────────────────
function Tooltip({ name, variable }) {
  if (!name) return null;
  const m = MUNICIPALITIES.find(x => x.name === name);
  if (!m) return null;
  const cost = Math.round((m.rejected * m.hh / 2000) * 115);
  return (
    <div style={{
      background: "#f5f5f5", border: "1px solid #8a8a8a", borderRadius: 6, padding: "10px 14px",
      fontSize: 11, fontFamily: "monospace", color: "#222222", lineHeight: 1.7,
      position: "sticky", top: 0
    }}>
      <div style={{ fontWeight: "bold", color: "#111111", fontSize: 13, marginBottom: 6 }}>{name}</div>
      <div>Rejection rate: <span style={{color:"#333333"}}>{m.rejRate}%</span></div>
      <div>Rejected recycling: <span style={{color:"#333333"}}>{m.rejected} lbs/HH</span></div>
      <div>MRF recycling: <span style={{color:"#333333"}}>{m.mrf} lbs/HH</span></div>
      <div>Diversion rate: <span style={{color:"#333333"}}>{m.diversion}%</span></div>
      <div>Landfilled: <span style={{color:"#333333"}}>{m.landfilled} tons/HH</span></div>
      <div>HH served: <span style={{color:"#222222"}}>{m.hh.toLocaleString()}</span></div>
      <div style={{marginTop:6, borderTop:"1px solid #c8c8c8", paddingTop:6}}>
        Est. rejection cost: <span style={{color:"#111111", fontWeight:"bold"}}>${cost.toLocaleString()}</span>
      </div>
    </div>
  );
}

function LevelDistributionChart({ levelInfo, stops, splitMethod, setSplitMethod, levelPatternSlots }) {
  const maxCount = Math.max(...levelInfo.counts, 1);
  return (
    <div style={{
      width: 160, background: "#ffffff", border: "1px solid #d0d0d0", borderRadius: 4,
      padding: 8, fontFamily: "monospace", boxShadow: "0 6px 18px rgb(0 0 0 / 0.08)"
    }}>
      <div style={{ fontSize: 8, color: "#777777", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
        Level split
      </div>
      <div style={{ display: "flex", gap: 2, marginBottom: 7 }}>
        {["stddev", "quantile", "equal"].map(method => (
          <button key={method} onClick={() => setSplitMethod(method)} style={{
            flex: 1, padding: "2px 3px", fontSize: 7, cursor: "pointer", fontFamily: "monospace",
            textTransform: "uppercase", borderRadius: 3,
            background: splitMethod === method ? "#e5e5e5" : "#ffffff",
            color: splitMethod === method ? "#111111" : "#555555",
            border: "1px solid " + (splitMethod === method ? "#777777" : "#c8c8c8")
          }}>{method === "stddev" ? "Std" : method === "quantile" ? "Quant" : "Equal"}</button>
        ))}
      </div>
      {[4, 3, 2, 1, 0].map(levelIndex => {
        const count = levelInfo.counts[levelIndex] || 0;
        const color = levelPatternSlots[levelIndex]?.color || interpolateColor(stops, levelMidpoint(levelIndex));
        return (
          <div key={levelIndex} style={{ display: "grid", gridTemplateColumns: "38px 1fr 48px", gap: 5, alignItems: "center", marginTop: 4 }}>
            <span style={{ fontSize: 8, color: "#333333" }}>L{levelIndex + 1}</span>
            <div style={{ height: 7, background: "#eeeeee", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${(count / maxCount) * 100}%`, height: "100%", background: color }} />
            </div>
            <span style={{ fontSize: 8, color: "#555555", textAlign: "right" }}>{count} towns</span>
          </div>
        );
      })}
    </div>
  );
}

function LevelPatternDrawer({
  levelPatternSlots,
  setLevelPatternSlots,
  stops,
  variable,
  levelInfo,
}) {
  function importLevelPattern(levelIndex, file) {
    if (!file || !/\.(png|jpe?g|svg)$/i.test(file.name)) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLevelPatternSlots(prev => ({
        ...prev,
        [levelIndex]: {
          ...prev[levelIndex],
          pattern: { filename: file.name, dataUrl: reader.result },
        },
      }));
    };
    reader.readAsDataURL(file);
  }

  function updateLevel(levelIndex, patch) {
    setLevelPatternSlots(prev => ({
      ...prev,
      [levelIndex]: { ...prev[levelIndex], ...patch },
    }));
  }

  function resetLevel(levelIndex) {
    setLevelPatternSlots(prev => ({
      ...prev,
      [levelIndex]: { pattern: null, scale: 1, opacity: 100, color: null },
    }));
  }

  return (
      <aside style={{
        width: 360, flex: "0 0 360px", background: "#ffffff", borderLeft: "1px solid #c8c8c8",
        padding: "16px 14px 18px", fontFamily: "monospace", color: "#222222",
        overflowY: "auto", maxHeight: "calc(100vh - 160px)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 10 }}>
          <div>
            <div style={{ fontSize: 8, color: "#777777", textTransform: "uppercase", letterSpacing: 2 }}>Pattern levels</div>
            <div style={{ fontSize: 13, color: "#111111", fontWeight: "bold", marginTop: 3 }}>Customize contamination bands</div>
            <div style={{ fontSize: 8, color: "#777777", marginTop: 5, lineHeight: 1.45, maxWidth: 300 }}>
              Custom band colors and imported patterns only apply to Choropleth and Pattern maps.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[4, 3, 2, 1, 0].map(levelIndex => {
            const slot = levelPatternSlots[levelIndex];
            const defaultColor = interpolateColor(stops, levelMidpoint(levelIndex));
            const color = slot.color || defaultColor;
            const vari = VARIABLES.find(v => v.key === variable);
            return (
              <div key={levelIndex} style={{
                border: "1px solid #d0d0d0", borderRadius: 4, background: "#ffffff",
                padding: 8
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <label title={`Choose color for level ${levelIndex + 1}`} style={{
                    width: 16, height: 16, borderRadius: 2, background: color,
                    border: "1px solid #8a8a8a", flex: "0 0 auto", cursor: "pointer",
                    position: "relative", display: "block", boxShadow: "inset 0 0 0 1px rgb(255 250 240 / 0.45)"
                  }}>
                    <input type="color" value={colorToHex(color)}
                      onChange={e => updateLevel(levelIndex, { color: e.target.value })}
                      aria-label={`Choose color for level ${levelIndex + 1}`}
                      style={{
                        position: "absolute", inset: 0, width: "100%", height: "100%",
                        opacity: 0, cursor: "pointer", border: 0, padding: 0
                      }} />
                  </label>
                  <div style={{ width: 104, flex: "0 0 auto" }}>
                    <div style={{ fontSize: 10, color: "#222222", fontWeight: "bold" }}>Level {levelIndex + 1}</div>
                    <div style={{ fontSize: 8, color: "#666666" }}>{formatLevelRange(levelInfo.ranges[levelIndex], vari?.unit || "")}</div>
                  </div>
                  <div style={{
                    width: 28, height: 22, borderRadius: 2, border: "1px solid #b8b8b8",
                    background: slot.pattern ? `url(${slot.pattern.dataUrl}) center / cover` : "#f5f5f5",
                    boxShadow: "inset 0 0 0 1px #ffffff"
                  }} />
                  <label style={{
                    padding: "4px 5px", fontSize: 8, cursor: "pointer", letterSpacing: 1,
                    background: "#f5f5f5", color: "#333333", border: "1px solid #b8b8b8",
                    borderRadius: 3, textTransform: "uppercase", flex: "0 0 auto"
                  }}>
                    Import
                    <input type="file" accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
                      style={{ display: "none" }} onChange={e => {
                        importLevelPattern(levelIndex, e.target.files?.[0]);
                        e.target.value = "";
                      }} />
                  </label>
                  <div style={{ width: 42, flex: "0 0 auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "#555555" }}>
                      <span>Scale</span><span>{slot.scale}x</span>
                    </div>
                    <input type="range" min="0.25" max="4" step="0.25" value={slot.scale}
                      onChange={e => updateLevel(levelIndex, { scale: Number(e.target.value) })}
                      style={{ width: "100%" }} />
                  </div>
                  <div style={{ width: 48, flex: "0 0 auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "#555555" }}>
                      <span>Opacity</span><span>{slot.opacity}%</span>
                    </div>
                    <input type="range" min="0" max="100" step="1" value={slot.opacity}
                      onChange={e => updateLevel(levelIndex, { opacity: Number(e.target.value) })}
                      style={{ width: "100%" }} />
                  </div>
                  <button onClick={() => resetLevel(levelIndex)} aria-label={`Reset level ${levelIndex + 1}`} style={{
                    width: 22, height: 22, cursor: "pointer", background: "#ffffff", color: "#555555",
                    border: "1px solid #c8c8c8", borderRadius: 3, fontFamily: "monospace"
                  }}>x</button>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState("bar");
  const [variable, setVariable] = useState("rejRate");
  const [palette, setPalette] = useState("heat");
  const [importedPatterns, setImportedPatterns] = useState([]);
  const [levelPatternSlots, setLevelPatternSlots] = useState(DEFAULT_LEVEL_PATTERN_SLOTS);
  const [splitMethod, setSplitMethod] = useState("stddev");
  const [hovered, setHovered] = useState(null);
  const [search, setSearch] = useState("");
  const pathLookup = useMunicipalityPathLookup();

  const filtered = useMemo(() => {
    if (!search.trim()) return MUNICIPALITIES;
    return MUNICIPALITIES.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const vals = filtered.map(m => getValue(m, variable));
  const mn = vals.length ? Math.min(...vals) : 0, mx = vals.length ? Math.max(...vals) : 0;
  const curVari = VARIABLES.find(v => v.key === variable);
  const curPal = PALETTES.find(p => p.key === palette);
  const importedPattern = importedPatterns.find(p => p.key === palette) || null;
  const stops = curPal?.stops || PALETTES[0].stops;
  const levelInfo = useMemo(() => computeLevelInfo(MUNICIPALITIES, variable, splitMethod), [variable, splitMethod]);

  const SVG_IDS = { bar: "bar-chart-svg", choropleth: "choropleth-map-svg", cartogram: "cartogram-svg", pattern: "pattern-map-svg" };

  function getActiveSvgClone() {
    const svg = document.getElementById(SVG_IDS[mode]);
    if (!svg) return null;
    const clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.removeAttribute("id");
    return { svg, clone };
  }

  function downloadSvg() {
    const result = getActiveSvgClone();
    if (!result) return;
    const source = new XMLSerializer().serializeToString(result.clone);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ri-waste-${mode}-${variable}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function downloadPng() {
    const result = getActiveSvgClone();
    if (!result) return;
    const viewBox = result.svg.viewBox.baseVal;
    const width = viewBox?.width || 500;
    const height = viewBox?.height || 760;
    result.clone.setAttribute("width", width);
    result.clone.setAttribute("height", height);
    const source = new XMLSerializer().serializeToString(result.clone);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `ri-waste-${mode}-${variable}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#ffffff", color: "#222222",
      fontFamily: "'Courier New', monospace", display: "flex", flexDirection: "column"
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #d0d0d0", padding: "16px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 8
      }}>
        <div>
          <div style={{ fontSize: 10, color: "#777777", letterSpacing: 3, textTransform: "uppercase", marginBottom: 2 }}>
            Making Waste Visible · RISD 2025
          </div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: "bold", color: "#111111", letterSpacing: -0.5 }}>
            Rhode Island Waste Flow
          </h1>
          <div style={{ fontSize: 10, color: "#666666", marginTop: 2 }}>
            Source: RIRRC 2025 Municipal Data · 38 municipalities
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button onClick={downloadSvg} style={{
            padding: "6px 10px", fontSize: 9, cursor: "pointer", letterSpacing: 1,
            background: "#f5f5f5", color: "#111111", border: "1px solid #999999",
            borderRadius: 3, textTransform: "uppercase", fontFamily: "monospace"
          }}>
            Download SVG
          </button>
          <button onClick={downloadPng} style={{
            padding: "6px 10px", fontSize: 9, cursor: "pointer", letterSpacing: 1,
            background: "#f5f5f5", color: "#111111", border: "1px solid #999999",
            borderRadius: 3, textTransform: "uppercase", fontFamily: "monospace"
          }}>
            Download PNG
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        borderBottom: "1px solid #f5f5f5", padding: "10px 24px",
        display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center"
      }}>
        {/* View mode */}
        <div style={{ display: "flex", gap: 2 }}>
          {[
            { k: "bar",       label: "Bar Chart" },
            { k: "choropleth",label: "Choropleth" },
            { k: "cartogram", label: "Cartogram" },
            { k: "pattern",   label: "Pattern" },
          ].map(({ k, label }) => (
            <button key={k} onClick={() => setMode(k)} style={{
              padding: "4px 10px", fontSize: 10, cursor: "pointer", letterSpacing: 1,
              background: mode === k ? "#e5e5e5" : "#ffffff",
              color: mode === k ? "#111111" : "#666666",
              border: "1px solid " + (mode === k ? "#777777" : "#c8c8c8"),
              borderRadius: 3, textTransform: "uppercase", fontFamily: "monospace",
              transition: "all 0.15s"
            }}>{label}</button>
          ))}
        </div>

        {/* Variable */}
        <select value={variable} onChange={e => setVariable(e.target.value)} style={{
          background: "#f5f5f5", color: "#222222", border: "1px solid #c8c8c8",
          padding: "4px 8px", fontSize: 10, fontFamily: "monospace", borderRadius: 3, cursor: "pointer"
        }}>
          {VARIABLES.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
        </select>

        {/* Search */}
        <input placeholder="Search municipality…" value={search}
          onChange={e => setSearch(e.target.value)} style={{
            background: "#f5f5f5", color: "#222222", border: "1px solid #c8c8c8",
            padding: "4px 10px", fontSize: 10, fontFamily: "monospace", borderRadius: 3,
            outline: "none", width: 160
          }} />
      </div>

      {/* Palette row */}
      <div style={{
        borderBottom: "1px solid #f5f5f5", padding: "8px 24px",
        display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap"
      }}>
        <span style={{ fontSize: 9, color: "#777777", textTransform: "uppercase", letterSpacing: 2 }}>Palette</span>
        {PALETTES.map(p => (
          <button key={p.key} onClick={() => setPalette(p.key)} style={{
            display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
            background: palette === p.key ? "#d0d0d0" : "#ffffff",
            border: "1px solid " + (palette === p.key ? "#777777" : "#d0d0d0"),
            borderRadius: 4, padding: "3px 8px", fontFamily: "monospace", fontSize: 9, color: "#333333"
          }}>
            <div style={{ display: "flex", gap: 1 }}>
              {p.stops.map((c,i) => (
                <div key={i} style={{ width: 8, height: 8, background: c, borderRadius: 1 }} />
              ))}
            </div>
            {p.label}
          </button>
        ))}
        {importedPatterns.map(p => (
          <button key={p.key} onClick={() => setPalette(p.key)} style={{
            display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
            background: palette === p.key ? "#d0d0d0" : "#ffffff",
            border: "1px solid " + (palette === p.key ? "#666666" : "#d0d0d0"),
            borderRadius: 4, padding: "3px 8px", fontFamily: "monospace", fontSize: 9, color: "#333333",
            maxWidth: 230
          }}>
            <div style={{ display: "flex", gap: 1 }}>
              {Array.from({ length: PATTERN_SLOT_COUNT }).map((_, i) => {
                const slot = p.slots?.[i];
                return (
                  <div key={i} style={{
                    width: 10, height: 10, borderRadius: 1,
                    border: "1px solid " + (slot ? "#8a8a8a" : "#c0c0c0"),
                    background: slot ? `url(${slot.dataUrl}) center / cover` : "#eeeeee"
                  }} />
                );
              })}
            </div>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flex: 1, gap: 0 }}>
        {/* Viz panel */}
        <div style={{ flex: 1, padding: "16px 24px", minWidth: 0 }}>
          {curVari && (
            <div style={{ marginBottom: 10, fontSize: 10, color: "#666666" }}>
              <span style={{ color: "#333333" }}>{curVari.label}</span> — {curVari.desc}
            </div>
          )}

          {mode === "bar" && (
            <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 260px)" }}>
              <BarChart data={filtered} palette={palette} variable={variable} />
            </div>
          )}
          {mode === "choropleth" && (
            <ChoroplethView data={filtered} palette={palette} variable={variable}
              onHover={setHovered} hovered={hovered} pathLookup={pathLookup}
              importedPattern={importedPattern} levelPatternSlots={levelPatternSlots} levelInfo={levelInfo} />
          )}
          {mode === "cartogram" && (
            <CartogramView data={filtered} palette={palette} variable={variable}
              onHover={setHovered} hovered={hovered} />
          )}
          {mode === "pattern" && (
            <div>
              <div style={{ fontSize: 9, color: "#777777", marginBottom: 8, letterSpacing: 1 }}>
                TEXTILE PATTERN — line density encodes data value · exportable as visual reference
              </div>
              <PatternMap data={filtered} palette={palette} variable={variable}
                onHover={setHovered} hovered={hovered} pathLookup={pathLookup}
                importedPattern={importedPattern} levelPatternSlots={levelPatternSlots} levelInfo={levelInfo} />
            </div>
          )}

          <Legend palette={palette} min={mn} max={mx} variable={variable} importedPattern={importedPattern} />
        </div>

        {/* Sidebar */}
        <div style={{
          width: 200, borderLeft: "1px solid #f5f5f5", padding: "16px 12px",
          display: "flex", flexDirection: "column", gap: 10,
          overflowY: "auto", maxHeight: "calc(100vh - 160px)"
        }}>
          <LevelDistributionChart levelInfo={levelInfo} stops={stops}
            splitMethod={splitMethod} setSplitMethod={setSplitMethod}
            levelPatternSlots={levelPatternSlots} />

          {hovered
            ? <Tooltip name={hovered} variable={variable} />
            : (
              <div style={{ fontSize: 9, color: "#8a8a8a", textAlign: "center", marginTop: 20, lineHeight: 1.8 }}>
                Hover a town<br/>to see details
              </div>
            )
          }

          {/* Top 5 worst */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 8, color: "#777777", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
              Worst 5
            </div>
            {[...MUNICIPALITIES].sort((a,b) => getValue(b,variable) - getValue(a,variable)).slice(0,5).map((m,i) => {
              const val = getValue(m, variable);
              const t = normalise(val, mn, mx);
              const color = interpolateColor(stops, t);
              return (
                <div key={m.name} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "4px 0", borderBottom: "1px solid #f5f5f5", fontSize: 9
                }}>
                  <span style={{ color: "#333333" }}>{i+1}. {m.name.length > 11 ? m.name.slice(0,10)+"…" : m.name}</span>
                  <span style={{ color: "#111111", fontWeight: "bold" }}>{fmtVal(val, curVari?.unit||"")}</span>
                </div>
              );
            })}
          </div>

          {/* Top 5 best */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 8, color: "#777777", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
              Best 5
            </div>
            {[...MUNICIPALITIES].sort((a,b) => getValue(a,variable) - getValue(b,variable)).slice(0,5).map((m,i) => {
              const val = getValue(m, variable);
              const t = normalise(val, mn, mx);
              const color = interpolateColor(stops, t);
              return (
                <div key={m.name} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "4px 0", borderBottom: "1px solid #f5f5f5", fontSize: 9
                }}>
                  <span style={{ color: "#333333" }}>{i+1}. {m.name.length > 11 ? m.name.slice(0,10)+"…" : m.name}</span>
                  <span style={{ color: "#111111", fontWeight: "bold" }}>{fmtVal(val, curVari?.unit||"")}</span>
                </div>
              );
            })}
          </div>

          {/* State avg */}
          <div style={{ marginTop: 8, padding: "8px", background: "#ffffff", borderRadius: 4, border: "1px solid #d0d0d0" }}>
            <div style={{ fontSize: 8, color: "#777777", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>State avg</div>
            <div style={{ fontSize: 13, fontWeight: "bold", color: "#111111" }}>
              {fmtVal(vals.length ? parseFloat((vals.reduce((a,b) => a+b,0) / vals.length).toFixed(1)) : 0, curVari?.unit||"")}
            </div>
          </div>
        </div>
        <LevelPatternDrawer
          levelPatternSlots={levelPatternSlots}
          setLevelPatternSlots={setLevelPatternSlots}
          stops={stops}
          variable={variable}
          levelInfo={levelInfo}
        />
      </div>
    </div>
  );
}
