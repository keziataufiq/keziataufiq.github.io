// Data path
const DATA_URL = "dataset/videogames_wide.csv";

/* elper so charts resize reliably */
function embedStable(target, spec) {
  return vegaEmbed(target, spec, { actions: false, renderer: "canvas" })
    .then(({ view }) => {
      view.resize();
      window.addEventListener("load", () => view.resize());
      window.addEventListener("resize", () => view.resize());
      return view;
    })
    .catch(err => console.error(`[A3] Failed ${target}:`, err));
}

window.addEventListener("DOMContentLoaded", () => {
  // Vis 1
  embedStable("#vis1", 
    {
    $schema: "https://vega.github.io/schema/vega-lite/v6.json",
    description: "Sum of Global Sales by Genre and Platform.",
    data: { url: DATA_URL },
    transform: [
      {
        aggregate: [{ op: "sum", field: "Global_Sales", as: "TotalSales" }],
        groupby: ["Genre", "Platform"]
      }
    ],
    mark: "bar",
    encoding: {
      x: { field: "Genre", type: "nominal", title: "Genre", axis: { labelAngle: -30 } },
      y: { field: "TotalSales", type: "quantitative", title: "Global Sales (millions of units)" },
      color: { field: "Platform", type: "nominal", title: "Platform", legend: { columns: 2 } },
      xOffset: { field: "Platform" },
      tooltip: [
        { field: "Genre" },
        { field: "Platform" },
        { field: "TotalSales", type: "quantitative", format: ".2f", title: "Global Sales (M)" }
      ],      
    },
    width: 700,
    height: 320
  });

// Vis 2
embedStable("#vis2", {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Sales over time, faceted by Genre; line color = Platform.",
  data: { url: DATA_URL },
  transform: [
    { filter: "isValid(datum.Year)" },
    { calculate: "toNumber(datum.Year)", as: "YearNum" },
    {
      aggregate: [{ op: "sum", field: "Global_Sales", as: "GlobalSales" }],
      groupby: ["Genre", "Platform", "YearNum"]
    }
  ],
  facet: {
    row: { field: "Genre", type: "nominal", header: { title: "Sales Over Time by Genre" } }
  },

  spec: {
    mark: { type: "line", interpolate: "monotone" },
    encoding: {
      x: { field: "YearNum", type: "quantitative", title: "Year" },
      y: { field: "GlobalSales", type: "quantitative", title: "Global Sales (millions of units)" },
      color: { field: "Platform", type: "nominal", title: "Platform", legend: { columns: 2 } },
      tooltip: [
        { field: "Genre" },
        { field: "Platform" },
        { field: "YearNum", type: "quantitative", title: "Year" },
        { field: "GlobalSales", type: "quantitative", format: ".2f", title: "Global Sales (M)" }
      ]
    },
    width: 700,                    
    height: 140
  },
  resolve: { scale: { x: "independent", y: "independent" } }, 
  autosize: { type: "fit", contains: "padding" }             
});

  // Vis 3
  embedStable("#vis3", 
    {
    $schema: "https://vega.github.io/schema/vega-lite/v6.json",
    description: "Compare NA/EU/JP/Other sales across platforms (grouped bars).",
    data: { url: DATA_URL },
    transform: [
      { fold: ["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"], as: ["Region", "Sales"] },
      { aggregate: [{ op: "sum", field: "Sales", as: "Total" }], groupby: ["Platform", "Region"] },
      { joinaggregate: [{ op: "sum", field: "Total", as: "PlatformTotal" }], groupby: ["Platform"] }
    ],
    mark: "bar",
    encoding: {
      x: {
        field: "Platform",
        type: "nominal",
        axis: { labelAngle: -45 },
        sort: { field: "PlatformTotal", order: "descending" },
        title: "Platform"
      },
      y: { field: "Total", type: "quantitative", title: "Sales (millions of units)" },
      xOffset: { field: "Region" },
      color: { field: "Region", type: "nominal", title: "Region" },
      tooltip: [
        { field: "Platform" },
        { field: "Region" },
        { field: "Total", type: "quantitative", format: ".2f", title: "Sales (M)" }
      ]
    },
    width: 700,
    height: 340
  });

  // Vis 4
  embedStable("#vis4", 
    {
    $schema: "https://vega.github.io/schema/vega-lite/v6.json",
    description: "For each Genre, what share of sales occurs in each Region (NA/EU/JP/Other)?",
    data: { url: DATA_URL },
    transform: [
      { fold: ["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"], as: ["Region", "Sales"] },
      { aggregate: [{ op: "sum", field: "Sales", as: "RegionSales" }], groupby: ["Genre", "Region"] },
      { joinaggregate: [{ op: "sum", field: "RegionSales", as: "GenreTotal" }], groupby: ["Genre"] },
      { calculate: "datum.GenreTotal>0 ? datum.RegionSales/datum.GenreTotal : 0", as: "Share" }
    ],
    mark: "rect",
    encoding: {
      y: { field: "Region", type: "nominal", title: "Region" },
      x: { field: "Genre", type: "nominal", title: "Genre" },
      color: {
        field: "Share",
        type: "quantitative",
        title: "Share of Genre",
        format: ".0%",
        scale: { scheme: "blues" }
      },
      tooltip: [
        { field: "Genre" },
        { field: "Region" },
        { field: "RegionSales", type: "quantitative", format: ".2f", title: "Sales (millions of units)" },
        { field: "Share", type: "quantitative", format: ".0%", title: "Share of Genre" }
      ]
    },
    width: 700,
    height: 180
  });
});
