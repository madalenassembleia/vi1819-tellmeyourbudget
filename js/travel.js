$(document).ready(function () {
  var fills = {
    'darkBlue': '#233656',
    'blue': '#415b76',
    'lightBlue': '#7b9ba6',
    'grey': '#cdd6d5',
    'white': '#eef4f2',
    defaultFill: '#415b76'
  }

  selected_countries = [];

  var map = new Datamap({
        element: document.getElementById('map'),
        fills: fills,
        geographyConfig: {
          borderColor: '#fff',
          borderWidth: 0.2,
          /*
          highlightFillColor: '#233656',
          highlightBorderColor: '#233656'*/
          highlightOnHover: false
        },
        data: {
        },
        done: function (datamap) {
          datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
            var country_id = geography.id;
            if (selected_countries.includes(country_id) === false && selected_countries.length < 5) {
              var new_fills = {
                [country_id] : {
                  fillKey: 'lightBlue'
                }
              };
              selected_countries.push(country_id);
            }
            else if (selected_countries.includes(country_id) === true) {
              var new_fills = {
                [country_id] : {
                  fillKey: 'defaultFill'
                }
              };
              var index = selected_countries.indexOf(country_id);
              selected_countries.splice(index, 1);
            }
            datamap.updateChoropleth(new_fills);
        });


      }
  });

  d3.csv("top_cheapest_2.csv", function (data) {
    $('input[id^="form"]').change(function() {
      if($('#form-accomodation').is(':checked')) {
        var top_countries = data[0];


      }
      else if($('#form-food').is(':checked')) {
        console.log("food");
      }
      else if($('#form-transportation').is(':checked')) {
        console.log("transportation");
      }
      else if($('#form-culture').is(':checked')) {
        console.log("culture");

      }
      else if($('#form-alcohol').is(':checked')) {
        console.log("alcohol");
      }
      else if($('#form-shopping').is(':checked')) {
        console.log("shopping");
      }
    });
  });

  genDotPlot();
});
/*
var dataset;
var visited_countries;
var pinnedCountries = false;

d3.csv("top_cheapest.csv").then(function (data) {
    dataset = data;
    gen_vis();
    gen_graph(data);
    select_countries(data);
});

function gen_vis() {
  var selected_countries = [];
	var width = window.innerWidth,
	    height = window.innerHeight,
	    centered,
	    clicked_point;

	var projection = d3.geoNaturalEarth1()
                   .center([0, 15])
                   .rotate([-9,0])
                   .scale([1300/(2*Math.PI)])
                   .translate([450,300]);

	var plane_path = d3.geoPath()
	        .projection(projection);

	var svg = d3.select("#map").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("class", "map");

  var tooltip = d3.select("#map").append("div")
      .attr("class", "tooltip");

	var g = svg.append("g");
	var path = d3.geoPath()
	    .projection(projection);

  // parse the country files
  var files = ["world_dataset.json", "world_country_names.csv"];
  var promises = [];
  promises.push(d3.json(files[0]));
  promises.push(d3.csv(files[1]));

  Promise.all(promises).then(function(values) {
    var topology = values[0];
    var names = values[1];

    var countries1 = topojson.feature(topology, topology.objects.countries).features;
    countries = countries1.filter(function(d) {
    return names.some(function(n) {
      if (d.id == n.id)  {
        return d.name = n.name;
      }
    })});
    g.selectAll("path")
      .data(countries)
      .enter()
      .append("path")
      .attr("d", path)
      .on("mouseover",function(d,i){
                d3.select(this).classed('coutry_tooltip', true);
                return tooltip.style("hidden", false).html(d.name);

            })
            .on("mousemove",function(d,i){
                tooltip.classed("hidden", false)
                       .style("top", (d3.event.pageY) + "px")
                       .style("left", (d3.event.pageX + 10) + "px")
                       .html(d.name);
            })
            .on("mouseout",function(d,i){
                d3.select(this).classed('coutry_tooltip', false);
                tooltip.classed("hidden", true);
            })
            .on('click', selected)
      ;
  });

  function selected(d) {
    if (selected_countries.includes(d.id) == false && selected_countries.length < 5){
      d3.select(this).classed('active', true);
      selected_countries.push(d.id);
      return
    }
    else if(selected_countries.includes(d.id) == true){
      d3.select(this).classed('active', false);
      var index = selected_countries.indexOf(d.id);
      selected_countries.splice(index, 1);
      return
    }
      //debugger;
    //d3.select('.acitve').classed('active', false);
    return
  }
}

function select_countries(data) {
  $('input[id^="form"]').change(function() {
    if($('#form-accomodation').is(':checked')) {
    }
    else if($('#form-food').is(':checked')) {
      console.log("food");
    }
    else if($('#form-transportation').is(':checked')) {
      console.log("transportation");
    }
    else if($('#form-culture').is(':checked')) {
      console.log("culture");

    }
    else if($('#form-alcohol').is(':checked')) {
      console.log("alcohol");
    }
    else if($('#form-shopping').is(':checked')) {
      console.log("shopping");
    }
  });

function gen_graph(data){

  var w = window.innerWidth/3, h = window.innerHeight/3;
  var padding = 20;

  if (!pinnedCountries){
    pinnedCountries = true;
      var yscale = d3.scaleLinear()
                      .domain([0, 50])
                      .rangeRound([h-padding, padding]);

      var xscale = d3.scaleBand()
                      .domain(data.map(function(d){ return d.Country;})) // muito certo omg
                      .range([padding, w-padding]);

      var yaxis = d3.axisLeft()
                    .scale(yscale);

      //var bar_w = Math.floor(w/(data[1].length*2))-1;

      var xaxis = d3.axisBottom()
                    .scale(xscale)
                    .ticks(5);

      var svg = d3.select("#rankedgraph").append("svg")
                  .attr("width", w)
                  .attr("height", h)
                  .attr("class", "rankedgraph");

      svg.append("g")
          .attr("class", "yaxis")
          .attr("transform","translate(30,0)")
          .call(yaxis);

      //console.log(h-padding-yscale(d.Hostel));


      var bar = svg.append("g").attr("id", "GraphBars")
           .selectAll("rect")
               .data(data)
           .enter().append("rect")
               .attr("width",Math.floor(w/((data.length+3)))-1) //21
               .attr("height", function(d){ return h-yscale(parseInt(d.Hostel));})
               .attr("x", function(d){ return (padding + xscale(d.Country));})
               .attr("y", function(d){ return (-(padding) + yscale(parseInt(d.Hostel)));})
               .attr("fill","#7AC5CD");

      svg.append("g")
            .attr("class", "xaxis")
            .attr("transform", "translate (10," + (h-padding) + ")")
            .call(xaxis);
  }

  else{
      //ir buscar paises do outro mapa
  }

}
function updatePinned(){
  if(selected_countries.length<=1)
    pinnedCountries = true;
}
*/

