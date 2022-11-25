import * as d3 from 'https://cdn.skypack.dev/d3@7'
import { selectAll } from 'https://cdn.skypack.dev/d3-selection@3'

export function starPlot(data, cx, cy) {
  const MARGIN = { LEFT: 0, RIGHT: 0, TOP: 0, BOTTOM: 0 }
  const WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT
  const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

  const svg = d3
    .select('#starplot-' + data.index)
    .append('svg')
    .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

  const g = svg
    .append('g')
    .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

  // Can append the radar chart below

  let radialScale = d3.scaleLinear().domain([0, 10]).range([0, 150])
  let ticks = [2, 4, 6, 8, 10]

  // adding rings
  ticks.forEach(t =>
    g
      .append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('fill', 'none')
      .attr('stroke', 'gray')
      .attr('r', radialScale(t))
  )

  // labels for rings
  ticks.forEach(t =>
    g
      .append('text')
      .attr('x', cx)
      .attr('y', cy - radialScale(t))
      .text(t.toString())
  )

  function angleToCoordinate2(angle, value, column) {
    // need new scale for each column

    let radialScale = d3
      .scaleLinear()
      .domain([d3.min(data, d => d[column]), d3.max(data, d => d[column])])
      .range([0, 150])
    let x = Math.cos(angle) * radialScale(value)
    let y = Math.sin(angle) * radialScale(value)
    return { x: cx + x, y: cy - y }
  }

  function angleToCoordinate(angle, value) {
    // need new scale for each column

    let x = Math.cos(angle) * radialScale(value)
    let y = Math.sin(angle) * radialScale(value)
    return { x: cx + x, y: cy - y }
  }

  for (let i = 0; i < data.columns.length; i++) {
    let column = data.columns[i]
    let angle = Math.PI / 2 + (2 * Math.PI * i) / data.columns.length
    let line_coordinate = angleToCoordinate(angle, 10)
    let label_coordinate = angleToCoordinate(angle, 12.5)

    //draw axis line
    g.append('line')
      .attr('x1', cx)
      .attr('y1', cy)
      .attr('x2', line_coordinate.x)
      .attr('y2', line_coordinate.y)
      .attr('stroke', 'black')

    //draw axis label
    g.append('text')
      .attr('x', label_coordinate.x - 25)
      .attr('y', label_coordinate.y)
      .text(column)
  }

  let line = d3
    .line()
    .x(d => d.x)
    .y(d => d.y)
  let colors = ['darkorange', 'gray', 'navy']

  function getPathCoordinates(sample) {
    let coordinates = []
    for (var i = 0; i < data.columns.length; i++) {
      let column = data.columns[i]
      if (typeof sample[column] == 'string') {
        coordinates.push({ x: cx, y: cy })
        continue
      }
      let angle = Math.PI / 2 + (2 * Math.PI * i) / data.columns.length
      let coord = angleToCoordinate2(angle, sample[column], column)
      //console.log(column, sample[column], coord)
      coordinates.push(coord)
    }
    return coordinates
  }

  for (var i = 0; i < 3; i++) {
    let d = data[i]
    let color = colors[i]
    let coordinates = getPathCoordinates(d)

    //draw the path element
    g.append('path')
      .datum(coordinates)
      .attr('d', line)
      .attr('stroke-width', 1)
      .attr('stroke', 'red')
      .attr('fill', color)
      .attr('stroke-opacity', 1)
      .attr('opacity', 0.5)
  }
}

let main = async () => {
  let data = await d3.csv('../data/removed-strings.csv', data => ({
    ...data,
    year: +data.year,
    duration_ms: +data.duration_ms,
    explicit: data.explicit ? 1 : 0,
    popularity: +data.popularity,
    danceability: +data.danceability,
    energy: +data.energy,
    key: +data.key,
    loudness: +data.loudness,
    mode: +data.mode,
    speechiness: +data.speechiness,
    acousticness: +data.acousticness,
    instrumentalness: +data.instrumentalness,
    liveness: +data.liveness,
    valence: +data.valence,
    tempo: +data.tempo,
  }))

  starPlot(data, 'popularity')
}

main()