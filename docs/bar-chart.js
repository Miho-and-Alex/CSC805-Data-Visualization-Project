/*global d3*/

import { groupedByYear, groupedByPopularity } from './data.js'

function yScaleDomain(yLabel, data) {
  let upperbound = d3.max(data, d => d[yLabel])
  let lowerbound = d3.min(data, d => d[yLabel])
  if (yLabel == 'year') {
    return [1990, upperbound]
  } else if (d3.min(data, d => d[yLabel]) < 0) {
    return [lowerbound, upperbound]
  } else {
    return [0, upperbound]
  }
}

function barChart(data, div, xLabel, yLabel) {
  d3.select(div + ' .dropdown-label-y').text(yLabel)
  d3.select(div + ' .dropdown-label-x').text(xLabel == 'bins' ? 'popularity' : xLabel)

  const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 70 }
  const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
  const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

  const svg = d3
    .select(div + ' > .chart')
    .append('svg')
    .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

  const g = svg.append('g').attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

  // X label
  g.append('text')
    .attr('class', 'x axis-label')
    .attr('id', 'x-axis-label')
    .attr('x', WIDTH / 2)
    .attr('y', HEIGHT + 60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text(xLabel == 'bins' ? 'popularity' : xLabel)

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
    .domain(data.map(d => d[xLabel]))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)

  const y = d3.scaleLinear().domain(yScaleDomain(yLabel, data)).range([HEIGHT, 0])

  const xAxisCall = d3.axisBottom(x).tickFormat(parseBins)
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
    .attr('x', d => {
      //console.log('xLabel', xLabel)
      //console.log('xLabel', d[xLabel])
      return x(d[xLabel])
    })
    .attr('width', x.bandwidth)
    .attr('height', d => {
      //console.log(yLabel, d[yLabel]);
      if (!d[yLabel]) return HEIGHT
      else return HEIGHT - y(d[yLabel])})
    .attr('fill', 'green')

  addDropdownMenu({ groupedByYear, groupedByPopularity }, g, HEIGHT, div)

  return { g, HEIGHT }
}

async function addDropdownMenu(data, svg, HEIGHT, div) {
  let dropdownX = d3.select(div + ' .dropdown-menu.x-axis')
  let dropdownY = d3.select(div + ' .dropdown-menu.y-axis')
  let xMetrics = ['year', 'bins']
  let yMetrics = data.groupedByYear.columns
  for (let yMetric of yMetrics) {
    let button = document.createElement('button')
    button.addEventListener('click', () => {
      let currX = d3.select(div + ' .dropdown-label-x').text()
      updateXY(data, svg, HEIGHT, currX == 'popularity' ? 'bins' : currX, yMetric, div)
      // update y-axis label
      d3.select(div + ' .dropdown-label-y').text(yMetric)
      d3.select(div + ' .y.axis-label').text(yMetric)
    })
    button.innerHTML = yMetric
    addButtonEntry(dropdownY, button)
  }
  for (let xMetric of xMetrics) {
    let button = document.createElement('button')
    button.addEventListener('click', () => {
      let currY = d3.select(div + ' .dropdown-label-y').text()
      updateXY(data, svg, HEIGHT, xMetric, currY, div)
      // update x-axis label
      d3.select(div + ' .dropdown-label-x').text(xMetric == 'bins' ? 'popularity' : xMetric)
      d3.select(div + ' .x.axis-label').text(xMetric == 'bins' ? 'popularity' : xMetric)
    })
    button.innerHTML = xMetric == 'bins' ? 'popularity' : xMetric
    addButtonEntry(dropdownX, button)
  }
}

function addButtonEntry(dropdown, button) {
  button.classList.add('dropdown-item')
  let entry = document.createElement('li')
  entry.appendChild(button)
  dropdown.append(() => entry)
}

function updateXY(data, svg, h, xMetric, yMetric, div) {
  const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 70 }
  const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
  const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

  data = xMetric === 'bins' ? data.groupedByPopularity : data.groupedByYear

  svg.selectAll(div + ' .y-axis').remove()
  svg.selectAll(div + ' .x-axis').remove()
//  svg.select(div + ' .x-axis-label').remove()
//  svg.select(div + ' .y-axis-label').remove()
  

  const x = d3
    .scaleBand()
    .domain(data.map(d => d[xMetric]))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)

  const y = d3.scaleLinear().domain(yScaleDomain(yMetric, data)).range([h, 0])

  const yAxisCall = d3
    .axisLeft(y)
    .ticks(5)
    .tickFormat(d => d)

  // adding y-axis
  svg.append('g').attr('class', 'y axis y-axis').call(yAxisCall)

  const xAxisCall = d3.axisBottom(x).tickFormat(parseBins)

  // adding x axis
  svg
    .append('g')
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
    .attr('y', d => y(d[yMetric]))
    //.attr('x', d => x(d[xMetric]))
    .attr('height', d => {
      //console.log('Height', HEIGHT, yMetric, d[yMetric], y(d[yMetric]))
      if (!(y(d[yMetric]))) return h
      else return h - y(d[yMetric])
    })
    .attr('fill', function (d) {
      let rgbStr =
        'rgb(0,' +
        Math.round(colorScale(d[yMetric])) +
        ',' +
        Math.round(colorScale(d[yMetric]) / 10) +
        ')'
      return rgbStr
    })
}

function parseBins(d) {
  if (typeof d != 'string') return d
  let split = d.split(',')
  split[0] = split[0].replace('(', '')
  split[1] = split[1].replace(']', '')
  return `(${parseInt(split[0])}, ${parseInt(split[1])}]`
}

let main = async () => {
  barChart(groupedByYear, '#bar-chart-area-1', 'year', 'popularity')
  barChart(groupedByPopularity, '#bar-chart-area-2', 'bins', 'year')
}

main()
