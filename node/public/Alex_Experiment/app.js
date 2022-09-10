import * as d3 from "https://cdn.skypack.dev/d3@7"
import { selectAll } from "https://cdn.skypack.dev/d3-selection@3"

// Import the data
d3.csv("songs_normalize.csv", function (data) {
  for (var i = 0; i < data.length; i++) {
    console.log(data[i].Song)
    console.log(data[i].Artist)
  }
})

let data = [4, 8, 15, 16, 23, 42]

const div = d3
  .create("div")
  .style("font", "10px sans-serif")
  .style("text-align", "right")
  .style("color", "white")

div
  .selectAll("div")
  .data(data)
  .join("div")
  .style("background", "steelblue")
  .style("padding", "3px")
  .style("margin", "1px")
  .style("width", (d) => `${d * 10}px`)
  .text((d) => d)