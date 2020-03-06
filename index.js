var width = 1400;
var height = 670;
var svg = d3.select("div#container").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height)
    .classed("svg-content", true);

// Scales and centers map
var projection = d3.geoMercator().translate([width/2, height/2]).scale(6000).center([-83.5,32.35]);
var path = d3.geoPath().projection(projection);

var map = d3.json("map_data/ga_counties.json");
var access = d3.csv("data/ACCESS.csv");
// Popup for county name when hovering
var tooltip = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

var colorScale = d3.scaleLinear()
    .range(['#9e0142','#d53e4f','#f46d43','#fdae61','#fee08b','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2'])
    .domain([100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0]);

// legend setup
var legendWidth = 300
var legendScale = d3.scaleLinear()
    .range([-legendWidth/2, legendWidth/2])
    .domain([0, 100]);

var defs = svg.append("defs");

var linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

linearGradient.selectAll("stop")
    .data(colorScale.range())
    .enter()
    .append("stop")
    .attr("offset", function(d,i) { return i/(colorScale.range().length-1); })
    .attr("stop-color", function(d) { return d; });

var legendAxis = d3.axisBottom()
    .scale(legendScale);

// draw legend
var legendSvg = svg.append('g')
    .attr('class', 'legendWrapper')
    .attr('transform', 'translate(550, 620)');
    
legendSvg.append("rect")
    .attr("width", legendWidth)
    .attr("height", 10)
    .style("fill", "url(#linear-gradient)");

legendSvg.append("text")
	.attr("class", "legendTitle")
	.attr("x", 149.5)
	.attr("y", -10)
	.style("text-anchor", "middle")
	.text("% of Population with Low Access to Food");

// Promise allows multiple iterables to be passed through
Promise.all([map, access]).then(function(values) {
    console.log(values[0]);
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
            tooltip.html(d.properties.NAME + "<br/>" + "Low Access: " + parseFloat(d.data.PCT_LACCESS_POP15).toFixed(2) + "%")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });
    // legend axis
    legendSvg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(149.5," + (10) + ")")
        .call(legendAxis);
});