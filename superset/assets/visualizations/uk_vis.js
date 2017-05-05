var d3 = require("d3");
var topojson = require("topojson");
var px = window.px || require("../javascripts/modules/superset.js");
var mapJson = require("../../data/uk_shape.json");
var utils = require("../javascripts/modules/utils");
require("./uk_vis.css");
require("../javascripts/d3.tip.v0.6.3.js");

function UkViz(slice, json) {

    var div = d3.select(slice.selector);

    function onError(xhr) {
        slice.error(xhr.responseText, xhr);
    }

    var map_data = json.data.data_dictionary;
    var metric = json.data.metrics;
    var min = 0;
    var max = 0;

    for(var k in map_data) {
        if(map_data[k][0] > max){
            max = map_data[k][0];
        }
    }

    min = max;
    for(var k in map_data) {
        if(map_data[k][0] < min){
            min = map_data[k][0];
        }
    }


    var startColor = "red";
    var stopColor = "green";
    var color = d3.scale.linear()
    .domain([min,max])
    .range([startColor,stopColor]);

    var width = slice.width(),
    height = slice.height(),
    centered;

    var projection = d3.geo.albers()
    .center([0, 55.4])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(600 * height / 100  * 0.75)
    .translate([width / 2, height / 2]);

    var path = d3.geo.path()
    .projection(projection);

    var chartName = "chart"+slice.selector

    div.html("");
    var svg = div.append("svg")
              .attr("width", width)
              .attr("height", height);


    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", clicked);

    var g = svg.append("g");
    var tooltip_div = d3.select("body").append("tooltip_div")
              .attr("class", "tooltip")
              .style("opacity", 0);
    var tooltip_div_string="";

    var kjoin;

    g.append("g")
    .attr("id", "states")
    .selectAll(".uk_shape")
    .data(topojson.feature(mapJson, mapJson.objects.uk_shape).features)
    .enter().append("path")
    .attr("class", function(d) { let name = d.properties.NAME2; name = name.split(" ").join("_"); return "subunit " + name; })
    .attr("id", function(d) { let name = d.properties.NAME2; name = name.split(" ").join("_"); return slice.selector.replace("#","") + name; })
    .attr("d", path)
    .on("mousemove", function(d) {


      var tooltip_div_string="<table>" + "<th>" + d.properties.NAME2 + "</th>";

      for(var m=0; m< metric.length; m++){
        tooltip_div_string = tooltip_div_string + "<tr>"
        tooltip_div_string = tooltip_div_string +"<td>" +metric[m] + "</td>" +"<td>" +map_data[d.properties.NAME2][m] +"</td>";
        tooltip_div_string = tooltip_div_string + "</tr>"
      }
      tooltip_div_string = tooltip_div_string + "</table>"

          tooltip_div.transition()
              .duration(200)
              .style("opacity", 0.9);
          tooltip_div .html(tooltip_div_string)
              .style("left", d3.event.pageX -300 + "px")
              .style("top", d3.event.pageY-35 + "px");
          })
    .on("mouseout", function(d) {
          tooltip_div.transition()
              .duration(500)
              .style("opacity", 0);
      })
    .on("click", clicked)
    .style("overflow","scroll");

    for(var k in map_data) {
      let k_temp = k.replace(/[&\/\\#,+()$~%."":*?<>{}]/g,"_");

      kjoin = k_temp.split(" ").join("_");

      d3.select(slice.selector +kjoin).style("fill",color(map_data[k][0]));
    }
    function clicked(d) {
        var x, y, z;

        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            z = 4;
            centered = d;
        } else {
            x = width / 2;
            y = height / 2;
            z = 1;
            centered = null;
        }

        g.selectAll("path")
        .classed("active", centered && function(d) { console.log(d === centered);return d === centered; });

        g.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + z + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / z + "px");
    }
    var xpos = width/2;
    var ypos = height/6;
    var defs = g.append("defs");
    var linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient");

    linearGradient
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

    linearGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", startColor);

    //Set the color for the end (100%)
    linearGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", stopColor);

    g.append("rect")
    .attr("width", 150)
    .attr("height", 20)
    .attr("x", xpos-250)
    .attr("y", ypos)
    .attr("id", "map_legend")
    .style("fill", "url(#linear-gradient)");

    g.append("text")
    .attr("x", xpos-275)
    .attr("y", ypos - 15)
    .attr("dy", ".35em")
    .text(min)
    .style("font-weight" ,"bold")
    .style("fill", startColor);

    g.append("text")
    .attr("x", xpos-125)
    .attr("y", ypos - 15)
    .attr("dy", ".35em")
    .text(max)
    .style("font-weight" ,"bold")
    .style("fill", stopColor);

    g.append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("x", xpos -250)
     .attr("y", ypos + 40)
    .style("fill", "url(#linear-gradient)");

    g.append("text")
    .attr("x", xpos-210)
    .attr("y", ypos + 45)
    .attr("dy", ".35em")
    .text(metric[0])

    g.append("text")
    .attr("x", xpos-210)
    .attr("y", ypos + 60)
    .attr("dy", ".35em")
    .text("low to high")


}

module.exports = UkViz;
