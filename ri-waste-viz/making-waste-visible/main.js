import { loadWasteData, MODE_CONFIG, formatValue } from "./data.js";
import { createMap } from "./map.js";
import { createFlowSystem } from "./flow.js";
import { createUi } from "./ui.js";

const svg = document.getElementById("waste-map");
const tooltip = document.getElementById("tooltip");
const status = document.getElementById("map-status");

let activeMode = "landfill";
let activeTown = null;
let pinnedTown = null;

boot();

async function boot() {
  try {
    const dataset = await loadWasteData();
    const modeColor = (mode) => `var(--${mode})`;
    const map = createMap(svg, dataset.towns, {
      onTownEnter: (town, event) => {
        if (pinnedTown && pinnedTown !== town.town) {
          return;
        }

        showTownState(town, event);
      },
      onTownMove: (town, event) => {
        if (activeTown === town.town) {
          positionTooltip(event);
        }
      },
      onTownLeave: () => {
        if (!pinnedTown) {
          clearTownState();
        }
      },
      onTownClick: (town, event) => {
        if (pinnedTown === town.town) {
          pinnedTown = null;
          clearTownState();
          return;
        }

        pinnedTown = town.town;
        showTownState(town, event);
      },
      onCenterEnter: (event) => {
        tooltip.innerHTML = `
          <p class="tooltip__title">Johnston</p>
          <p class="tooltip__value">Landfill &amp; Recycle Center</p>
          <p class="tooltip__note">Destination node for all visible municipal routes.</p>
        `;
        tooltip.hidden = false;
        positionTooltip(event, event.currentTarget);
      },
      onCenterMove: (event) => {
        positionTooltip(event, event.currentTarget);
      },
      onCenterLeave: () => {
        if (!activeTown) {
          tooltip.hidden = true;
        }
      },
    });

    const flow = createFlowSystem(map.flowRoot, dataset.towns);
    const ui = createUi({
      onModeChange: (mode) => {
        activeMode = mode;
        flow.setMode(mode);
        ui.setMode(mode);

        if (activeTown) {
          const town = dataset.towns.find((entry) => entry.town === activeTown);

          if (town) {
            showTownState(town);
          }
        }
      },
      summary: dataset.summary,
      source: dataset.source,
      sourceLastUpdated: dataset.sourceLastUpdated,
    });

    ui.setMode(activeMode);
    ui.resetActiveTown();
    flow.setMode(activeMode);
    map.setSelectedTown(null);
    status.hidden = true;

    const animate = (time) => {
      flow.animate(time);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    document.addEventListener("pointerdown", (event) => {
      if (svg.contains(event.target)) {
        return;
      }

      pinnedTown = null;
      clearTownState();
    });

    function showTownState(town, event) {
      activeTown = town.town;

      map.setHoveredTown(town.town, modeColor(activeMode));
      map.setSelectedTown(pinnedTown);
      flow.setHoveredTown(town.town);
      ui.setActiveTown({
        townName: town.town,
        valueText: formatValue(activeMode, town.values[activeMode]),
        note: MODE_CONFIG[activeMode].description,
      });

      tooltip.innerHTML = `
        <p class="tooltip__title">${town.town}</p>
        <p class="tooltip__value">${formatValue(activeMode, town.values[activeMode])}</p>
        <p class="tooltip__note">${MODE_CONFIG[activeMode].description}</p>
      `;
      tooltip.hidden = false;

      if (event) {
        positionTooltip(event, event.currentTarget);
      } else {
        const townNode = svg.querySelector(`[data-town="${CSS.escape(town.town)}"]`);

        if (townNode) {
          positionTooltip(null, townNode);
        }
      }
    }

    function clearTownState() {
      activeTown = null;
      map.setHoveredTown(null);
      map.setSelectedTown(pinnedTown);
      flow.setHoveredTown(null);
      ui.resetActiveTown();
      tooltip.hidden = true;
    }
  } catch (error) {
    console.error(error);
    status.textContent =
      "Unable to load the municipal waste dataset. Serve the site from the project root so /data/… can be fetched.";
  }
}

function positionTooltip(event, fallbackElement = null) {
  const frame = svg.parentElement.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const reference = getReferencePoint(event, fallbackElement, frame);
  const x = clamp(
    reference.x - frame.left + 18,
    12,
    frame.width - tooltipRect.width - 12,
  );
  const y = clamp(
    reference.y - frame.top - tooltipRect.height - 14,
    12,
    frame.height - tooltipRect.height - 12,
  );

  tooltip.style.transform = `translate(${x}px, ${y}px)`;
}

function getReferencePoint(event, fallbackElement, frame) {
  if (event?.clientX && event?.clientY) {
    return { x: event.clientX, y: event.clientY };
  }

  if (fallbackElement?.getBoundingClientRect) {
    const rect = fallbackElement.getBoundingClientRect();

    return {
      x: rect.left + rect.width * 0.5,
      y: rect.top + rect.height * 0.5,
    };
  }

  return {
    x: frame.left + frame.width * 0.5,
    y: frame.top + frame.height * 0.5,
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
