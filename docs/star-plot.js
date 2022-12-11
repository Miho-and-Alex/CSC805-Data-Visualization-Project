/*global d3*/
/*eslint no-undef: "error"*/

export function starPlot(samples, data, title) {
  let cx = 240
  let cy = 190
  const MARGIN = { LEFT: 0, RIGHT: 0, TOP: 0, BOTTOM: 0 }
  const WIDTH = 450 - MARGIN.LEFT - MARGIN.RIGHT
  const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM
  const radius = 130

  const columns = [
    'duration_ms',
    'danceability',
    'energy',
    'loudness',
    'speechiness',
    'acousticness',
    'instrumentalness',
    'liveness',
    'valence',
    'tempo',
  ]

  const svg = d3
    .create('svg')
    .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

  const g = svg.append('g').attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

  let rings = [1, 2, 3, 4, 5]
  let ringScale = d3.scaleLinear().domain([0, rings.length]).range([0, radius])

  // adding rings
  g.selectAll('circle')
    .data(rings)
    .join('circle')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('fill', 'none')
    .attr('stroke', '#EEEEEE')
    .attr('r', ring => ringScale(ring))

  // add text labels
  g.selectAll('text')
    .data(rings)
    .join('circle')
    .attr('x', cx)
    .attr('y', ring => cy - ringScale(ring))
    .text(ring => ring.toString())

  // adding column labels
  for (let i = 0; i < columns.length; i++) {
    let column = columns[i]
    let angle = Math.PI / 2 + (2 * Math.PI * i) / columns.length
    let line_coordinate = angleToCoordinate(angle, rings.length, ringScale, cx, cy)

    let label_coordinate = angleToCoordinate(angle, rings.length + 0.9, ringScale, cx, cy)

    //draw axis line
    g.append('line')
      .attr('x1', cx)
      .attr('y1', cy)
      .attr('x2', line_coordinate.x)
      .attr('y2', line_coordinate.y)
      .attr('stroke', '#EEEEEE')

    //draw axis label
    g.append('text')
      .attr('x', label_coordinate.x - 30)
      .attr('y', label_coordinate.y)
      .style('fill', 'black')
      .style('font-size', '12px')
      .text(column)
  }

  let linePath = d3
    .line()
    .x(d => d.x)
    .y(d => d.y)

  let colors = ['#B7EFBC' /* light green */, 'lightpink' /* light pink */, 'lightblue' /* purple */]

  if (samples.length == 3) {
    console.log(samples)
    let temp = samples[2]
    samples[2] = samples[1]
    samples[1] = temp
    console.log(samples)
  }

  g.selectAll('path')
    .data(samples)
    .join('path')
    .attr('d', d => linePath(getPathCoordinates(data, d, columns, radius, cx, cy)))
    .attr('stroke-width', 1)
    //.attr('stroke', 'black')
    .attr('fill', (d, i) => colors[i % colors.length])
    .attr('stroke-opacity', 1)

  // outline of path
  let g2 = g.append('g') // next layer
  samples.reverse()
  g2.selectAll('path')
    .data(samples)
    .join('path')
    .attr('d', d => linePath(getPathCoordinates(data, d, columns, radius, cx, cy)))
    .attr('stroke-width', 1)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-opacity', 1)

  // title
  g.append('text')
    .attr('x', WIDTH / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .style('fill', 'black')
    .style('font-size', '20px')
    .style('font-weight', 'bold')
    .text(title)

  legend(g, samples, colors)

  return svg.node()
}

function getPathCoordinates(data, sample, columns, radius, cx, cy) {
  let coordinates = []
  for (var i = 0; i < columns.length; i++) {
    let column = columns[i]
    if (typeof sample[column] == 'string') {
      coordinates.push({ x: cx, y: cy })
      continue
    }

    let angle = Math.PI / 2 + (2 * Math.PI * i) / columns.length
    let coord = angleToCoordinate2(data, radius, angle, sample[column], column, cx, cy)
    coordinates.push(coord)
  }
  // push to complete the path
  let angle = Math.PI / 2 + (2 * Math.PI * 0) / columns.length
  let coord = angleToCoordinate2(data, radius, angle, sample[columns[0]], columns[0], cx, cy)
  coordinates.push(coord)

  return coordinates
}

function angleToCoordinate2(data, radius, angle, value, column, cx, cy) {
  // need new scale for each column

  let radialScale = d3
    .scaleLinear()
    .domain([d3.min(data, d => d[column]), d3.max(data, d => d[column])])
    .range([0, radius])
  let x = Math.cos(angle) * radialScale(value)
  let y = Math.sin(angle) * radialScale(value)
  return { x: cx + x, y: cy - y }
}

function angleToCoordinate(angle, value, ringScale, cx, cy) {
  // need new scale for each column
  let x = Math.cos(angle) * ringScale(value)
  let y = Math.sin(angle) * ringScale(value)
  return { x: cx + x, y: cy - y }
}

function legend(g, samples, colors) {
  //Initialize legend
  var legendItemSize = 12
  var legendSpacing = 4
  var xOffset = 0
  var yOffset = 350

  var legend = g.append('svg').selectAll('.legendItem').data(samples)
  legend
    .enter()
    .append('rect')
    .attr('class', 'legendItem')
    .attr('width', legendItemSize)
    .attr('height', legendItemSize)
    .attr('stroke', 'black')
    .style('fill', (d, i) => colors[i])
    .attr('transform', (d, i) => {
      let x = xOffset
      let y = yOffset + (legendItemSize + legendSpacing) * i
      return `translate(${x}, ${y})`
    })

  //Create legend labels
  legend
    .enter()
    .append('text')
    .attr('x', xOffset + legendItemSize + 5)
    .attr('y', (d, i) => yOffset + (legendItemSize + legendSpacing) * i + 12)
    .text(d => d.song + ' by ' + d.artist)
}

async function main() {
  let data = await d3.csv(
    'https://raw.githubusercontent.com/Miho-and-Alex/CSC805-Data-Visualization-Project/main/docs/data/removed-strings.csv',
    data => ({
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
    })
  )

  let averaged_data = await d3.json('./data/means.json')
  averaged_data.song = 'Average'
  averaged_data.artist = 'averaging all data'

  let top_3 = await d3.csv('./data/top_3.csv', data => ({
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

  for (let i = 0; i < top_3.length; i++) {
    top_3[i].song = 'Top ' + (i + 1) + ' ' + top_3[i].song
  }

  d3.select('#star-plot-1').append(() => starPlot([averaged_data], data, 'Total Average'))
  d3.select('#star-plot-1').append(() => starPlot(top_3, data, 'Top 3 Most Popular Songs'))
}
main()