function genDotPlot(){

  //setup

  var fullwidth = 700, fullheight = 350;

  // these are the margins around the graph. Axes labels go in margins.
  var margin = {top: 20, right: 25, bottom: 20, left: 200};

  var width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  margin.left= margin.left-90

  var widthScale = d3.scale.linear()
            .range([ 0, width]);

  var heightScale = d3.scale.ordinal()
            .rangeRoundBands([ margin.top, height], 0.2);

  var xAxis = d3.svg.axis()
          .scale(widthScale)
          .orient("bottom");

  var yAxis = d3.svg.axis()
          .scale(heightScale)
          .orient("left")
          .innerTickSize([0]);

  var svg = d3.select("#dotplot").append("svg")
              .attr("width", fullwidth)
              .attr("height", fullheight)
              .attr("class", "dotplot");


  d3.csv("nnr.csv", function(error, data) {

    if (error) { console.log("error reading file"); }

    data.sort(function(a, b) {
      return d3.descending(+a.h2star, +b.h2star);
    });


    widthScale.domain([0, 60]);

    // js map: array out of all the d.region fields
    heightScale.domain(data.map(function(d) { return d.region; } ));

    /*

    var description = svg.selectAll("names")
                       .data(data)
                       .enter()
                       .append("title");

   description.text(function(d) {
     return d.region[0];
   });*/


    // Make the faint lines from y labels to highest dot

    var linesGrid = svg.selectAll("lines.grid")
      .data(data)
      .enter()
      .append("line");

    linesGrid.attr("class", "grid")
      .attr("x1", margin.left)
      .attr("y1", function(d) {
        return heightScale(d.region) + heightScale.rangeBand()/2;
      })
      .attr("x2", function(d) {
        return margin.left + widthScale(+d.h2star);

      })
      .attr("y2", function(d) {
        return heightScale(d.region) + heightScale.rangeBand()/2;
      });

    // Make the dotted lines between the dots

    var linesBetween = svg.selectAll("lines.between")
      .data(data)
      .enter()
      .append("line");


    linesBetween.attr("class", "between")
      .attr("x1", function(d) {
        return margin.left + widthScale(+d.yh1star);
      })
      .attr("y1", function(d) {
        return heightScale(d.region) + heightScale.rangeBand()/2;
      })
      .attr("x2", function(d) {
        return margin.left + widthScale(d.h2star);
      })
      .attr("y2", function(d) {
        return heightScale(d.region) + heightScale.rangeBand()/2;
      })
      .attr("stroke-dasharray", "5,5")
      .attr("stroke-width", "0.5");


    // Make the dots for h1star

    var dotsh1star = svg.selectAll("circle.h1star")
        .data(data)
        .enter()
        .append("circle");

    dotsh1star
      .attr("class", "h1star")
      .attr("cx", function(d) {
        return margin.left + widthScale(+d.h1star);
      })
      .attr("r", heightScale.rangeBand()/5)
      .attr("cy", function(d) {
        return heightScale(d.region) + heightScale.rangeBand()/2;
      })
      .style("fill", function(d){
        if (d.region === "World") {
          return "#333399";
        }
      })
      .append("title")
      .text(function(d) {
        return d.region + " in h1star: " + d.h1star + "%";
      });

    // Make the dots for h2star

    var dotsh2star = svg.selectAll("circle.h2star")
        .data(data)
        .enter()
        .append("circle");

    dotsh2star
      .attr("class", "h2star")
      .attr("cx", function(d) {
        return margin.left + widthScale(+d.h2star);
      })
      .attr("r", heightScale.rangeBand()/5)
      .attr("cy", function(d) {
        return heightScale(d.region) + heightScale.rangeBand()/2;
      })
      .style("fill", function(d){
        if (d.region === "World") {
          return "#CC0000";
        }
      })
      .append("title")
      .text(function(d) {
        return d.region + " in h2star: " + d.h2star + "%";
      });
/*
      // Make the dots for h3star

      var dotsh2star = svg.selectAll("circle.h3star")
          .data(data)
          .enter()
          .append("circle");

      dotsh2star
        .attr("class", "h3star")
        .attr("cx", function(d) {
          return margin.left + widthScale(+d.h2star);
        })
        .attr("r", heightScale.rangeBand()/2)
        .attr("cy", function(d) {
          return heightScale(d.region) + heightScale.rangeBand()/2;
        })
        .style("fill", function(d){
          if (d.region === "World") {
            return "#CC0000";
          }
        })
        .append("title")
        .text(function(d) {
          return d.region + " in h3star: " + d.h3star + "%";
        });


        // Make the dots for h4star

        var dotsh2star = svg.selectAll("circle.h4star")
            .data(data)
            .enter()
            .append("circle");

        dotsh2star
          .attr("class", "h4star")
          .attr("cx", function(d) {
            return margin.left + widthScale(+d.h2star);
          })
          .attr("r", heightScale.rangeBand()/2)
          .attr("cy", function(d) {
            return heightScale(d.region) + heightScale.rangeBand()/2;
          })
          .style("fill", function(d){
            if (d.region === "World") {
              return "#CC0000";
            }
          })
          .append("title")
          .text(function(d) {
            return d.region + " in h4star: " + d.h4star + "%";
          });


          // Make the dots for h5star

          var dotsh2star = svg.selectAll("circle.h5star")
              .data(data)
              .enter()
              .append("circle");

          dotsh2star
            .attr("class", "h5star")
            .attr("cx", function(d) {
              return margin.left + widthScale(+d.h5star);
            })
            .attr("r", heightScale.rangeBand()/2)
            .attr("cy", function(d) {
              return heightScale(d.region) + heightScale.rangeBand()/2;
            })
            .style("fill", function(d){
              if (d.region === "World") {
                return "#CC0000";
              }
            })
            .append("title")
            .text(function(d) {
              return d.region + " in h5star: " + d.h5star + "%";
            });

*/
      // add the axes

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + margin.left + "," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + (margin.left) + ",-15)")
      .call(yAxis);

    svg.append("text")
      .attr("class", "xlabel")
      .attr("transform", "translate(" + (margin.left + width / 2) + " ," +
            (height + margin.bottom) + ")")
      .style("text-anchor", "middle")
      .attr("dy", "12")
      .text("Percent");

  });


}
