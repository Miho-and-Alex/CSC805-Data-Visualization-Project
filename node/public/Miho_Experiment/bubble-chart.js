import * as d3 from "https://cdn.skypack.dev/d3@7"
import { selectAll } from "https://cdn.skypack.dev/d3-selection@3"

// set the dimensions and margins of the graph
var margin = {top: 40, right: 150, bottom: 40, left: 80},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#bubble-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(d3.zoom()
        .scaleExtent([1, 3])
        .on("zoom", function (event) {
            svg.attr("transform", event.transform)
        }
    ))
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

async function main() {
    let data = await d3.csv("Spotify Dataset.csv");
    // let allColumns = ['year', 'genre', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo', 'explicit'];
    let genres = [...new Set(data.map(d => d.genre))]

    let numOfSongsByGenre = data.reduce((count, d) => {
        count[d.genre] = (count[d.genre] || 0) + 1;
        return count;
    }, {});

    let nodes = d3.range(genres.length)
        .map(function(d) {
            return {
                radius: numOfSongsByGenre[genres[d]] * 100 / 900,
                genre: genres[d]
            }
        })

    let elements = svg.selectAll('.bubble')
        .data(nodes)
        .enter()
        .append('g')
  
    let bubbles = elements
        .append('circle')
        .classed('bubble', true)
        .attr('r', d => d.radius)
        .style("fill", "#69b3a2")
        .style("opacity", 0.4);
  
    let labels = elements
        .append('text')
        .attr('dy', '-0.3em')
        .style('text-anchor', 'middle')
        .style('font-size', 12)
        .text(d => d.genre)

    var simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(5))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(function(d) {
            return d.radius
        }))
        .on('tick', ticked);


    function ticked() {
        bubbles
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)

        labels
            .attr('x', d => d.x)
            .attr('y', d => d.y)
    }
}
        

main()