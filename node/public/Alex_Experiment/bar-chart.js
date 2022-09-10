import * as d3 from "https://cdn.skypack.dev/d3@7"
import { selectAll } from "https://cdn.skypack.dev/d3-selection@3"

d3.csv("songs_normalize.csv", function (data) {
  for (var i = 0; i < data.length; i++) {
    console.log(data[i].Song)
    console.log(data[i].Artist)
  }
})


var width = 500;
var height = 500;

//Create SVG element
var svg = d3.select("body")
.append("svg")
.attr("width", width)
.attr("height", height);

//Create line element inside SVG
svg.append("line")
   .attr("x1", 100)
   .attr("x2", 500)
   .attr("y1", 50)
   .attr("y2", 50)
   .attr("stroke", "black")