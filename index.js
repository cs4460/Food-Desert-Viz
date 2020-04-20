let svg = d3.select("svg");

//svg width and height
svg.attr("width", 500).attr("height", 500);

//set up grid spacing
let spacing = 35;
let rows = 10;
let column = 8;
let randnum = (min, max) => Math.round(Math.random() * (max - min) + min);

//Create an array of objects
let our_data = d3.range(51);

//create group and join our data to that group
let group = svg.selectAll("g").data(our_data).enter().append("g");

//create rectangles
let rects = group.append("rect");

let georgiaGrid = () => {
  rects
    .transition()
    .delay((d, i) => 10 * i)
    .duration(600)
    .attr("width", 25)
    .attr("height", 25)
    .attr("rx", "60%")
    .attr("ry", "50%")
    .attr("x", (d, i) => (i % column) * spacing + 50)
    .attr("y", (d, i) => (Math.floor(i / 8) % rows) * spacing + 50)
    .attr("fill", "#FFBF5D")
    .attr("opacity", "1");
};

var arr = [];
while (arr.length < 18) {
  var r = Math.floor(Math.random() * 50);
  if (arr.indexOf(r) === -1) arr.push(r);
}

let gaFoodGrid = () => {
  rects
    .transition()
    .delay((d, i) => 10 * i)
    .duration(300)
    .attr("width", 25)
    .attr("height", 25)
    .attr("rx", "60%")
    .attr("ry", "50%")
    .attr("x", (d, i) => (i % column) * spacing + 50)
    .attr("y", (d, i) => (Math.floor(i / 8) % rows) * spacing + 50)
    .attr("fill", (d, i) => (arr.indexOf(i) !== -1 ? "#FF8E5D" : "#FFBF5D"));
};

let clayGrid = () => {
  rects
    .transition()
    .delay((d, i) => 10 * i)
    .duration(300)
    .attr("width", 25)
    .attr("height", 25)
    .attr("rx", "50%")
    .attr("ry", "50%")
    .attr("x", (d, i) => (i % column) * spacing + 50)
    .attr("y", (d, i) => (Math.floor(i / 8) % rows) * spacing + 50)
    .attr("fill", "#FFBF5D")
    .attr("opacity", (d, i) => (i < 29 ? 1 : 0));
};

let clayFoodGrid = () => {
  rects
    .transition()
    .delay((d, i) => 10 * i)
    .duration(300)
    .attr("width", 25)
    .attr("height", 25)
    .attr("rx", "50%")
    .attr("ry", "50%")
    .attr("x", (d, i) => (i % column) * spacing + 50)
    .attr("y", (d, i) => (Math.floor(i / 8) % rows) * spacing + 50)
    .attr("fill", (d, i) => (i <= 21 ? "#FF8E5D" : "#FFBF5D"))
    .attr("opacity", (d, i) => (i < 29 ? 1 : 0));
};

let clayPovertyGrid = () => {
  svg.attr("width", 500).attr("height", 500);
  d3.selectAll("#barchart").remove();

  //   d3.select("#viz").remove();
  //   mapSvg.selectAll("*").remove();
  //   tooltip.selectAll("*").remove();
  rects
    .transition()
    .delay((d, i) => 10 * i)
    .duration(300)
    .attr("width", 25)
    .attr("height", 25)
    .attr("rx", "50%")
    .attr("ry", "50%")
    .attr("x", (d, i) => (i % column) * spacing + 50)
    .attr("y", (d, i) => (Math.floor(i / 8) % rows) * spacing + 50)
    .attr("fill", (d, i) => {
      if (i <= 21) {
        if (i <= 10) return "#D80808";
        return "#FF8E5D";
      }
      return "#FFBF5D";
    })
    .attr("opacity", (d, i) => (i < 29 ? 1 : 0));
};

let barchart = () => {
  d3.select("#viz").style("position", "fixed");
  d3.selectAll("#map").remove();
  svg.transition().duration(300).attr("width", 500).attr("height", 500);
  rects
    .transition()
    .delay((d, i) => 0.1 * i)
    .duration(300)
    .attr("opacity", 0);
  var margin = {
      top: 10,
      right: 20,
      bottom: 30,
      left: 50,
    },
    width = 570 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    barchart = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("id", "barchart");
  var parseTime = d3.timeParse("%d-%b-%y");
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  var y = d3.scaleLinear().rangeRound([height, 0]);
  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  d3.csv("DHEALTH.csv").then(function (data) {
    x.domain(
      data.map(function (d) {
        return d.County;
      })
    );
    y.domain([
      0,
      d3.max(data, function (d) {
        return Number(d.PCT_DIABETES_ADULTS13);
      }),
    ]);
    barchart
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    barchart
      .append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Diabetes Rate (% of pop) ");
    bars = barchart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("fill", (d, i) => {
        if (d.County == "Clay") {
          return "#FF8E5D";
        }
        return "#FFBF5D";
      })

      .attr("x", function (d) {
        return x(d.County);
      })
      .attr("y", function (d) {
        return y(Number(d.PCT_DIABETES_ADULTS13));
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - y(Number(d.PCT_DIABETES_ADULTS13));
      });
  });
};

