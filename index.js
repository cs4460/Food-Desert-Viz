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
var access = d3.csv("data/ACCESS.csv");
// Popup for county name when hovering
var tooltip = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

var colorScale = d3.scaleLinear()
    .range(["#2c7bb6","#00ccbc","#90eb9d",
    "#f9d057","#f29e2e","#d7191c"])
    .domain([0, 20, 40, 60, 80, 100]);

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
    legendSvg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (149.5) + ")")
        .call(legendAxis);
});

// legend setup
var legendHeight = 300
var legendScale = d3.scaleLinear()
    .range([-legendHeight/2, legendHeight/2])
    .domain([100, 0]);

var defs = svg.append("defs");

var linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("x1", "0%")
    .attr("y1", "100%")
    .attr("x2", "0%")
    .attr("y2", "0%");

linearGradient.selectAll("stop")
    .data(colorScale.range())
    .enter()
    .append("stop")
    .attr("offset", function(d,i) { return i/(colorScale.range().length-1); })
    .attr("stop-color", function(d) { return d; });

var legendAxis = d3.axisLeft()
    .scale(legendScale)
    .tickSize(0);

// draw legend
var legendSvg = svg.append('g')
    .attr('class', 'legendWrapper')
    .attr('transform', 'translate(300, 150)');
    
legendSvg.append("rect")
    .attr("width", 20)
    .attr("height", legendHeight)
    .style("fill", "url(#linear-gradient)");
