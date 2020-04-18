var svg = d3.select("svg"),
margin = {
	top: 20,
	right: 20,
	bottom: 30,
	left: 50
},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom,
g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%d-%b-%y");

var x = d3.scaleBand()
	.rangeRound([0, width])
	.padding(0.1);

var y = d3.scaleLinear()
  .rangeRound([height, 0]);
  
var div = d3.select("body").append("div")	
  .attr("class", "tooltip")				
  .style("opacity", 0);

d3.csv("DHEALTH.csv").then(function (data) {
	x.domain(data.map(function (d) {
			return d.County;
		}));
	y.domain([0, d3.max(data, function (d) {
				return Number(d.PCT_DIABETES_ADULTS13);
			})]);

	g.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x))

	g.append("g")
	.call(d3.axisLeft(y))
	.append("text")
	.attr("fill", "#000")
	.attr("transform", "rotate(-90)")
  .attr("y", -40)
	.attr("dy", "0.71em")
	.attr("text-anchor", "end")
	.text("Diabetes Rate (% of pop) ");

	g.selectAll(".bar")
	.data(data)
	.enter().append("rect")
  .attr("class", "bar")
  
	.attr("x", function (d) {
		return x(d.County);
	})
	.attr("y", function (d) {
		return y(Number(d.PCT_DIABETES_ADULTS13));
	})
	.attr("width", x.bandwidth())
	.attr("height", function (d) {
		return height - y(Number(d.PCT_DIABETES_ADULTS13));
  })
  .on("mouseover", function(d) {		
    div.transition()		
        .duration(200)		
        .style("opacity", .9);		
    div	.html((d.PCT_DIABETES_ADULTS13) + "<br/>"  + d.County)	
        .style("left", (d3.event.pageX) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");	
    })					
.on("mouseout", function(d) {		
    div.transition()		
        .duration(500)		
        .style("opacity", 0)	
});

});
