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
// Popup for county name when hovering
var tooltip = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

// Promise allows multiple iterables to be passed through
Promise.all([map]).then(function(values){    
    // draws map
    svg.selectAll("path")
        .data(values[0].features)
        .enter()
        .append("path")
        .attr("class","county")
        .attr("d", path)
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
        });;
    });