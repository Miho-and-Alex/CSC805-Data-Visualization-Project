import * as d3 from "https://cdn.skypack.dev/d3@7";

d3.select("#bar-chart-icon").on("click", () => {
  document.getElementById("nav-barchart-tab").click()
});

d3.select("#scatter-plot-icon").on("click", () => {
  document.getElementById("nav-scatterplot-tab").click()
});

d3.select("#circle-packing-icon").on("click", () => {
  document.getElementById("nav-circlepacking-tab").click()
});
