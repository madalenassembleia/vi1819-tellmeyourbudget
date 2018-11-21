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
  names =promises.push(d3.csv(files[1]));

  Promise.all(promises).then(function(values) {
    var topology = values[0];
    g.selectAll("path")
      .data(topojson.feature(topology, topology.objects.countries)
          .features)
      .enter()
      .append("path")
      .attrs({
        "d": path,
        "fill": "white"
        })
      .on("mouseover",mouseOver)
      .on("mousemove", mouseMove)
      .on("mouseout", mouseOut)
      //.atrr("fill", colorCountry)
      ;
  });

function mouseOver(d,i){
  d3.select(this).attr("fill","grey");
    return tooltip.style("hidden", false).html(d.id);
}
function mouseMove(d){
  tooltip.classed("hidden", false)
         .style("top", (d3.event.pageY) + "px")
         .style("left", (d3.event.pageX + 10) + "px")
         .html(d.id);
            }
function mouseOut(d,i){
  d3.select(this).attr("fill","white");
  tooltip.classed("hidden", true);
}
}


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
};




