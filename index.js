//Settings
var 
width = window.innerWidth,
height = window.innerHeight;
color = d3.scale.category20();

JSON_FILE_NAME = "Dataset.json";

CAN_SHOW_ERROR = true;
NODE_ID_NOT_FOUND_ERROR = "You can set NODE_ID_NOT_FOUND_ERROR message in index.js and also enable/disable it.";

function nodeClickCallback(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    if (target.id === "")
	{
		if(CAN_SHOW_ERROR) alert(NODE_ID_NOT_FOUND_ERROR);
		
		return;
	}
		
	alert("Id: " + target.id);
	//window.external.ExternalMethod(target.id);
}

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
	
document.addEventListener('click', nodeClickCallback, false);

d3.json(JSON_FILE_NAME, function(error, graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link");

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
	  .attr("id", function(d) { return d.uniqeId; })
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
});
