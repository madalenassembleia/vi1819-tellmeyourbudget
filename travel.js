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
                d3.select(this).attr("fill","grey");
                return tooltip.style("hidden", false).html(d.name);

            })
            .on("mousemove",function(d,i){
                tooltip.classed("hidden", false)
                       .style("top", (d3.event.pageY) + "px")
                       .style("left", (d3.event.pageX + 10) + "px")
                       .html(d.name);
            })
            .on("mouseout",function(d,i){
                d3.select(this).attr("fill","white");
                tooltip.classed("hidden", true);
            });
      ;
  });
}


