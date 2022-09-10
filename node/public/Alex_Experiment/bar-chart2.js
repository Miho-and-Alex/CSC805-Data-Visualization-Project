import * as d3 from "https://cdn.skypack.dev/d3@7"
import { selectAll } from "https://cdn.skypack.dev/d3-selection@3"

let run = async () => {
  let arrData = []
  await d3.csv("songs_normalize.csv", function (data) {
    arrData.push(data.artist)
  })

    console.log(arrData)

  let data = [4, 8, 15, 16, 23, 42]
  function barChart() {
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

    return div.node()
  }

  d3.select("body").append(barChart)
}

run()