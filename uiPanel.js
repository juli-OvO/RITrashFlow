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
