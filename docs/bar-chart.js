import { groupedByYear, groupedByPopularity } from './data.js'

function barChart(data, div, yLabel, xLabel) {
  d3.select(div + ' #dropdown-label-y').text(yLabel)
  d3.select(div + ' #dropdown-label-x').text(xLabel)

  const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 70 }
  const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
  const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM


  const svg = d3
    .select(div + ' > #bar-chart')
    .append('svg')
    .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

  const g = svg
    .append('g')
    .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

  // X label
  g.append('text')
    .attr('class', 'x axis-label')
    .attr('id', 'x-axis-label')
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
    .text(yLabel)

  const x = d3
    .scaleBand()
    .domain(data.map(d => d.year))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => (d[yLabel] ? d[yLabel] : 0))])
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
    .attr('y', d => y(d[yLabel]))
    .attr('x', d => x(d.year))
    .attr('width', x.bandwidth)
    .attr('height', d => HEIGHT - y(d[yLabel]))
    .attr('fill', 'green')

  addDropdownMenu({groupedByYear, groupedByPopularity}, g, HEIGHT, 'y', div)
  addDropdownMenu({groupedByYear, groupedByPopularity}, g, HEIGHT, 'x', div)

  return { g, HEIGHT }
}

async function addDropdownMenu(data, svg, HEIGHT, axis, div) {
  let divId = div + ` #bar-chart-${axis}-axis-dropdown`
  let dropdown = d3.select(divId)
  let columns = axis === 'y' ? data.groupedByYear.columns : ['year', 'bins']

  for (let newMetric of columns) {
    let button = document.createElement('button')
    button.addEventListener('click', () => {
      if (axis === 'y') {
        let currX = d3.select('#dropdown-label-x').text()
        console.log('currX', currX)
        updateXY(data, svg, HEIGHT, currX == 'popularity' ? 'bins' : currX, newMetric)
      }
      else if (axis === 'x') {
        let currY = d3.select('#dropdown-label-y').text()
        updateXY(data, svg, HEIGHT, newMetric, currY)
      }
    })
    button.classList.add('dropdown-item')
    button.innerHTML = newMetric == 'bins' ? 'popularity' : newMetric
    let entry = document.createElement('li')
    entry.appendChild(button)
    dropdown.append(()=>entry)
  }
}

function updateXY(data, svg, h, xMetric, yMetric) {

  const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 70 }
  const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
  const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

  data = xMetric === 'bins' ? data.groupedByPopularity : data.groupedByYear

  d3.select('#dropdown-label-y').text(yMetric)
  d3.select('#dropdown-label-x').text(xMetric == 'year' ? xMetric : 'Popularity')
  svg.selectAll('.y-axis-label').text(yMetric)
  svg.selectAll('#x-axis-label').text(xMetric == 'year' ? xMetric : 'Popularity')

  svg.selectAll('.y-axis').remove()
  svg.selectAll('.x-axis').remove()

  const x = d3
    .scaleBand()
    .domain(data.map(d => d[xMetric]))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)


  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => (d[yMetric] ? d[yMetric] : 0))])
    .range([h, 0])

  const yAxisCall = d3
    .axisLeft(y)
    .ticks(5)
    .tickFormat(d => d)
  svg.append('g').attr('class', 'y axis y-axis').call(yAxisCall)

  const xAxisCall = d3.axisBottom(x).tickFormat(d => {
    if (typeof d != 'string') return d
    let split = d.split(',')
    split[0] = split[0].replace('(', '')
    split[1] = split[1].replace(']', '')
    return `(${parseInt(split[0])}, ${parseInt(split[1])}]`
  })

  svg.append('g')
    .attr('class', 'x axis x-axis')
    .attr('transform', `translate(0, ${HEIGHT})`)
    .call(xAxisCall)
    .selectAll('text')
    .attr('y', '10')
    .attr('x', '-5')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-40)')

  const colorScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => (d[yMetric] ? d[yMetric] : 0))])
    .range([0, 256])

  //Update all rects
  svg
    .selectAll('rect')
    .data(data)
    .transition() // <---- Here is the transition
    .duration(2000) // 2 seconds
    .attr('y', d => {
      console.log(d[yMetric])
      return y(d[yMetric])
    })
    //.attr('x', d => x(d[xMetric]))
    .attr('height', d => h - y(d[yMetric]))
    .attr('fill', function (d) {
      let rgbStr =
        'rgb(0,' +
        Math.round(colorScale(d[yMetric])) + ',' +
        Math.round(colorScale(d[yMetric]) / 10) +
        ')'
      console.log(rgbStr)
      return rgbStr
    })
}

let main = async () => {
  barChart(groupedByYear, '#bar-chart-area-1', 'popularity', 'year')
  barChart(groupedByPopularity, '#bar-chart-area-2', 'year', 'popularity')
  //addDropdownMenu({groupedByYear, groupedByPopularity}, barChartSVG, HEIGHT2, 'y')
  //addDropdownMenu({groupedByYear, groupedByPopularity}, barChartSVG, HEIGHT2, 'x')
}

main()
