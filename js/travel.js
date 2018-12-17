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

  var selectorDot = d3.select("#drop")
                    .append("select")
                    .attr("id","dropdown");


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
              d3.select("#dotplot").select("svg").remove();
              genDotPlot(selected_countries,selectorDot);
              $("#dropdownFloating").append(new Option(geography.properties.name, country_id));
              d3.select(".chart").select("svg").remove();
              genBarChart(selected_countries);
            }
            else if (selected_countries.includes(country_id) === true) {
              var new_fills = {
                [country_id] : {
                  fillKey: 'defaultFill'
                }
              };
              var index = selected_countries.indexOf(country_id);
              selected_countries.splice(index, 1);
              d3.select(".chart").select("svg").remove();
              genBarChart(selected_countries);
              d3.select("#dotplot").select("svg").remove();
              genDotPlot(selected_countries,selectorDot);
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
      d3.select(".chart").select("svg").remove();
      genBarChart(selected_countries);
      d3.select("#dotplot").select("svg").remove();
      genDotPlot(selected_countries,selectorDot);
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


  var selector = d3.select("#dropFloatBar")
                    .append("select")
                    .attr("id","dropdownFloating")
                    .on("change", function(d){
                      d3.select("#dropFloatBar").select("svg").remove();
                      var element = document.getElementById("dropdownFloating");
                      var value = element.options[element.selectedIndex].value;
                      genFloatingBar(value);
                    });

  genBarChart(selected_countries);

  genDotPlot();
  genFloatingBar("PRT");

  genDotPlot(selected_countries,selectorDot);
  genFloatingBar();

});

var optionValue = "Hotel";


function genDotPlot(selectedCountries,selectorDot){

  console.log(selectedCountries)

  var fullwidth = 700, fullheight = 400;
  var margin = {top: 20, right: 25, bottom: 20, left: 200};
  var width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  margin.left = margin.left - 90;

  d3.csv("accommodation_food_costs.csv", function(error, data) {

  var options = ["Hotel", "Food"];

  //Filter
  console.log(Object.keys(data[0]))
	var elements = Object.keys(data[0]).filter(function(d){
        if (optionValue == "Hotel"){
          return ((d != "id") &&(d!="Country") &&(d!="food") && (d!="food_expensive"));
        }
        else{
          return ((d!="id") && (d != "region")  &&(d!="Country") && (d != "accomodation")&& (d != "accomodation_1")&& (d != "accomodation_2")&& (d != "accomodation_3") && (d != "accomodation_4")  &&(d!="accomodation_5")); //inc
        }
		});

var newList = [];
console.log("Selected Countries:", selectedCountries)

if (selectedCountries.length == 0){
  console.log("sim")
  for (var i = 0; i < 5; i++){
        newList.push(data[i]);
  }
}
else{
  console.log("Data:", data)
  console.log("new List: ", newList)

  for (var i = 0; i < data.length; i++){
    for (var j = 0; j < selectedCountries.length; j ++){
      if (data[i].id == selectedCountries[j]){
        newList.push(data[i]);
      }
    }
  }
}

console.log("new List updated: ", newList)

  /*  console.log(subtitles)
    subtitles.fitler(function(d){
      if (optionValue == "Hotel"){
        return ((d != "McDonalds") &&(d!="2-Course Meal"));
      }
      else{
        return ((d!="1-star") && (d != "2-star")  &&(d!="3-star") && (d != "4-star")&& (d != "5-star"));
      }
    })*/

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

    newList.sort(function(a, b) {
      return d3.descending(+a[elements[elements.length - 1]], +b[elements[elements.length - 1]]);
    });

    var max = d3.max(newList, d => d[elements[elements.length - 1]]*1);
    widthScale.domain([0, max*1.3]);
    heightScale.domain(newList.map(function(d) { return d.Country; } ));


  var legendX = 200,
    legendY = 320,
    spaceBetween = 70,
    titleOffset = -120;

    // code for positioning legend
    var legend = svg.append("g")
      .attr("transform", "translate(" + [legendX, legendY] + ")");

    legend.append("g")
      .attr("class", "title")
      .append("text")
      .attr("x", titleOffset)
      .text("Description")

      legend.selectAll("circle")
    	.data(newList)
    .enter().append("circle")
    	.attr("cx", function(d, i) {
      	return spaceBetween * i;
    	})
    	.attr("cy", -4)
    	.attr("r", 5)
    	.attr("class", function(d) { });
/*
    // add labels
    legend.append("g")
      .selectAll("text")
    	.data(legendLabels)
    .enter().append("text")
      .attr("x", function(d, i) {
      	return spaceBetween * i + 10;
    	})
    	.text(function(d) { return d.label });
*/

    // Make the faint lines from y labels to highest dot
    var linesGrid = svg.selectAll("lines.grid")
      .data(newList)
      .enter()
      .append("line");

    linesGrid.attr("class", "grid")
      .attr("x1", margin.left)
      .attr("y1", function(d) {
        return heightScale(d.Country) + heightScale.rangeBand()/4;
      })
      .attr("x2", function(d) {
        if (+d[elements[0]] != 0){
          return margin.left + widthScale(+d[elements[0]]);
        }
        else { return margin.left + widthScale(+d[elements[1]]);}

      })
      .attr("y2", function(d) {
        return heightScale(d.Country) + heightScale.rangeBand()/4;
      });

    // Make the dotted lines between the dots

    var linesBetween = svg.selectAll("lines.between")
      .data(newList)
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
        .data(newList)
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
        return "" + d[elements[0]] + "€";
      });


      // Make the dots for h1star

    var dotsh1star = svg.selectAll("circle.h1star")
          .data(newList)
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
          return  d[elements[1]] + "€";
        });


