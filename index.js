var width = 1400;
var height = 670;
var selectedCounty;

var svg = d3.select("body").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height)
    .classed("svg-content", true);

// Scales and centers map
var projection = d3.geoMercator().translate([width/2, height/2]).scale(6000).center([-83.5,32.35]);
var path = d3.geoPath().projection(projection);

// import data
var map_data = d3.json("map_data/ga_counties.json");
var access_data = d3.csv("data/ACCESS.csv");

// Popup for county name when hovering
var tooltip = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

// Color Scale
var colorScale = d3.scaleLinear()
    .range(['#fef0d9','#fdcc8a','#fc8d59','#e34a33','#b30000'])
    .domain([0, 20, 40, 60, 80, 100]);

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
    
var g = svg.append("g");

// Waits for all promises to be fufilled
// Anything with data runs in here
Promise.all([map_data, access_data]).then(function(values) {

    // Combines map data with ACCESS data
    values[0].features.forEach(function(v_0) {
        var result = values[1].filter(function(v_1) {
            return v_1.County === v_0.properties.NAME;
        });
        v_0.data = (result[0] !== undefined) ? result[0] : null;
    });

    // draws map
    var map = g.selectAll("path")
        .data(values[0].features)
        .enter()
        .append("path")
        .attr("class","county")
        .attr("d", path)
        .attr("fill", function(d) {
            return colorScale(d.data.PCT_LACCESS_POP15);
        })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", clicked);

    // legend axis
    legendSvg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(149.5," + (10) + ")")
        .call(legendAxis);
});

// functions
function mouseover(d) {    
    tooltip.transition()
    .duration(200)
    .style("opacity", .9);

    tooltip.html(d.properties.NAME + "<br/>" + "Low Access: " + parseFloat(d.data.PCT_LACCESS_POP15).toFixed(2) + "%")
    .style("left", (d3.event.pageX) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
};

function mouseout(d) {
    tooltip.transition()
    .duration(500)
    .style("opacity", 0);
};

function clicked(d) {
    var x, y, k;
    
    if (d && selectedCounty !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        selectedCounty = d;
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        selectedCounty = null;
    }

    g.selectAll("path")
        .classed("inactive", selectedCounty && function(d) { return !(d === selectedCounty); })
        .classed("active", selectedCounty && function(d) { return d === selectedCounty; });
    
    g.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");
    

}
