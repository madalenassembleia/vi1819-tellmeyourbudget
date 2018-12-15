$(document).ready(function () {
  var fills = {
    'darkBlue': '#233656',
    'blue': '#415b76',
    'lightBlue': '#7b9ba6',
    'grey': '#cdd6d5',
    'white': '#eef4f2',
    defaultFill: '#415b76'
  }


  var selected_countries = [];

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
  d3.csv("top_cheapest.csv", function (data) {
    $('#submit').on('click', function() {
      var form_inputs = $("input[id^=form-]:checkbox:checked");
      var row_id = [];
      for(var i = 0; i < form_inputs.length; i++) {
        row_id.push(form_inputs[i].name);
      }
      row_id.sort();
      row_id = row_id.join('+');

      var top;
      for(var i = 0; i < data.length; i++) {
        if (data[i].filter == row_id) {
          top = data[i];
          break;
        }
      }

      resetChoropleth();
      selected_countries = [];

      top_1 = top.top_1.slice(1,4)
      top_2 = top.top_2.slice(1,4)
      top_3 = top.top_3.slice(1,4)
      top_4 = top.top_4.slice(1,4)
      top_5 = top.top_5.slice(1,4)

      selected_countries = [top_1, top_2, top_3, top_4, top_5];

      var fill = {
        [top_1] : {
          fillKey: 'lightBlue'
        },
        [top_2] : {
          fillKey: 'lightBlue'
        },
        [top_3] : {
          fillKey: 'lightBlue'
        },
        [top_4] : {
          fillKey: 'lightBlue'
        },
        [top_5] : {
          fillKey: 'lightBlue'
        }
      };
      updateChoropleth(fill);
    });
  });

  function updateChoropleth(new_fills) {
    map.updateChoropleth(new_fills);
  }

  function resetChoropleth() {
    for(var i = 0; i < selected_countries.length; i++) {
      var fill = {
        [selected_countries[i]] : {
          fillKey: 'defaultFill'
        }
      };
      updateChoropleth(fill);
    }
  }

  genBarChart();
  genDotPlot();
});
/*
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

  /*d3.csv("top_cheapest.csv", function (data) {
      gen_graph(data);
  });*/

/*
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
*/