if (optionValue == "Hotel"){

  // Make the dots for h2star
    var dotsh2star = svg.selectAll("circle.h2star")
        .data(newList)
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
        return d[elements[2]] + "€";
      });

      // Make the dots for h3star

      var dotsh3star = svg.selectAll("circle.h3star")
          .data(newList)
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
          return d[elements[3]] + "€";
        });


  // Make the dots for h4star

  var dotsh4star = svg.selectAll("circle.h4star")
      .data(newList)
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
                    return d[elements[4]] + "€";
                  });


    // Make the dots for h5star

    var dotsh5star = svg.selectAll("circle.h5star")
        .data(newList)
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
        return d[elements[5]] + "€";
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



      //Update dot plot
     selectorDot.on("change", function(d){
      optionValue = (document.getElementById("dropdown")).value;
      console.log(optionValue)



      console.log("New Elements: ", elements)
      elements = Object.keys(data[0]).filter(function(d){
            if (optionValue == "Hotel"){
              return ((d != "id") &&(d!="Country") &&(d!="food") && (d!="food_expensive"));
            }
            else{
              return ((d != "id") && (d != "region")  &&(d!="Country") && (d != "accomodation")&& (d != "accomodation_1")&& (d != "accomodation_2")&& (d != "accomodation_3") && (d != "accomodation_4")  &&(d!="accomodation_5")); //inc
            }
    		});


      max = d3.max(newList, d => d[elements[elements.length - 1]]*1);
      console.log(" new max", max)

      widthScale.domain([0, max*1.3]); //mudar valor
      xAxis.scale(widthScale);

        d3.selectAll("line.grid")
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

          d3.selectAll("line.between")
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

      //heightScale.domain(data.map(function(d) { return d.Country; } ));
      //yAxis.scale(heightScale);

      d3.selectAll("circle.hostel")
        .transition()
        .attr("cx", function(d) {
          return margin.left + widthScale(+d[elements[0]]);
        })
        .attr("r", heightScale.rangeBand()/9)
        .attr("cy", function(d) {
          return heightScale(d.Country) + heightScale.rangeBand()/4;
        })
        .text(function(d) {
                console.log("Novo texto: ", d[elements[0]] )
                return d[elements[0]] + "€";
        });

        d3.selectAll("g.y.axis")
          .transition()
          .call(yAxis);

        d3.selectAll("circle.h1star")
          .transition()
          .attr("cx", function(d) {
            return margin.left + widthScale(+d[elements[1]]);
          })
          .attr("r", heightScale.rangeBand()/9)
          .attr("cy", function(d) {
            return heightScale(d.Country) + heightScale.rangeBand()/4;
          })
          .text(function(d) {
                  return d[elements[1]] + "€";
                });

        d3.selectAll("g.y.axis")
          .transition()
          .call(yAxis);

  console.log("Updated value: ", optionValue)

  if (optionValue == "Hotel"){

      d3.selectAll("circle.h2star")
        .transition()
        .attr("cx", function(d) {
          return margin.left + widthScale(+d[elements[2]]);
        })
        .attr("r", heightScale.rangeBand()/9)
        .attr("cy", function(d) {
          return heightScale(d.Country) + heightScale.rangeBand()/4;
        })
        .text(function(d) {
                return d[elements[2]] + "€";
              });

        d3.selectAll("g.y.axis")
          .transition()
          .call(yAxis);


        d3.selectAll("circle.h3star")
          .transition()
          .attr("cx", function(d) {
            return margin.left + widthScale(+d[elements[3]]);
          })
          .attr("r", heightScale.rangeBand()/9)
          .attr("cy", function(d) {
            return heightScale(d.Country) + heightScale.rangeBand()/4;
          })
          .text(function(d) {
                  return d[elements[3]] + "€";
                });

        d3.selectAll("g.y.axis")
          .transition()
          .call(yAxis);

          d3.selectAll("circle.h4star")
            .transition()
            .attr("cx", function(d) {
              return margin.left + widthScale(+d[elements[4]]);
            })
            .attr("r", heightScale.rangeBand()/9)
            .attr("cy", function(d) {
              return heightScale(d.Country) + heightScale.rangeBand()/4;
            })
            .text(function(d) {
                    return d[elements[4]] + "€";
                  });

          d3.selectAll("g.y.axis")
            .transition()
            .call(yAxis);


          d3.selectAll("circle.h5star")
            .transition()
            .attr("cx", function(d) {
              return margin.left + widthScale(+d[elements[5]]);
            })
            .attr("r", heightScale.rangeBand()/9)
            .attr("cy", function(d) {
              return heightScale(d.Country) + heightScale.rangeBand()/4;
            })
            .text(function(d) {
                    return d[elements[5]] + "€";
                  });

          d3.selectAll("g.y.axis")
            .transition()
            .call(yAxis);
}


else{

    d3.selectAll("circle.h2star")
      .transition()
      .attr("cx", function(d) {
        return margin.left + widthScale(+d[elements[2]]);
      })
      .attr("r", 0)
      .attr("cy", function(d) {
        return heightScale(d.Country) + heightScale.rangeBand()/4;
      })
      .text(function(d) {
              return d[elements[2]] + "€";
            });;

      d3.selectAll("g.y.axis")
        .transition()
        .call(yAxis);


      d3.selectAll("circle.h3star")
        .transition()
        .attr("cx", function(d) {
          return margin.left + widthScale(+d[elements[3]]);
        })
        .attr("r", 0)
        .attr("cy", function(d) {
          return heightScale(d.Country) + heightScale.rangeBand()/4;
        })
        .text(function(d) {
                return d[elements[3]] + "€";
              });;

      d3.selectAll("g.y.axis")
        .transition()
        .call(yAxis);

        d3.selectAll("circle.h4star")
          .transition()
          .attr("cx", function(d) {
            return margin.left + widthScale(+d[elements[4]]);
          })
          .attr("r", 0)
          .attr("cy", function(d) {
            return heightScale(d.Country) + heightScale.rangeBand()/4;
          })
          .text(function(d) {
                  return d[elements[4]] + "€";
                });;

        d3.selectAll("g.y.axis")
          .transition()
          .call(yAxis);


        d3.selectAll("circle.h5star")
          .transition()
          .attr("cx", function(d) {
            return margin.left + widthScale(+d[elements[5]]);
          })
          .attr("r", 0)
          .attr("cy", function(d) {
            return heightScale(d.Country) + heightScale.rangeBand()/4;
          })
          .text(function(d) {
                  return d[elements[5]] + "€";
                });

        d3.selectAll("g.y.axis")
          .transition()
          .call(yAxis);
}

      });
      selectorDot.selectAll("option")
              .data(options)
              .enter().append("option")
              .attr("value", function(d){return d; })
              .text(function(d){ return d;
              })
       });
}




  //BARCHART
