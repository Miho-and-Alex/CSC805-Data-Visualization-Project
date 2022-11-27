import * as d3 from 'https://cdn.skypack.dev/d3@7'
import { selectAll } from 'https://cdn.skypack.dev/d3-selection@3'

  let cx = 100, cy = 100 
  const MARGIN = { LEFT: 0, RIGHT: 0, TOP: 0, BOTTOM: 0 }
  const WIDTH = 450 - MARGIN.LEFT - MARGIN.RIGHT
  const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM


let radius = 100
let rings = [1, 2, 3, 4, 5]
let ringScale = d3.scaleLinear().domain([0, rings.length]).range([0, radius])
let ringColors = ['darkorange', 'gray', 'navy', 'blue', 'green']

const svg = d3
  .select('#radar-chart-area')
  .append('svg')
  .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

svg
  .selectAll('circle')
  .data(rings)
  .join('circle')
  .attr('cx', cx)
  .attr('cy', cy)
  .attr('stroke', ring => ring)
  .attr(
    'r',
    ring =>ringScale(ring)
  )
