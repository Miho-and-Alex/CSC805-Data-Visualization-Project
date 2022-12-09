/*global d3*/
/*eslint no-undef: "error"*/

export function starPlot(samples, data, title) {
  let cx = 240
  let cy = 190
  const MARGIN = { LEFT: 0, RIGHT: 0, TOP: 20, BOTTOM: 0 }
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

  // Can append the radar chart below

  let rings = [1, 2, 3, 4, 5]
  let ringScale = d3.scaleLinear().domain([0, rings.length]).range([0, radius])
  let ringColors = ['lightblue', 'lightgreen', 'pink', 'tan', 'gray']

  // adding rings
  g.selectAll('circle')
    .data(rings)
    .join('circle')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('fill', 'none')
    .attr('stroke', (ring, i) => ringColors[i])
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

    let label_coordinate = angleToCoordinate(angle, rings.length + .9, ringScale, cx, cy)

    //draw axis line
    g.append('line')
      .attr('x1', cx)
      .attr('y1', cy)
      .attr('x2', line_coordinate.x)
      .attr('y2', line_coordinate.y)
      .attr('stroke', 'black')

    //draw axis label
    g.append('text')
      .attr('x', label_coordinate.x - 30)
      .attr('y', label_coordinate.y)
      .style('fill', 'green')
      .text(column)
  }

  let linePath = d3
    .line()
    .x(d => d.x)
    .y(d => d.y)
  //let colors = ['darkorange', 'gray', 'navy']
  let colors = ['gray', 'pink', 'orange']

  g.selectAll('path')
    .data(samples)
    .join('path')
    .attr('d', d => linePath(getPathCoordinates(data, d, columns, radius, cx, cy)))
    .attr('stroke-width', 1)
    .attr('stroke', 'red')
    .attr('fill', (d, i) => colors[i % 3])
    .attr('stroke-opacity', 1)
    .attr('opacity', 0.5)

  // title
  g.append('text')
    .attr('x', WIDTH / 2)
    .attr('y', 10)
    .attr('text-anchor', 'middle')
    .style('fill', 'blue')
    .style('font-size', '20px')
    .text(title)

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
    //console.log(column, sample[column], coord)
    coordinates.push(coord)
  }
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

  d3.select('#star-plot-1').append(() => starPlot([averaged_data], data, 'Total Average'))
  d3.select('#star-plot-1').append(() => starPlot(top_3, data, 'Top 3 most popular songs'))
}
main()