function genBarChart(selected_countries){
  console.log("selected_countries", selected_countries.length);

  if (selected_countries.length == 0) {
    console.log("==0");
    d3.csv("default_5_barChart.csv", function(data) {

    var margin = { top: 35, right: 0, bottom: 30, left: 40 };
    var width = 500 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
    

    var chart = d3.select(".chart").append("svg")
        .attr("width", 960)
        .attr("height", 500)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    ///////////////////////
    // Scales
    var x = d3.scale.ordinal()
        .domain(data.map(function(d) {return d['Country']; }))
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {return d['total_average']; }) * 1.1])
        .range([height, 0]);

    ///////////////////////
    // Axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .outerTickSize(0)
        .innerTickSize([0])
        .orient("left");

    chart.append("g")
        .attr("class", "x axisBarChart")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    chart.append("g")
        .attr("class", "y axisBarChart")
        .call(yAxis);

    
    ///////////////////////
    // Bars
    var bar = chart.selectAll(".barBarChart")
        .data(data)
      .enter().append("rect")
        .attr("class", "barBarChart")
        .attr("x", function(d) {return x(d['Country']); })
        .attr("y", height)
        .attr("width", x.rangeBand())
        .attr("height", 0);

    bar.transition()
        .duration(1500)
        .ease("elastic")
        .attr("y", function(d) {return height - parseFloat(d['total_average']); })
        .attr("height", function(d) {return parseFloat(d['total_average']); })

    ///////////////////////
    // Tooltips
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltipBarChart");

    bar.on("mouseover", function(d) {
          tooltip.html(d['Country'])
              .style("visibility", "visible");
          tooltip.html(d['total_average']+"€")
              .style("visibility", "visible");
        })
        .on("mousemove", function(d) {
          tooltip.style("top", event.pageY - (tooltip[0][0].clientHeight + 5) + "px")
              .style("left", event.pageX - (tooltip[0][0].clientWidth / 2.0) + "px");
        })
        .on("mouseout", function(d) {
          tooltip.style("visibility", "hidden");
        });
      });
    }

  else {
    d3.csv("total_costs.csv", function(data) {
      var total_costs = [];
      for(var i = 0; i < selected_countries.length; i++) {
        for(var j = 0; j < data.length; j++) {
          if (selected_countries[i] == data[j].id) {
            total_costs.push(data[j]);
          }
        }
      }

      var margin = { top: 35, right: 0, bottom: 30, left: 40 };
      var width = 500 - margin.left - margin.right;
      var height = 500 - margin.top - margin.bottom;
      
      var chart = d3.select(".chart").append("svg")
          .attr("width", 960)
          .attr("height", 500)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          
      ///////////////////////
      // Scales
      var x = d3.scale.ordinal()
          .domain(total_costs.map(function(d) {debugger; return d['Country']; }))
          .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
          .domain([0, d3.max(total_costs, function(d) {debugger; return d['total_average']; }) * 1.1])
          .range([height, 0]);

      ///////////////////////
      // Axis
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .outerTickSize(0)
          .innerTickSize([0])
          .orient("left");

      chart.append("g")
          .attr("class", "x axisBarChart")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      chart.append("g")
          .attr("class", "y axisBarChart")
          .call(yAxis);

      ///////////////////////
      // Title
/*      chart.append("text")
        .text('Bar Chart!')
        .attr("text-anchor", "middle")
        .attr("class", "graph-title")
        .attr("y", -10)
        .attr("x", width / 2.0);
*/
      ///////////////////////
      // Bars
      var bar = chart.selectAll(".barBarChart")
          .data(total_costs)
        .enter().append("rect")
          .attr("class", "barBarChart")
          .attr("x", function(d) {return x(d['Country']); })
          .attr("y", height)
          .attr("width", x.rangeBand())
          .attr("height", 0);

      bar.transition()
          .duration(1500)
          .ease("elastic")
          .attr("y", function(d) {return height - parseFloat(d['total_average']); })
          .attr("height", function(d) {return parseFloat(d['total_average']); })

      ///////////////////////
      // Tooltips
      var tooltip = d3.select("body").append("div")
          .attr("class", "tooltipBarChart");

      bar.on("mouseover", function(d) {
            tooltip.html(d['Country'])
                .style("visibility", "visible");
            tooltip.html(d['total_average']+"€")
                .style("visibility", "visible");
          })
          .on("mousemove", function(d) {
            tooltip.style("top", event.pageY - (tooltip[0][0].clientHeight + 5) + "px")
                .style("left", event.pageX - (tooltip[0][0].clientWidth / 2.0) + "px");
          })
          .on("mouseout", function(d) {
            tooltip.style("visibility", "hidden");
          });
    });
  }
}


