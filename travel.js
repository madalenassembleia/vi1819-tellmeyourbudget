var dataset;
var visited_countries;

d3.json("travel_dataset.json").then(function (data) {
    dataset = data;
    gen_vis();
});

function gen_vis() {
	var width = window.innerWidth,
	    height = window.innerHeight,
	    centered,
	    clicked_point;

	var projection = d3.geoMercator()
	    .translate([width / 2.2, height / 1.5]);

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
  
    //ready(topology, names);
    //if (error) throw error;
    //function ready(world, names) {
    var countries1 = topojson.feature(topology, topology.objects.countries).features;
      countries = countries1.filter(function(d) {
      return names.some(function(n) {
        if (d.id == n.id)  return d.name = n.name;
      })});

    g.selectAll("path")
      .data(topojson.feature(topology, topology.objects.countries)
          .features)
      .enter()
      .append("path")
      .attrs({
        "d": path,
        "fill": "white"
        })
      .on("mouseover",function(d,i){
                debugger;
                d3.select(this).attr("fill","grey");
                return tooltip.style("hidden", false).html(d.id);
            })
            .on("mousemove",function(d){
                tooltip.classed("hidden", false)
                       .style("top", (d3.event.pageY) + "px")
                       .style("left", (d3.event.pageX + 10) + "px")
                       .html(d.id);
            })
            .on("mouseout",function(d,i){
                d3.select(this).attr("fill","white");
                tooltip.classed("hidden", true);
            });
      //.atrr("fill", colorCountry)
      ;
  });
}


// function mouseOver(d){
//   console.log("entrou");
//   d3.select(this).attr("fill","grey");
//     //return tooltip.style("hidden", false).html(d.id);
// }
// function mouseMove(d){
//   tooltip.classed("hidden", false)
//          .style("top", (d3.event.pageY) + "px")
//          .style("left", (d3.event.pageX + 10) + "px")
//          .html(d.id);
//             }
// function mouseOut(d,i){
//   d3.select(this).attr("fill","white");
//   //tooltip.classed("hidden", true);
// }


// function ready(world, names) {
//   //if (error) throw error;
//   var countries1 = topojson.feature(world, world.objects.countries).features;
//     countries = countries1.filter(function(d) {
//     return names.some(function(n) {
//       if (d.id == n.id) return d.name = n.name;
//     })});
//   }

// color country
function colorCountry(country) {
  if (visited_countries.includes(country.id)) {
        // hack to discolor ehtiopia
        if (country.id == '-99' & country.geometry.coordinates[0][0][0] != 20.590405904059054){
            return '#e7d8ad'    
        } else {
            return '#ffffff';
        };
    } else {
        return '#e7d8ad';
    }
}




