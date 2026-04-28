import { CENTER_NODE, TOWN_POSITIONS, svgEl } from "./map.js";

// Triangle size scaled for the 0–500 coordinate space (was 0–920)
const TRIANGLE_POINTS = "-2.4,-1.4 1.4,0 -2.4,1.4";

export function createFlowSystem(flowRoot, towns) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const modeLayers = new Map();
  const routesByMode = new Map();
  let activeMode = "landfill";
  let hoveredTown = null;

  ["landfill", "recycling", "rejected"].forEach((mode) => {
    const layer = svgEl("g", {
      class: `mode-layer mode-layer--${mode}`,
    });
    const routes = new Map();

    towns.forEach((town) => {
      const start = TOWN_POSITIONS[town.town];

      if (!start) {
        return;
      }

      const pathD = createRoutePath(start, CENTER_NODE, town.town === "Johnston");
      const routeGroup = svgEl("g", {
        class: `route-group${town.town === "Johnston" ? " is-town-self" : ""}`,
        "data-town": town.town,
      });
      const path = svgEl("path", {
        class: "route-line",
        d: pathD,
      });

      routeGroup.append(path);

      const markers = Array.from({ length: town.routeCount[mode] }, (_, index) => {
        const triangle = svgEl("polygon", {
          class: "route-mark",
          points: TRIANGLE_POINTS,
        });
        routeGroup.append(triangle);

        return {
          element: triangle,
          offset: index / town.routeCount[mode],
        };
      });

      routes.set(town.town, {
        town,
        group: routeGroup,
        path,
        markers,
        length: 0,
      });

      layer.append(routeGroup);
    });

    flowRoot.append(layer);
    modeLayers.set(mode, layer);
    routesByMode.set(mode, routes);
  });

  routesByMode.forEach((routes) => {
    routes.forEach((route) => {
      route.length = route.path.getTotalLength();
    });
  });

  applyMode(activeMode);

  return {
    setMode(mode) {
      applyMode(mode);
    },
    setHoveredTown(townName) {
      hoveredTown = townName;
      updateHoveredRoute();
    },
    animate(time) {
      const phase = prefersReducedMotion ? 0.14 : (time * 0.000028) % 1;

      routesByMode.forEach((routes, mode) => {
        routes.forEach((route) => {
          const speed = 0.75 + route.town.normalized[mode] * 0.5;

          route.markers.forEach((marker, index) => {
            const travel = (marker.offset + phase * speed) % 1;
            const distance = travel * route.length;
            const point = route.path.getPointAtLength(distance);
            const nextPoint = route.path.getPointAtLength(
              Math.min(route.length, distance + 3),
            );
            const angle =
              (Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180) /
              Math.PI;
            const scale = 0.8 + route.town.normalized[mode] * 0.55;
            const opacityJitter = 0.7 + ((index % 5) / 10);

            marker.element.setAttribute(
              "transform",
              `translate(${point.x} ${point.y}) rotate(${angle}) scale(${scale})`,
            );
            marker.element.style.opacity = `${0.16 + opacityJitter * 0.16}`;
          });
        });
      });
    },
  };

  function updateHoveredRoute() {
    modeLayers.forEach((layer, mode) => {
      const routes = routesByMode.get(mode);
      const isActiveLayer = mode === activeMode;

      layer.classList.toggle("is-hovering", Boolean(hoveredTown) && isActiveLayer);

      routes.forEach((route, townName) => {
        route.group.classList.toggle(
          "is-hovered",
          Boolean(hoveredTown) && isActiveLayer && townName === hoveredTown,
        );
      });
    });
  }

  function applyMode(mode) {
    activeMode = mode;

    modeLayers.forEach((layer, key) => {
      layer.classList.toggle("is-active", key === mode);
    });

    updateHoveredRoute();
  }
}

function createRoutePath(start, end, isShortRoute = false) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);
  const bendStrength = isShortRoute ? 6 : Math.min(40, Math.max(11, distance * 0.11));
  const midpoint = { x: start.x + dx * 0.5, y: start.y + dy * 0.5 };
  const normal = normalize({ x: -dy, y: dx });
  const direction = start.x < end.x ? 1 : -1;
  const control = {
    x: midpoint.x + normal.x * bendStrength * direction,
    y: midpoint.y + normal.y * bendStrength * direction,
  };

  return `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
}

function normalize(vector) {
  const length = Math.hypot(vector.x, vector.y) || 1;

  return {
    x: vector.x / length,
    y: vector.y / length,
  };
}
