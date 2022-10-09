import * as d3 from "https://cdn.skypack.dev/d3@7";
import { selectAll } from "https://cdn.skypack.dev/d3-selection@3";

async function getCsvData(path) {
  let arrData = [];
  await d3.csv(path, function (data) {
    arrData.push(data);
  });
  return arrData;
}

function lineChart() {
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  d3.csv(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_IC.csv",
    function (data) {
      // Add X axis --> it is a date format
      var x = d3.scaleLinear().domain([1, 100]).range([0, width]);
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    }
  );
}

let run = async () => {
  let data = await getCsvData("songs_normalize.csv");
  console.log(data);

  //d3.select("body").append()
};

run();