/*function gen_graph(data){

  var pinnedCountries = false;
  var w = window.innerWidth/3, h = window.innerHeight/3;
  var padding = 20;

  if (!pinnedCountries){

    pinnedCountries = true;

    var yscale = d3.scale.linear()
                      .domain([0, 50])
                      .rangeRound([h-padding, padding]);

    var xscale = d3.scaleBand() //ORDINAL?
                      .domain(data.map(function(d){ return d.Country;})) // muito certo omg
                      .range([padding, w-padding]);

    /*var yaxis = d3.svg.axis()
                    .orient(); //TODO
                    .scale(yscale);

      //var bar_w = Math.floor(w/(data[1].length*2))-1;

      var xaxis = d3.svg.axis()
                    .scale(xscale)
                    .orient() //TODO
                    .ticks(5);

      var svg = d3.select("#rankedgraph").append("svg")
                  .attr("width", w)
                  .attr("height", h)
                  .attr("class", "rankedgraph");

      svg.append("g")
          .attr("class", "yaxis")
          .attr("transform","translate(30,0)")
          .call(yaxis);


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

var optionValue = "Hotel";


function genDotPlot(){

  var fullwidth = 700, fullheight = 300;
  var margin = {top: 20, right: 25, bottom: 20, left: 200};
  var width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  margin.left = margin.left - 90;

  d3.csv("accommodation_food_costs.csv", function(error, data) {

  var options = ["Hotel", "Food"];

  //filter
  console.log(Object.keys(data[0]))
	var elements = Object.keys(data[0]).filter(function(d){
        if (optionValue == "Hotel"){
          return ((d != "id") &&(d!="Country") &&(d!="food") && (d!="food_expensive"));
        }
        else{
          return ((d!="id") && (d != "region")  &&(d!="Country") && (d != "accomodation")&& (d != "accomodation_1")&& (d != "accomodation_2")&& (d != "accomodation_3") && (d != "accomodation_4")  &&(d!="accomodation_5")); //inc
        }
		});

    console.log("elements: ", elements)
    var selection = elements[0];

 //scales
  var widthScale = d3.scale.linear()
            .range([ 0, width/1.3]);

  var heightScale = d3.scale.ordinal()
            .rangeRoundBands([margin.top, (height/1.5)], 0.2);

  var xAxis = d3.svg.axis()
          .scale(widthScale)
          .orient("bottom");

  var yAxis = d3.svg.axis()
          .scale(heightScale)
          .orient("left")
          .outerTickSize(0)
          .innerTickSize([0]);

  var svg = d3.select("#dotplot").append("svg")
              .attr("width", fullwidth)
              .attr("height", fullheight)
              .attr("class", "dotplot");


    if (error) { console.log("error reading file"); }

    data.sort(function(a, b) {
      return d3.descending(+a[elements[elements.length - 1]], +b[elements[elements.length - 1]]);
    });

    var max = d3.max(data, d => d[elements[elements.length - 1]]*1);
    console.log("max", max)


    widthScale.domain([0, max*1.3]); //mudar valor

    // js map: array out of all the d.region fields
    heightScale.domain(data.map(function(d) { return d.Country; } ));

    // Make the faint lines from y labels to highest dot

    var linesGrid = svg.selectAll("lines.grid")
      .data(data)
      .enter()
      .append("line");

    linesGrid.attr("class", "grid")
      .attr("x1", margin.left)
      .attr("y1", function(d) {
        return heightScale(d.Country) + heightScale.rangeBand()/4;
      })
      .attr("x2", function(d) {
        return margin.left + widthScale(+d[elements[0]]);

      })
      .attr("y2", function(d) {
        return heightScale(d.Country) + heightScale.rangeBand()/4;
      });

    // Make the dotted lines between the dots

    var linesBetween = svg.selectAll("lines.between")
      .data(data)
      .enter()
      .append("line");


    linesBetween.attr("class", "between")
      .attr("x1", function(d) {
        return margin.left + widthScale(+d[elements[0]]);
      })
      .attr("y1", function(d) {
        return heightScale(d.Country) + heightScale.rangeBand()/4;
      })
      .attr("x2", function(d) {
        return margin.left + widthScale(d[elements[elements.length - 1]]);
      })
      .attr("y2", function(d) {
        return heightScale(d.Country) + heightScale.rangeBand()/4;
      })
      .attr("stroke-dasharray", "5,5")
      .attr("stroke-width", "0.5");


    // Make the dots for hostel
    var dotshostel = svg.selectAll("circle.hostel")
        .data(data)
        .enter()
        .append("circle");

    dotshostel
      .attr("class", "hostel")
      .attr("cx", function(d) {
        return margin.left + widthScale(+d[elements[0]]);
      })
      .attr("r", function(d){
        if (+d[elements[0]] == "0"){
          $("hostel").css("opacity", "0.0");
        }
        else{
          $("hostel").css("opacity", "1.0");
        }
          return heightScale.rangeBand()/9;
      })
      .attr("cy", function(d) {
          return heightScale(d.Country) + heightScale.rangeBand()/4;
      })
      .append("title")
      .text(function(d) {
        return d.Country + " in hostel: " + d[elements[0]] + "€";
      });


      // Make the dots for h1star

      var dotsh1star = svg.selectAll("circle.h1star")
          .data(data)
          .enter()
          .append("circle");

      dotsh1star
        .attr("class", "h1star")
        .attr("cx", function(d) {
          return margin.left + widthScale(+d[elements[1]]);
        })
        .attr("r", function(d,i){
          if (+d[elements[1]] == "0"){
            $("circle.hostel").css("opacity", "0.0");
          }
          else{
            $("circle.hostel").css("opacity", "1.0");
          }
            return heightScale.rangeBand()/9;
        })
        .attr("cy", function(d) {
            return heightScale(d.Country) + heightScale.rangeBand()/4;
        })
        .append("title")
        .text(function(d) {
          return d.Country + " in h1star: " + d[elements[1]] + "€";
        });


if (optionValue == "Hotel"){

  // Make the dots for h2star
    var dotsh2star = svg.selectAll("circle.h2star")
        .data(data)
        .enter()
        .append("circle");

    dotsh2star
      .attr("class", "h2star")
      .attr("cx", function(d) {
        return margin.left + widthScale(+d[elements[2]]);
      })
      .attr("r", function(d,i){
        if (+d[elements[2]] == "0"){
          $("circle.hostel").css("opacity", "0.0");
        }
        else{
          $("circle.hostel").css("opacity", "1.0");
        }
          return heightScale.rangeBand()/9;
      })
      .attr("cy", function(d) {
        return heightScale(d.Country) + heightScale.rangeBand()/4;
      })
      .append("title")
      .text(function(d) {
        return d.Country + " in 2-star hotel: " +d[elements[2]] + "€";
      });

      // Make the dots for h3star

      var dotsh3star = svg.selectAll("circle.h3star")
          .data(data)
          .enter()
          .append("circle");

      dotsh3star
        .attr("class", "h3star")
        .attr("cx", function(d) {
          return margin.left + widthScale(+d[elements[3]]);
        })
        .attr("r", function(d,i){
          if (+d[elements[3]] == "0"){
            $("circle.hostel").css("opacity", "0.0");
          }
          else{
            $("circle.hostel").css("opacity", "1.0");
          }
            return heightScale.rangeBand()/9;
        })
        .attr("cy", function(d) {
          return heightScale(d.Country) + heightScale.rangeBand()/4;
        })
        .append("title")
        .text(function(d) {
          return d.Country + " 3-star hotel: " +d[elements[3]] + "€";
        });


  // Make the dots for h4star

  var dotsh4star = svg.selectAll("circle.h4star")
      .data(data)
      .enter()
      .append("circle");

  dotsh4star.attr("class", "h4star")
            .attr("cx", function(d) {
                    return margin.left + widthScale(+d[elements[4]]);
                  })
                  .attr("r", function(d,i){
                    if (+d[elements[4]] == "0"){
                      $("circle.h4star").css("opacity", "0.0");
                    }
                    else{
                      $("circle.h4star").css("opacity", "1.0");
                    }
                      return heightScale.rangeBand()/9;
                  })
            .attr("cy", function(d) {
                    return heightScale(d.Country) + heightScale.rangeBand()/4;
                  })
            .append("title")
            .text(function(d) {
                    return d.Country + " in 4-star hotel: " + d[elements[4]] + "€";
                  });


    // Make the dots for h5star

    var dotsh5star = svg.selectAll("circle.h5star")
        .data(data)
        .enter()
        .append("circle");

    dotsh5star
      .attr("class", "h5star")
      .attr("cx", function(d) {
        return margin.left + widthScale(+d[elements[5]]);
      })
      .attr("r", function(d){
        if (+d[elements[5]] == "0"){
          $("circle.h5star").css("opacity", "0.0");
        }
        else{
          $("circle.h5star").css("opacity", "1.0");
        }
          return heightScale.rangeBand()/9;
      })
      .attr("cy", function(d) {
        return heightScale(d.Country) + heightScale.rangeBand()/4;
      })
      .append("title")
      .text(function(d) {
        return d.Country + " in 5-star hotel: " + +d[elements[5]]+ "%";
      });

  }
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
            (height + margin.bottom ) + ")")
      .style("text-anchor", "middle")
      .attr("dy", "12")
      .text("Percent");

      //var options=["Hotel", "Food"]

      var selector = d3.select("#drop")
                        .append("select")
                        .attr("id","dropdown")
                        .on("change", function(d){
                          optionValue = (document.getElementById("dropdown")).value;
                          console.log(optionValue)


      console.log("New Elements: ",elements)
      elements = Object.keys(data[0]).filter(function(d){
            if (optionValue == "Hotel"){
              return ((d != "id") &&(d!="Country") &&(d!="food") && (d!="food_expensive"));
            }
            else{
              return ((d!="id") && (d != "region")  &&(d!="Country") && (d != "accomodation")&& (d != "accomodation_1")&& (d != "accomodation_2")&& (d != "accomodation_3") && (d != "accomodation_4")  &&(d!="accomodation_5")); //inc
            }
    		});


      max = d3.max(data, d => d[elements[elements.length - 1]]*1);
      console.log(" new max", max)

      widthScale.domain([0, max*1.3]); //mudar valor

      //heightScale.domain(data.map(function(d) { return d.Country; } ));
      //yAxis.scale(heightScale);

      d3.selectAll("circle")
        .transition()
        .attr("cx", function(d) {
          return margin.left + widthScale(+d[elements[elements.length - 1]]);
        })
        .attr("r", heightScale.rangeBand()/9)
        .attr("cy", function(d) {
          return heightScale(d.Country) + heightScale.rangeBand()/4;
        });

        d3.selectAll("g.y.axis")
          .transition()
          .call(yAxis);

      });
      selector.selectAll("option")
              .data(options)
              .enter().append("option")
              .attr("value", function(d){return d; })
              .text(function(d){ return d;
              })
       });
}


//BARCHART

var cList=[60,220,340,150];

function genBarChart(){
  d3.csv("total_costs.csv", function(data) {

    var margin = { top: 35, right: 0, bottom: 30, left: 40 };

    var width = 700 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var chart = d3.select("#barchart").selectAll(".bar").data(data)
                  .style("height", function(d){ return d; })
                  .style("margin-top", function(d){
        return height - d;
      });


      ///////////////////////
      // Scales
      var x = d3.scale.ordinal()
          .domain(data.map(function(d) { return d.Country; }))
          .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
          .domain([0, d3.max(data, function(d) { return d.accomodation_5; }) * 1.1])
          .range([(height/1.5), 0]);


      ///////////////////////
      // Axis

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (height/1.5) + ")")
          .call(xAxis);

      chart.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      ///////////////////////
      // Title
      chart.append("text")
        .text('Bar Chart!')
        .attr("text-anchor", "middle")
        .attr("class", "graph-title")
        .attr("y", -10)
        .attr("x", width / 2.0);

  //  chart.append("g")
  //       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    chart.enter()
         .append("div").attr("class","bar")
         .style("width", x.rangeBand())
         .style("height", function(d){return d;})
         .on("click", function(e, i){
           cList.splice(i,1);
           genBarChart();});

    chart.exit().remove();

    d3.select("#dataset").text(cList);


    ///////////////////////
    // Bars
    /*var bar = chart.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {return x(d['Country']); })
        .attr("y", height)
        .attr("width", x.rangeBand())
        .attr("height", 0);

    bar.transition()
        .duration(1500)
        .ease("elastic")
        .attr("y", function(d) {return parseFloat(d['Hostel']); })
        .attr("height", function(d) {return (height/1.5) - parseFloat(d['Hostel']); })*/

    ///////////////////////
  // Tooltips
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip");

  /*bar.on("mouseover", function(d) {
        tooltip.html(d['value'])
            .style("visibility", "visible");
      })
      .on("mousemove", function(d) {
        tooltip.style("top", event.pageY - (tooltip[0][0].clientHeight + 5) + "px")
            .style("left", event.pageX - (tooltip[0][0].clientWidth / 2.0) + "px");
      })
      .on("mouseout", function(d) {
        tooltip.style("visibility", "hidden");
      });*/
});

d3.select("#add-btn").on("click", function(e){

	if (cList.length < 5) cList.push(Math.round(Math.random() * 100)); //mete numero random para ja
  console.log(cList);
	genBarChart();

});
}
