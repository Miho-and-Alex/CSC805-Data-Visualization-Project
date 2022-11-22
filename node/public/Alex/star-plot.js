import * as d3 from 'https://cdn.skypack.dev/d3@7'
import { selectAll } from 'https://cdn.skypack.dev/d3-selection@3'

function startPlot(data) {
  const MARGIN = { LEFT: 250, RIGHT: 10, TOP: 150, BOTTOM: 70 }
  const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
  const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

  const svg = d3
    .select('#radar-chart-area')
    .append('svg')
    .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

  const g = svg
    .append('g')
    .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

  // Can append the radar chart below

  let res = []
  let features = ['A', 'B', 'C', 'D', 'E', 'F']
  //generate the data
  for (var i = 0; i < 3; i++) {
    var point = {}
    //each feature will be a random number from 1-9
    data.columns.forEach(f => (point[f] = 1 + Math.random() * 8))
    res.push(point)
  }
  console.log(res)

  let radialScale = d3.scaleLinear().domain([0, 10]).range([0, 150])

  let ticks = [2, 4, 6, 8, 10]

  ticks.forEach(t =>
    g
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('fill', 'none')
      .attr('stroke', 'gray')
      .attr('r', radialScale(t))
  )

  ticks.forEach(t =>
    svg.append("text")
    .attr("x", 100)
    .attr("y", 200 - radialScale(t))
    .text(t.toString())
);
}

let main = async () => {
  let data = await d3.csv('../data/songs_normalize.csv', data => ({
    ...data,
    year: +data.year,
    duration_ms: +data.duration_ms,
    explicit: +data.explicit,
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

  startPlot(data, 'popularity')
}

main()
