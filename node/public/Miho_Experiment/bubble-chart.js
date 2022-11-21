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
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

async function main() {
    let data = await d3.csv("Spotify Dataset.csv");
    console.log(data);
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

    var simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(5))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(function(d) {
            return d.radius
        }))
        .on('tick', ticked);

    function ticked() {
        var u = d3.select('g')
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('r', function(d) {
                return d.radius
            })
            .attr('cx', function(d) {
                return d.x
            })
            .attr('cy', function(d) {
                return d.y
            })
            .style("fill", "#69b3a2")
            .style("opacity", 0.4);

        
        let label = svg.selectAll("text")
        .data(nodes).enter()
        .append("text")
        .attr("x", function(d) {return d.x - (Math.sqrt(d.radius)/Math.PI)})
        .attr("y", function(d) {return d.y- (Math.sqrt(d.radius)/Math.PI)})
        // .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text(function(d) {
            return d.genre
        });
    }
}
        

main()