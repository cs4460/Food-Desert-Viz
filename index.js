
var width = 1400;
var height = 670;
var svg = d3.select("div#container").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height)
    .classed("svg-content", true);

// Scales and centers map
var projection = d3.geoMercator().translate([width/2, height/2]).scale(6000).center([-83.5,32.7]);
var path = d3.geoPath().projection(projection);

var map = d3.json("map_data/ga_counties.json");
var ACCESS = d3.csv("data/ACCESS.csv");
// Popup for county name when hovering
var tooltip = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

// var colorScale = d3.scaleLinear()
//     .range(["#FFFFFF", "#4200a6"])
//     .domain([0, 100]);

colorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain([0,100]);

// Promise allows multiple iterables to be passed through
Promise.all([map, ACCESS]).then(function(values) {

    // Combines map data with ACCESS data
    values[0].features.forEach(function(v_0) {
        var result = values[1].filter(function(v_1) {
            return v_1.County === v_0.properties.NAME;
        });
        v_0.data = (result[0] !== undefined) ? result[0] : null;
    });

    // draws map
    svg.selectAll("path")
        .data(values[0].features)
        .enter()
        .append("path")
        .attr("class","county")
        .attr("d", path)
        .attr("fill", function(d) {
            return colorScale(d.data.PCT_LACCESS_POP15);
        })
        .on("mouseover", function(d) {    
            tooltip.transition()
            .duration(200)
            .style("opacity", .9);
            tooltip.html(d.properties.NAME)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });
});

var legendheight = 200,
    legendwidth = 80,
    margin = {top: 10, right: 60, bottom: 10, left: 2};

var canvas = d3.select("#legend")
    .style("height", legendheight + "px")
    .style("width", legendwidth + "px")
    .style("position", "relative")
    .append("canvas")
    .attr("height", legendheight - margin.top - margin.bottom)
    .attr("width", 1)
    .style("height", (legendheight - margin.top - margin.bottom) + "px")
    .style("width", (legendwidth - margin.left - margin.right) + "px")
    .style("border", "1px solid #000")
    .style("position", "absolute")
    .style("top", (margin.top) + "px")
    .style("left", (margin.left) + "px")
    .node();

var ctx = canvas.getContext("2d");

var legendscale = d3.scaleLinear()
.range([1, legendheight - margin.top - margin.bottom])
.domain(colorScale.domain());

var image = ctx.createImageData(1, legendheight);
d3.range(legendheight).forEach(function(i) {
    var c = d3.rgb(colorScale(legendscale.invert(i)));
    image.data[4*i] = c.r;
    image.data[4*i + 1] = c.g;
    image.data[4*i + 2] = c.b;
    image.data[4*i + 3] = 255;
});
ctx.putImageData(image, 0, 0);

var legendaxis = d3.axisRight()
    .scale(legendscale)
    .tickSize(6)
    .ticks(6);

  var svg2 = d3.select("#legend")
    .append("svg")
    .attr("height", (legendheight) + "px")
    .attr("width", (legendwidth) + "px")
    .style("position", "absolute")
    .style("left", "0px")
    .style("top", "0px")

  svg2
    .append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
    .call(legendaxis);
