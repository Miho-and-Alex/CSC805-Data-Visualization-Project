import * as d3 from "https://cdn.skypack.dev/d3@7"
import { selectAll } from "https://cdn.skypack.dev/d3-selection@3"

// set the dimensions and margins of the graph
let margin = {top: 40, right: 150, bottom: 40, left: 80},
    width = 800 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#scatter-plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

async function main() {
    let data = await d3.csv("Spotify Dataset.csv");
    let allColumns = ['year', 'genre', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo', 'explicit'];
    let selectedColumn = allColumns[0];

    d3.select("#scatter-plot-x-axis")
        .selectAll('myOptions')
        .data(allColumns)
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; });

    let selectedData = data.map(function(d){return {popularity: d.popularity, value:d.year, song: d.song, artist: d.artist} })

    // Add X axis
    let x = d3.scaleLinear()
        .domain([d3.min(selectedData, function(d) { return +d.value; }), d3.max(selectedData, function(d) { return +d.value; })])
        .range([0, width]);
    let xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .call(g => g.append("text")
        .attr("id", "x-axis-label")
        .attr("x", width)
        .attr("y", margin.bottom - 4)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text(selectedColumn + " →"))

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([d3.min(selectedData, function(d) { return +d.popularity; }), d3.max(selectedData, function(d) { return +d.popularity; })])
        .range([height, 0]);
    let yAxis = svg.append("g")
        .call(d3.axisLeft(y))
        .call(g => g.append("text")
        .attr("x", -margin.left + 10)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Popularity"))

    let tooltip = d3.select("#scatter-plot")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("font-size", "12px")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    let mouseover = function(event, d) {
        tooltip
            .style("opacity", 1)

        d3.select(this)
            .attr("r", 6.0)
            .style("opacity", 1)
            .style("stroke", "black")
    }
    
    let mousemove = function(event, d) {
        tooltip
            .html(d.song + "<br/>by " + d.artist)
            .style("left", (event.x) + 10 + "px")
            .style("top", (event.y) + 5 + "px")
    }

    let mouseleave = function(event, d) {
        tooltip
            .transition()
            .duration(500)
            .style("opacity", 0)

        d3.select(this)
            .attr("r", 5.5)
            .style("opacity", 0.4)
            .style("stroke", "white")
    }
        
    // Add dots
    let dot = svg.append('g')
        .selectAll("dot")
        .data(selectedData)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.value); } )
        .attr("cy", function (d) { return y(d.popularity); } )
        .attr("r", 5.5)
        .style("fill", "#69b3a2")
        .style("opacity", 0.4)
        // .style("stroke", "white") // stroke doesn't work with D3 animation?
        .on("mouseenter", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave );

    // A function that update the chart
    function update(selectedColumn) {
        selectedData = data.map(function(d){return {popularity: d.popularity, value:d[selectedColumn], song: d.song, artist: d.artist} })
        if(selectedColumn == 'genre' || selectedColumn == 'explicit') {
            x = d3.scalePoint()
                .domain([...new Set(selectedData.map(d => d.value))])
                .range([0, width]);

            d3.select("#x-axis-label")
                .text(selectedColumn + " →")

            xAxis.transition()
                .duration(1000)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("transform", "rotate(-10)");
        } else {
            x = d3.scaleLinear()
                .domain([d3.min(selectedData, function(d) { return +d.value; }), d3.max(selectedData, function(d) { return +d.value; })])
                .range([0, width]);

            d3.select("#x-axis-label")
                .text(selectedColumn + " →")

            xAxis.transition()
                .duration(1000)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("transform", "rotate(0)");
        }

        dot.data(selectedData)
            .transition()
            .duration(1000)
            .attr("cx", function(d) { console.log(d); return x(d.value) })
            .attr("cy", function(d) { return y(d.popularity) });
    }

    // Update the chart when x-asix is changed
    d3.select("#scatter-plot-x-axis").on("change", function(d) {
        selectedColumn = d3.select(this).property("value");
        update(selectedColumn);
    })

}

main()
