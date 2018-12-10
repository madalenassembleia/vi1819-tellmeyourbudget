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
    debugger;
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