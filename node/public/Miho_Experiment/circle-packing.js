import * as d3 from "https://cdn.skypack.dev/d3@7"
import { selectAll } from "https://cdn.skypack.dev/d3-selection@3"

let margin = {top: 0, right: 80, bottom: 200, left: 80},
    width = 1200 - margin.right - margin.left,
    height = 1000 - margin.top - margin.bottom;

let pack = data => d3.pack()
    .size([width, height])
    .padding(3)
    (d3.hierarchy(data)
    .count(d => d.value)
    .sort((a, b) => b.value - a.value));

let color = d3.scaleLinear()
    .domain([0, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl)

let tooltip = d3.select("#circle-packing")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

async function main() {
    let data = await d3.json("./../data/Spotify Dataset.json");
    let group = d3.group(data, d => d.genre);
    let root = pack(group);
    let focus = root;
    let view;
    let tooltipOn = false;
    
    const svg = d3.select("#circle-packing")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .style("display", "block")
        .style("margin", "0 -14px")
        .style("background", color(0))
        .style("cursor", "pointer")
        .on("click", (event) => zoom(event, root));

    let mouseclick = function(event, d) {
        tooltip
            .html("<div>" + d.song + " by " + d.artist + "</div>")
            .style("left", (event.x) + 10 + "px")
            .style("top", (event.y) + 5 + "px")
            .style("width", width * 0.5 + "px")
            .style("height", height * 0.5 + "px")
            .style("opacity", 1)
        tooltipOn = true
    }

    let mousemove = function(event, d) {
        tooltip
            .style("left", (event.x) + 10 + "px")
            .style("top", (event.y) + 5 + "px")
    }

    let mouseleave = function(event, d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
        tooltipOn = false
    }

    const node = svg.append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .join("circle")
        .attr("fill", d => d.children ? color(d.depth) : "white")
        .attr("pointer-events", d => {!d ? "none" : null})
        .on("mouseover", function() { d3.select(this).attr("stroke", "#000") })
        .on("mousemove", (event, d) => mousemove(event, d))
        .on("mouseout", function(event, d) { d3.select(this).attr("stroke", null), mouseleave(event, d) })
        .on("click", (event, d) => {
            if(d.depth < 2 && focus !== d) {zoom(event, d), event.stopPropagation()}
            if(d.depth != 1) mouseclick(event, d.data);
            else mouseleave();
        });
    
    const label = svg.append("g")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text(d => d.parent === root ? d.data[0] : null);
    
    zoomTo([root.x, root.y, root.r * 2]);
    
    function zoomTo(v) {
        console.log("zoomTo")
        const k = width / v[2];
        view = v;
        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", d => d.r * k);
    }
    
    function zoom(event, d) {
        if(tooltipOn) return;
        focus = d;
        const transition = svg.transition()
            .duration(event.altKey ? 7500 : 750)
            .tween("zoom", d => {
                const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                return t => zoomTo(i(t));
            });
    
        label
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .transition(transition)
            .style("fill-opacity", d => d.parent === focus ? 1 : 0)
            .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }

}

main()