let geoVis = () => {
  d3.select("#viz").style("position", "relative");
  d3.selectAll('#barchart').remove();
  svg.transition().duration(300).attr("width", 0).attr("height", 0);

    var mapSvg = d3.select("#graphic")
    .append("div")
        .attr("id", "map")
        .classed("svg-container", true)
        .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + 1400 + " " + 650)
            .classed("svg-content", true);
  rects
    .transition()
    .delay((d, i) => 10 * i)
    .duration(300)
    .attr("width", 25)
    .attr("height", 25)
    .attr("rx", "50%")
    .attr("ry", "50%")
    .attr("x", (d, i) => (i % column) * spacing)
    .attr("y", (d, i) => (Math.floor(i / 8) % rows) * spacing)
    .attr("fill", (d, i) => {
      if (i <= 21) {
        if (i <= 10) return "#D80808";
        return "#FF8E5D";
      }
      return "#FFBF5D";
    })
    .attr("opacity", 0);
  //   svg.selectAll("*").remove();
  var width = 1400;
  var height = 650;
  var selectedCounty;

  // Scales and centers map
  var projection = d3
    .geoMercator()
    .translate([width / 2, height / 2])
    .scale(4700)
    .center([-81, 31.7]);
  var path = d3.geoPath().projection(projection);

  var map = d3.json("map_data/ga_counties.json");
  var access = d3.csv("data/ACCESS.csv");
  var socio_data = d3.csv("data/SOCIOECONOMIC.csv");
  // Popup for county name when hovering
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var newDataTip = d3
    .select("body")
    .append("div")
    .attr("class", "newDataTip")
    .style("opacity", 0);

  var colorScale = d3
    .scaleLinear()
    .range(["#fef0d9", "#fdcc8a", "#fc8d59", "#e34a33", "#b30000"])
    .domain([0, 20, 40, 60, 80, 100]);

  // legend setup
  var legendWidth = 300;
  var legendScale = d3
    .scaleLinear()
    .range([-legendWidth / 2, legendWidth / 2])
    .domain([0, 100]);

  var defs = mapSvg.append("defs");

  var linearGradient = defs
    .append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

  linearGradient
    .selectAll("stop")
    .data(colorScale.range())
    .enter()
    .append("stop")
    .attr("offset", function (d, i) {
      return i / (colorScale.range().length - 1);
    })
    .attr("stop-color", function (d) {
      return d;
    });

  var legendAxis = d3.axisBottom().scale(legendScale);

  // draw legend
  var legendSvg = mapSvg
    .append("g")
    .attr("class", "legendWrapper")
    .attr("transform", "translate(350, 500)");

  legendSvg
    .append("rect")
    .attr("width", legendWidth)
    .attr("height", 10)
    .style("fill", "url(#linear-gradient)");

  legendSvg
    .append("text")
    .attr("class", "legendTitle")
    .attr("x", 149.5)
    .attr("y", -10)
    .style("text-anchor", "middle")
    .style("margin", "-100px")
    .text("% of Population with Low Access to Food");

  var g = mapSvg.append("g");

  // Promise allows multiple iterables to be passed through
  Promise.all([map, access, socio_data]).then(function (values) {
    // console.log(values[0]);
    // Combines map data with ACCESS data
    values[0].features.forEach(function (v_0) {
      var result = values[1].filter(function (v_1) {
        return v_1.County === v_0.properties.NAME;
      });
      v_0.data = result[0] !== undefined ? result[0] : null;
    });

    values[0].features.forEach(function (v_0) {
      var result = values[2].filter(function (v_1) {
        return v_1.County === v_0.properties.NAME;
      });
      v_0.socio_data =
        result[0] !== undefined ? result[0] : console.log("null");

      v_0.data.Food_Percentage =
        (parseFloat(v_0.data.PCT_LACCESS_POP15) +
          parseFloat(v_0.socio_data.POVRATE15)) /
        2;
      console.log(v_0.data.Food_Percentage);
    });

    // draws map
    g.selectAll("path")
      .data(values[0].features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("d", path)
      .attr("fill", function (d) {
        return colorScale(d.data.PCT_LACCESS_POP15);
      })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", clicked);
    // legend axis
    legendSvg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(149.5," + 10 + ")")
      .call(legendAxis);
  });

  function mouseover(d) {
    if (d3.select(this).classed("inactive")) {
      return;
    }
    tooltip.transition().duration(200).style("opacity", 0.9);

    tooltip
      .html(
        "County Name: " +
          d.properties.NAME +
          "<br/>" +
          "Low Access: " +
          parseFloat(d.data.PCT_LACCESS_POP15).toFixed(2) +
          "%" +
          "<br/>" +
          "Poverty Rate: " +
          parseFloat(d.socio_data.POVRATE15).toFixed(2) +
          "%"
      )
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY - 28 + "px");
  }

  function mouseout(d) {
    tooltip.transition().duration(500).style("opacity", 0);
  }

  function clicked(d) {
    var x, y, k;

    if (d && selectedCounty !== d) {
      var centroid = path.centroid(d);
      x = centroid[0] + 50;
      y = centroid[1] + 20;
      k = 4;
      selectedCounty = d;
    } else {
      x = width / 2;
      y = height / 2;
      k = 1;
      selectedCounty = null;
    }

    newDataTip.transition().duration(200).style("opacity", 0.9);

    newDataTip
      .html(
        "<h1>County Name: " +
          d.properties.NAME +
          "</h1>" +
          "<h2>" +
          "2015" +
          "</h2>" +
          "Population Low Access: " +
          parseFloat(d.data.PCT_LACCESS_POP15).toFixed(2) +
          "%" +
          "<br/>" +
          "Low Income and Low Access to stores: " +
          parseFloat(d.data.PCT_LACCESS_LOWI15).toFixed(2) +
          "%" +
          "<br/>" +
          "Households, no car & low access to store: " +
          parseFloat(d.data.PCT_LACCESS_HHNV15).toFixed(2) +
          "%" +
          "<br/>" +
          "SNAP households, low access to store: " +
          parseFloat(d.data.PCT_LACCESS_SNAP15).toFixed(2) +
          "%" +
          "<br/>" +
          "Children Low Access: " +
          parseFloat(d.data.PCT_LACCESS_CHILD15).toFixed(2) +
          "%" +
          "<br/>" +
          "Seniors Low Access: " +
          parseFloat(d.data.PCT_LACCESS_SENIORS15).toFixed(2) +
          "%" +
          "<br/>" +
          "White Low Access: " +
          parseFloat(d.data.PCT_LACCESS_WHITE15).toFixed(2) +
          "%" +
          "<br/>" +
          "Black Low Access: " +
          parseFloat(d.data.PCT_LACCESS_BLACK15).toFixed(2) +
          "%" +
          "<br/>" +
          "Hispanic Low Access: " +
          parseFloat(d.data.PCT_LACCESS_HISP15).toFixed(2) +
          "%" +
          "<br/>" +
          "Asian Low Access: " +
          parseFloat(d.data.PCT_LACCESS_NHASIAN15).toFixed(2) +
          "%" +
          "<br/>" +
          "Multiracial Low Access: " +
          parseFloat(d.data.PCT_LACCESS_MULTIR15).toFixed(2) +
          "%" +
          "<br/>" +
          "Poverty Rate: " +
          parseFloat(d.socio_data.POVRATE15).toFixed(2) +
          "%" +
          "<br/>" +
          "Child Poverty Rate: " +
          parseFloat(d.socio_data.CHILDPOVRATE15).toFixed(2) +
          "%"
        //   "<br/>" +
        //   "<h2>" +
        //   "2010" +
        //   "</h2>" +
        //   "Low Access: " +
        //   parseFloat(d.data.PCT_LACCESS_POP10).toFixed(2) +
        //   "%"
      )
      .style("left", d3.event.pageX - 300 + "px")
      .style("top", d3.event.pageY - 50 + "px");

    if (d3.select(this).classed("active")) {
      newDataTip.transition().duration(1).style("opacity", 0);
    }

    g.selectAll("path")
      .classed(
        "inactive",
        selectedCounty &&
          function (d) {
            return !(d === selectedCounty);
          }
      )
      .classed(
        "active",
        selectedCounty &&
          function (d) {
            return d === selectedCounty;
          }
      );

    g.transition()
      .duration(750)
      .attr(
        "transform",
        "translate(" +
          width / 2 +
          "," +
          height / 2 +
          ")scale(" +
          k +
          ")translate(" +
          -x +
          "," +
          -y +
          ")"
      )
      .style("stroke-width", 1.5 / k + "px");
  }
};

//waypoints scroll constructor
function scroll(n, offset, func1, func2) {
  return new Waypoint({
    element: document.getElementById(n),
    handler: function (direction) {
      direction == "down" ? func1() : func2();
    },
    //start 75% from the top of the div
    offset: offset,
  });
}

//triger these functions on page scroll
new scroll("div2", "55%", gaFoodGrid, georgiaGrid);
new scroll("div3", "55%", clayGrid, gaFoodGrid);
new scroll("div4", "55%", clayFoodGrid, clayGrid);
new scroll("div5", "55%", clayPovertyGrid, clayFoodGrid);
new scroll("div6", "75%", barchart, clayPovertyGrid);
new scroll("div7", "45%", geoVis, barchart);

//start grid on page load
georgiaGrid();
