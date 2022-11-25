import * as d3 from 'https://cdn.skypack.dev/d3@7'
import { selectAll } from 'https://cdn.skypack.dev/d3-selection@3'

function barChart(data, column) {
  // First clear the div
  d3.select('#line-chart-area').html('') // not needed anymore
  d3.select('#dropdown-label').text(column)

  const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 70 }
  const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
  const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

  const svg = d3
    .select('#line-chart-area')
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
    .attr('class', 'y axis-label y-axis-label')
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

  const xAxisCall = d3.axisBottom(x)
  g.append('g')
    .attr('class', 'x axis x-axis')
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
  g.append('g').attr('class', 'y axis y-axis').call(yAxisCall)

  const rects = g.selectAll('rect').data(data)

  rects
    .enter()
    .append('rect')
    .attr('y', d => y(d[column]))
    .attr('x', d => x(d.year))
    .attr('width', x.bandwidth)
    .attr('height', d => HEIGHT - y(d[column]))
    .attr('fill', 'red')

  return { g, HEIGHT }
}

async function addDropdownMenu(data, svg, HEIGHT) {
  let dropdown = document.getElementById('bar-chart-y-axis-dropdown')

  for (let column of data.columns) {
    let button = document.createElement('button')
    button.addEventListener('click', () => updateBar(data, svg, HEIGHT, column))
    button.classList.add('dropdown-item')
    button.innerHTML = column
    let entry = document.createElement('li').appendChild(button)
    dropdown.appendChild(entry)
  }
}

function updateBar(data, svg, h, column) {
  d3.select('#dropdown-label').text(column)

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => (d[column] ? d[column] : 0))])
    .range([h, 0])

  svg.selectAll('.y-axis-label').text(column)

  svg.selectAll('.y-axis').remove()
  const yAxisCall = d3
    .axisLeft(y)
    .ticks(5)
    .tickFormat(d => d)
  svg.append('g').attr('class', 'y axis y-axis').call(yAxisCall)

  const colorScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => (d[column] ? d[column] : 0))])
    .range([0, 256])

  console.log(svg)
  //Update all rects
  svg
    .selectAll('rect')
    .data(data)
    .transition() // <---- Here is the transition
    .duration(2000) // 2 seconds
    .attr('y', d => y(d[column]))
    .attr('height', d => h - y(d[column]))
    .attr('fill', function (d) {
      let rgbStr =
        'rgb(' +
        Math.round(colorScale(d[column])) +
        ',0,' +
        Math.round(colorScale(d[column]) / 10) +
        ')'
      //console.log(rgbStr)
      return rgbStr
    })
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
    mode: +data.mode,
    speechiness: +data.speechiness,
    acousticness: +data.acousticness,
    instrumentalness: +data.instrumentalness,
    liveness: +data.liveness,
    valence: +data.valence,
    tempo: +data.tempo,
  }))

  let { g: barChartSVG, HEIGHT } = barChart(averagedData, 'popularity')
  addDropdownMenu(averagedData, barChartSVG, HEIGHT)
}

main()
