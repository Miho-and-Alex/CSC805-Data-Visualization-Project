import * as d3 from 'https://cdn.skypack.dev/d3@7'
import { selectAll } from 'https://cdn.skypack.dev/d3-selection@3'

const columns = ['duration_ms', 'year', 'popularity', 'danceability', 'energy', 'key', 'loudness', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']
let whole_dataset;

export function starPlot(data, cx, cy) {
  cx = 240, cy = 170 
  const MARGIN = { LEFT: 0, RIGHT: 0, TOP: 0, BOTTOM: 0 }
  const WIDTH = 450 - MARGIN.LEFT - MARGIN.RIGHT
  const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM
  const radius = 130

  const svg = d3
    .select('#starplot-' + data.index)
    .append('svg')
    .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

  const g = svg
    .append('g')
    .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

  // Can append the radar chart below

  let radialScale = d3.scaleLinear().domain([0, columns.length]).range([0, radius])
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
      .domain([d3.min(whole_dataset, d => d[column]), d3.max(whole_dataset, d => d[column])])
      .range([0, radius])
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

  // adding column labels
  for (let i = 0; i < columns.length; i++) {
    let column = columns[i]
    let angle = Math.PI / 2 + (2 * Math.PI * i) / columns.length
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
    for (var i = 0; i < columns.length; i++) {
      let column = columns[i]
      if (typeof sample[column] == 'string') {
        coordinates.push({ x: cx, y: cy })
        continue
      }
      let angle = Math.PI / 2 + (2 * Math.PI * i) / columns.length
      let coord = angleToCoordinate2(angle, sample[column], column)
      //console.log(column, sample[column], coord)
      coordinates.push(coord)
    }
    return coordinates
  }

  for (var i = 0; i < 1; i++) {
    let d = data
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
  whole_dataset = await d3.csv('../data/removed-strings.csv', data => ({
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

  //starPlot(data, 'popularity')
}

main()