function genFloatingBar(value) {

  d3.csv("total_costs.csv", function(data) {
    var country_selected;
    for(var j = 0; j < data.length; j++) {
      if (value == data[j].id) {
        country_selected = data[j];
        break;
      }
    }

    var ydata = [
        {"filter": "Accommodation", "to":country_selected.average_accomodation, "from": 0},
        {"filter": "Food", "to":(parseInt(country_selected.average_accomodation) + parseInt(country_selected.average_food)).toString(), "from": country_selected.average_accomodation},
        {"filter": "Transportation", "to":(parseInt(country_selected.average_accomodation) + parseInt(country_selected.average_food) + parseInt(country_selected.average_transportation)).toString(), "from": (parseInt(country_selected.average_accomodation) + parseInt(country_selected.average_food)).toString()},
        {"filter": "Culture", "to":(parseInt(country_selected.average_accomodation) + parseInt(country_selected.average_food) + parseInt(country_selected.average_transportation) + parseInt(country_selected.culture)).toString(), "from": (parseInt(country_selected.average_accomodation) + parseInt(country_selected.average_food) + parseInt(country_selected.average_transportation)).toString()},
        {"filter": "Alcohol", "to":(parseInt(country_selected.average_accomodation) + parseInt(country_selected.average_food) + parseInt(country_selected.average_transportation) + parseInt(country_selected.culture) + parseInt(country_selected.alcohol)).toString(), "from":(parseInt(country_selected.average_accomodation) + parseInt(country_selected.average_food) + parseInt(country_selected.average_transportation) + parseInt(country_selected.culture)).toString()},
        {"filter": "Shopping", "to":(parseInt(country_selected.average_accomodation) + parseInt(country_selected.average_food) + parseInt(country_selected.average_transportation) + parseInt(country_selected.culture) + parseInt(country_selected.alcohol) + parseInt(country_selected.shopping)).toString(), "from":(parseInt(country_selected.average_accomodation) + parseInt(country_selected.average_food) + parseInt(country_selected.average_transportation) + parseInt(country_selected.culture) + parseInt(country_selected.alcohol)).toString()}
      ]

    var margin = {top: 50, right: 50, bottom: 50, left: 100},
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], .08);

    var x = d3.scale.linear()
        .range([0,width]);

    y.domain(ydata.map(function(d) { return d.filter;}));
    x.domain([0, d3.max(ydata,function(d){ return parseInt(country_selected.average_accomodation) + parseInt(country_selected.average_food) + parseInt(country_selected.average_transportation) + parseInt(country_selected.culture) + parseInt(country_selected.alcohol) + parseInt(country_selected.shopping)})*1.05]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(15);

    var yAxis = d3.svg.axis()
        .scale(y)
        .outerTickSize(0)
        .innerTickSize([0])
        .orient("left");

    var svg = d3.select("#dropFloatBar").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
          .attr("class", "x axisFloating")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("x", width-75)
          .attr("dx", ".71em")
          .attr("dy", "-.71em")
          .text("Price (€)");

      svg.append("g")
          .attr("class", "y axisFloating")
          .call(yAxis);

      svg.selectAll(".barFloating")
          .data(ydata)
          .enter().append("rect")
          .attr("class", "barFloating")
          .attr("y", function(d) {return y(d.filter); })
          .attr("height", y.rangeBand())
          .attr("x", function(d) { return x(d.from); })
          .attr("width", function(d) { return x(d.to)-x(d.from) });


    var tooltip = d3.select("body")
    .append('div')
    .attr('class', 'tooltipFloating');

    tooltip.append('div')
    .attr('class', 'month');
    tooltip.append('div')
    .attr('class', 'tempRange');

    svg.selectAll(".barFloating")
    .on('mouseover', function(d) {
      tooltip.select('.month').html("<b>" + (parseInt(d.to) - parseInt(d.from)).toString() + " € </b>");
      tooltip.style('display', 'block');
      tooltip.style('opacity',2);

    })
    .on('mousemove', function(d) {
      tooltip.style('top', (d3.event.layerY + 10) + 'px')
      .style('left', (d3.event.layerX - 25) + 'px');
    })
    .on('mouseout', function() {
      tooltip.style('display', 'none');
      tooltip.style('opacity',0);
    });
  });
}
