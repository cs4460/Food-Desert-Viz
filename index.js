var svg = d3.select("svg");

// Get layout parameters
var svgWidth = +svg.attr("width");
var svgHeight = +svg.attr("height");

var padding = { t: 40, r: 40, b: 40, l: 40 };

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;
