/*
  Swap in the full Rhode Island dataset by replacing /data/ri_municipal_waste_2024.json
  with a file that keeps the same town names and metric keys used below.
*/

export const MODE_CONFIG = {
  landfill: {
    key: "trash_landfilled_tons_per_hh",
    label: "Landfill",
    description: "tons landfilled per household",
    summaryLabel: "Average tons landfilled per household",
    unitSuffix: "tons / hh",
  },
  recycling: {
    key: "mrf_recycling_lbs_per_hh",
    label: "Recycling",
    description: "pounds of MRF recycling per household",
    summaryLabel: "Average pounds recycled per household",
    unitSuffix: "lbs / hh",
  },
  rejected: {
    key: "rejected_recycling_lbs_per_hh",
    label: "Rejected recycling",
    description: "pounds of rejected recycling per household",
    summaryLabel: "Average pounds rejected per household",
    unitSuffix: "lbs / hh",
  },
};

const DATA_PATHS = [
  "../data/ri_municipal_waste_2024.json",
  "/data/ri_municipal_waste_2024.json",
  "./data/ri_municipal_waste_2024.json",
];

export async function loadWasteData() {
  const response = await fetchDataset();
  const raw = await response.json();
  const rows = Array.isArray(raw) ? raw : raw.towns ?? [];

  const towns = rows
    .filter((row) => row?.town && !/average/i.test(row.town))
    .map((row) => {
      const values = Object.fromEntries(
        Object.entries(MODE_CONFIG).map(([mode, config]) => [
          mode,
          Number(row[config.key]),
        ]),
      );

      return {
        town: row.town,
        values,
        normalized: {},
        routeCount: {},
      };
    });

  for (const [mode, config] of Object.entries(MODE_CONFIG)) {
    const values = towns
      .map((town) => town.values[mode])
      .filter((value) => Number.isFinite(value));
    const min = Math.min(...values);
    const max = Math.max(...values);

    towns.forEach((town) => {
      const value = town.values[mode];
      const normalized = max === min ? 0.5 : (value - min) / (max - min);
      town.normalized[mode] = normalized;
      town.routeCount[mode] = Math.round(6 + normalized * 49); // 6–55 range per spec
    });
  }

  const summary = Object.fromEntries(
    Object.entries(MODE_CONFIG).map(([mode]) => {
      const average =
        towns.reduce((sum, town) => sum + town.values[mode], 0) / towns.length;

      return [mode, average];
    }),
  );

  return {
    towns,
    source: raw.source ?? "Rhode Island municipal waste dataset",
    sourceLastUpdated: raw.source_last_updated ?? "Unknown",
    summary,
  };
}

async function fetchDataset() {
  let lastError;

  for (const path of DATA_PATHS) {
    try {
      const response = await fetch(path);

      if (response.ok) {
        return response;
      }

      lastError = new Error(`Fetch failed for ${path}: ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Unable to load waste dataset.");
}

export function formatValue(mode, value) {
  if (!Number.isFinite(value)) {
    return "No data";
  }

  if (mode === "landfill") {
    return `${value.toFixed(2)} tons per household`;
  }

  return `${Math.round(value).toLocaleString()} pounds per household`;
}

export function formatSummaryValue(mode, value) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  if (mode === "landfill") {
    return value.toFixed(2);
  }

  return Math.round(value).toLocaleString();
}
