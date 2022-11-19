import * as d3 from 'https://cdn.skypack.dev/d3@7'
import { selectAll } from 'https://cdn.skypack.dev/d3-selection@3'

async function barChart(data, column) {

  // First clear the div
  d3.select("#chart-area").html("");

  d3.select('#dropdown-label').text(column)

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom

  const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 }
  const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
  const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

  const svg = d3
    .select('#chart-area')
    .append('svg')
    .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

  const g = svg
    .append('g')
    .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

  // X label
  g.append('text')
    .attr('class', 'x axis-label')
    .attr('x', WIDTH / 2)
    .attr('y', HEIGHT + 60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text('Year')

  // Y label
  g.append('text')
    .attr('class', 'y axis-label')
    .attr('x', -(HEIGHT / 2))
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text(column)

  const x = d3
    .scaleBand()
    .domain(data.map(d => d.year))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => (d[column] ? d[column] : 0))])
    .range([HEIGHT, 0])

  
  console.log(d3.max(data, data => data.explicit));
  console.log(d3.min(data, data => data.explicit));

  const xAxisCall = d3.axisBottom(x)
  g.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${HEIGHT})`)
    .call(xAxisCall)
    .selectAll('text')
    .attr('y', '10')
    .attr('x', '-5')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-40)')

  const yAxisCall = d3
    .axisLeft(y)
    .ticks(5)
    .tickFormat(d => d)
  g.append('g').attr('class', 'y axis').call(yAxisCall)

  const rects = g.selectAll('rect').data(data)

  rects
    .enter()
    .append('rect')
    .attr('y', d => y(d[column]))
    .attr('x', d => x(d.year))
    .attr('width', x.bandwidth)
    .attr('height', d => HEIGHT - y(d[column]))
    .attr('fill', 'pink')
}

async function addDropdownMenu(data) {
  let dropdown = document.getElementById('bar-chart-y-axis-dropdown')

  for (let column of data.columns) {
    let button = document.createElement('button')
    button.addEventListener('click', () => barChart(data, column))
    button.classList.add('dropdown-item')
    button.innerHTML = column
    let entry = document.createElement('li').appendChild(button)
    dropdown.appendChild(entry)
  }
}

let main = async () => {
  let averagedData = await d3.csv('../data/grouped-by-year.csv', data => ({
    ...data,
    year: +data.year,
    duration_ms: +data.duration_ms,
    explicit: +data.explicit,
    popularity: +data.popularity,
    danceability: +data.danceability,
    energy: +data.energy,
    key: +data.key,
    loudness: +data.loudness,
    speechiness: +data.speechiness,
    acousticness: +data.acousticness,
    instrumentalness: +data.instrumentalness,
    liveness: +data.liveness,
    valence: +data.valence,
    temp: +data.tempo,
  }))

  console.log(averagedData);

  barChart(averagedData, 'popularity')
  addDropdownMenu(averagedData)
}

main()
