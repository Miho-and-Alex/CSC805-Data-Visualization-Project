import * as d3 from 'https://cdn.skypack.dev/d3@7'
import { selectAll } from 'https://cdn.skypack.dev/d3-selection@3'

async function getCsvData(path) {
  let arrData = []
  await d3.csv(path, function (data) {
    //arrData.push(data)
    arrData = data
  })
  return arrData
}

function lineChart() {
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom

  // append the svg object to the body of the page
  var svg = d3
    .select('#my_dataviz')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  let data = getCsvData('./songs_normalize.csv')
  //Read the data
  // d3.csv('songs_normalize.csv', function (data) {
  // Add X axis --> it is a date format
  var x = d3.scaleLinear().domain([2000, 2022]).range([0, width])
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x))

  // Add Y axis
  var y = d3.scaleLinear().domain([-100, 100]).range([height, 0])
  svg.append('g').call(d3.axisLeft(y))

  // Show confidence interval
  svg
    .append('path')
    .datum(data)
    .attr('fill', '#cce5df')
    .attr('stroke', 'none')
    .attr(
      'd',
      d3
        .area()
        .x(function (d) {
          return x(d.year)
        })
        .y0(function (d) {
          return y(d.CI_right)
        })
        .y1(function (d) {
          return y(d.CI_left)
        })
    )

  // Add the line
  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr(
      'd',
      d3
        .line()
        .x(function (d) {
          return x(d.year)
        })
        .y(function (d) {
          return y(d.popularity)
        })
    )
}

let run = async () => {
  let data = await getCsvData('./songs_normalize.csv')
  console.log(data)

  lineChart()

  //d3.select("body").append()
}

run()
