/* Tools in Practice: category filters */
(() => {
  "use strict";
  const root = document.getElementById("tools");
  if (!root) return;
  const filters = Array.from(root.querySelectorAll("[data-tool-filter]"));
  const clusters = Array.from(root.querySelectorAll("[data-tool-cluster]"));
  const status = root.querySelector("#tool-filter-status");
  if (!filters.length || !clusters.length) return;
  const labels = {
    analytics: "operations and analytics tools",
    research: "AI and research tools",
    communication: "communication and learning platforms",
    digital: "digital build and publishing tools",
    exploration: "workflow experiments and career platforms"
  };
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.toolFilter || "all";
      filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      clusters.forEach((cluster) => {
        cluster.hidden = selected !== "all" && cluster.dataset.toolCluster !== selected;
      });
      if (status) {
        status.textContent = selected === "all"
          ? "Showing all five tool groups."
          : "Showing " + (labels[selected] || "selected tools") + ".";
      }
    });
  });
})();