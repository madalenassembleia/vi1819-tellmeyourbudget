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

	var g = svg.append("g");
	var path = d3.geoPath()
	    .projection(projection);

  Promise.all([
  	json("world_dataset.json"),
  	cvs("world_country_names.csv")]).
  	then(function (topology) {
    g.selectAll("path")
      .data(topojson.feature(topology, topology.objects.countries)
          .features)
      .enter()
      .append("path")
      .attr("d", path);
  });
}

// color country
function colorCountry(country) {
  if (visited_countries.includes(country.id)) {
        // hack to discolor ehtiopia
        if (country.id == '-99' & country.geometry.coordinates[0][0][0] != 20.590405904059054){
            return '#e7d8ad'    
        } else {
            return '#c8b98d';
        };
    } else {
        return '#e7d8ad';
    }
};