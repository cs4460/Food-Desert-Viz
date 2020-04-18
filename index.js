let svg = d3.select("svg");

svg.attr('width',500)
    .attr('height',500)

let spacing = 35;
let rows = 10;
let column = 8;

let ga_data = d3.range(1002);

let ga_group = svg.selectAll('g')
    .data(ga_data)
    .enter()
    .append("g")
let ga_rects = ga_group.append("rect")

let deleteAllRects = () => {
    svg.selectAll('g')
      .data([])
      .exit()
      .remove()
}

let addGaRects = () => {
    ga_group = svg.selectAll('g')
        .data(ga_data)
        .enter()
        .append("g")
    svg.selectAll('g')
        .data(ga_data)
        .enter()
        .append("g")
    ga_rects = ga_group.append("rect")
}

let gaGrid = () =>{
  deleteAllRects();
  addGaRects();
  ga_rects
    .transition()
    .delay((d, i) => 1 * i)
    .duration(600)
    .attr("width", 7)
    .attr("height", 7)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("x", (d, i) => i % 50 * 10)
    .attr("y", (d, i) => Math.floor(i / 50) % 22 * 10)
    .attr("fill", "#d5d8de")
    .attr("opacity", "1")
}

var foodInsecureArr = [];
while(foodInsecureArr.length < 163){
    var r = Math.floor(Math.random() * 1002);
    if(foodInsecureArr.indexOf(r) === -1) foodInsecureArr.push(r);
}

let our_data = d3.range(51);
let rects = []

let addClayRects = () => {
    let group = svg.selectAll('g')
      .data(our_data)
      .enter()
      .append('g')

    rects = group.append("rect")
}

let gaFoodGrid = () => {
  ga_rects
    .transition()
    .delay((d, i) => 1 * i)
    .duration(300)
    .attr("width", 7)
    .attr("height", 7)
    .attr("rx", "5")
    .attr("ry", "5")
    .attr("x", (d, i) => i % 50 * 10)
    .attr("y", (d, i) => Math.floor(i / 50) % 22 * 10)
    .attr("fill", (d, i) => (foodInsecureArr.indexOf(i) !== -1 ? "#FF8E5D" : "#d5d8de"))
}


let clayGrid = () =>{
  deleteAllRects();
  addClayRects();
  rects
    .transition()
    .delay((d, i) => 10 * i)
    .duration(300)
    .attr("width", 25)
    .attr("height", 25)
    .attr("rx", "50%")
    .attr("ry", "50%")
    .attr("x", (d, i) => i % column * spacing)
    .attr("y", (d, i) => Math.floor(i / 8) % rows * spacing)
    .attr("fill", "#FFBF5D")
    .attr("opacity", (d,i)=> i < 29 ? 1 : 0)
}

let clayFoodGrid = () =>{
  rects
    .transition()
    .delay((d, i) => 10 * i)
    .duration(300)
    .attr("width", 25)
    .attr("height", 25)
    .attr("rx", "50%")
    .attr("ry", "50%")
    .attr("x", (d, i) => i % column * spacing)
    .attr("y", (d, i) => Math.floor(i / 8) % rows * spacing)
    .attr("fill", (d, i) => i <= 21  ? "#FF8E5D" : "#FFBF5D")
    .attr("opacity", (d,i)=> i < 29 ? 1 : 0)
}

let clayPovertyGrid = () =>{
  d3.select("#viz").style("position", "fixed");
  rects
    .transition()
    .delay((d, i) => 10 * i)
    .duration(300)
    .attr("width", 25)
    .attr("height", 25)
    .attr("rx", "50%")
    .attr("ry", "50%")
    .attr("x", (d, i) => i % column * spacing)
    .attr("y", (d, i) => Math.floor(i / 8) % rows * spacing)
    .attr("fill", (d, i) => {
        if (i <= 21) {
            if (i <= 10) return "#D80808";
            return "#FF8E5D";
        }
        return "#FFBF5D";
    })
    .attr("opacity", (d,i)=> i < 29 ? 1 : 0)
}

var mapSvg = d3.select("#map").append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + 1400 + " " + 650)
        .classed("svg-content", true);

let geoVis = () => {
    d3.select("#viz").style("position", "relative");
    
    rects
    .transition()
    .delay((d, i) => 10 * i)
    .duration(300)
    .attr("width", 25)
    .attr("height", 25)
    .attr("rx", "50%")
    .attr("ry", "50%")
    .attr("x", (d, i) => i % column * spacing)
    .attr("y", (d, i) => Math.floor(i / 8) % rows * spacing)
    .attr("fill", (d, i) => {
        if (i <= 21) {
            if (i <= 10) return "#D80808";
            return "#FF8E5D";
        }
        return "#FFBF5D";
    })
    .attr("opacity", 0)


    var width = 1200;
    var height = 650;

    // Scales and centers map
    var projection = d3.geoMercator().translate([width/2, height/2]).scale(4000).center([-82.6,31.7]);
    var path = d3.geoPath().projection(projection);

    var map = d3.json("map_data/ga_counties.json");
    var access = d3.csv("data/ACCESS.csv");
    // Popup for county name when hovering
    var tooltip = d3.select("body").append("div") 
        .attr("class", "tooltip")       
        .style("opacity", 0);


    var colorScale = d3.scaleLinear()
        .range(['#fef0d9','#fdcc8a','#fc8d59','#e34a33','#b30000'])
        .domain([0, 20, 40, 60, 80, 100]);

    // legend setup
    var legendWidth = 300
    var legendScale = d3.scaleLinear()
        .range([-legendWidth/2, legendWidth/2])
        .domain([0, 100]);


    var defs = mapSvg.append("defs");

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
    var legendSvg = mapSvg.append('g')
        .attr('class', 'legendWrapper')
        .attr('transform', 'translate(420, 500)');
        
    legendSvg.append("rect")
        .attr("width", legendWidth)
        .attr("height", 10)
        .style("fill", "url(#linear-gradient)");

    legendSvg.append("text")
        .attr("class", "legendTitle")
        .attr("x", 160.5)
        .attr("y", -10)
        .style("text-anchor", "middle")
        .style("margin", "-100px")
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
        mapSvg.selectAll("path")
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

}


//waypoints scroll constructor
function scroll(n, offset, func1, func2){
  return new Waypoint({
    element: document.getElementById(n),
    handler: function(direction) {
       direction == 'down' ? func1() : func2();
    },
    //start 75% from the top of the div
    offset: offset
  });
};


//triger these functions on page scroll
new scroll('div2', '55%', gaFoodGrid, gaGrid);
new scroll('div4', '55%', clayGrid, gaFoodGrid);
new scroll('div5', '55%', clayFoodGrid, clayGrid);
new scroll('div6', '55%', clayPovertyGrid, clayFoodGrid);
new scroll('div7', '25%', geoVis, clayPovertyGrid)


//start grid on page load
gaGrid();
