import { MODE_CONFIG, formatSummaryValue } from "./data.js";

export function createUi({ onModeChange, summary, source, sourceLastUpdated }) {
  const modeContainer    = document.getElementById("mode-toggles");
  const summaryContainer = document.getElementById("summary-list");
  const activeTownEl     = document.getElementById("active-town");
  const sourceDataset    = document.getElementById("source-dataset");
  const sourceUpdated    = document.getElementById("source-updated");
  const mapSourceEl      = document.getElementById("map-source");
  const timestampEl      = document.getElementById("timestamp-value");

  const pills        = new Map();
  const summaryItems = new Map();

  // Build pill buttons for mode selection
  Object.entries(MODE_CONFIG).forEach(([mode, config]) => {
    const pill = document.createElement("button");
    pill.type      = "button";
    pill.className = `mode-pill mode-pill--${mode}`;

    const iconHtml =
      mode === "landfill"
        ? `<span class="mode-pill__icon mode-pill__icon--dot" aria-hidden="true"></span>`
        : `<span class="mode-pill__icon mode-pill__icon--tri" aria-hidden="true"></span>`;

    pill.innerHTML = `${iconHtml}<span class="mode-pill__label">${config.label}</span>`;
    pill.addEventListener("click", () => onModeChange(mode));
    modeContainer.append(pill);
    pills.set(mode, pill);

    // Stats with per-mode border color class
    const item = document.createElement("div");
    item.className = `summary-item summary-item--${mode}`;
    item.innerHTML = `
      <p class="summary-item__value">${formatSummaryValue(mode, summary[mode])}</p>
      <p class="summary-item__label">${config.summaryLabel}</p>
    `;
    summaryContainer.append(item);
    summaryItems.set(mode, item);
  });

  // Source annotation at base of map
  sourceDataset.textContent = `Dataset: ${source}`;
  sourceUpdated.textContent = `Updated: ${sourceLastUpdated}`;
  mapSourceEl.hidden = false;

  // Running clock
  renderTimestamp();
  setInterval(renderTimestamp, 1000);

  function renderTimestamp() {
    const now  = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour:   "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const mm   = String(now.getMonth() + 1).padStart(2, "0");
    const dd   = String(now.getDate()).padStart(2, "0");
    const yyyy = now.getFullYear();
    timestampEl.textContent = `${time}\n${mm} / ${dd} / ${yyyy}`;
  }

  return {
    setMode(mode) {
      pills.forEach((pill, key) => {
        pill.classList.toggle("is-active", key === mode);
      });
    },

    setActiveTown({ townName, valueText, note }) {
      activeTownEl.innerHTML = `
        <p class="active-town__name">${townName}</p>
        <p class="active-town__value">${valueText}${note ? `<br><span>${note}</span>` : ""}</p>
      `;
    },

    resetActiveTown() {
      activeTownEl.innerHTML = `
        <p class="active-town__name">—</p>
        <p class="active-town__value">Hover a node to inspect its route.</p>
      `;
    },
  };
}
