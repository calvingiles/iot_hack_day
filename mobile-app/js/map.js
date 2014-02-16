var mapQuestKey = "Fmjtd%7Cluur21uz2q%2Can%3Do5-90tagf",
	routeStartPoints = [],
	startPoint = "";

var endPoint = "",
	polyline = null,
	endMark = null;

var $startOverlay = $( ".start-overlay" ),
 	$blockOverlay = $( ".block-overlay" ),
	$aboutOverlay = $( ".about-overlay" ),
	$resultOverlay = $( ".result-overlay" ),
	$navbarCollapse = $( ".navbar-collapse" ),
	$geocompleteInput = $( ".geocomplete-input" ),
	$destinationLink = $( ".destination-link" ),
	$aboutLink = $( ".about-link" ),
	$closeBtn = $( ".overlay-close-btn" ),
	$resultOverlayPopup = $( ".result-overlay-popup" ),
	$mustache = $( ".mustache" ),
	$mustacheComment = $resultOverlay.find( "h1" );

$aboutLink.on( "click", navClick );
$destinationLink.on( "click", navClick );
$closeBtn.on( "click", closePopup );
$resultOverlayPopup.on( "click", showResultOverlay );

var map = L.mapbox.map('map', 'examples.map-9ijuk24y');
map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
	
	L.marker(e.latlng).addTo(map);
    startPoint = e.latlng;
    //console.log( "onLocationFound ", startPoint );

}

map.on('locationfound', onLocationFound);

$(".geocomplete-input").geocomplete().bind("geocode:result", function(event, result){
 
    geocodeComplete( result.geometry );

 });


function geocodeComplete( geometry ) {

	$startOverlay.hide();
	$blockOverlay.hide();

	var gLatLng = geometry.location;
	var latLng = L.latLng( gLatLng.lat(), gLatLng.lng() );

	map.setView( latLng );

	//get rid of all marker
	//console.log( "endMark", endMark );
	if( endMark ) map.removeLayer( endMark );
	endMark = L.marker(latLng).addTo(map);

	endPoint = latLng;
	//console.log( "startPoint",startPoint );
	getRoute( startPoint, endPoint );
}

function navClick( evt ) {

	console.log( "navClick" );
	evt.preventDefault();

	var $this = $( this );

	console.log($this.attr( "class" ) );
	if( $this.attr( "class" ) == "about-link" ) {

		$aboutOverlay.show();
		$blockOverlay.show();
		$startOverlay.hide();
		$resultOverlay.hide();

	} else if ( $this.attr( "class" ) == "destination-link" ) {

		$startOverlay.show();
		$blockOverlay.show();
		$aboutOverlay.hide();
		$resultOverlay.hide();

		//clear previous address
		$geocompleteInput.val("");

	}

	//hide collapse panel
	$navbarCollapse.removeClass( "in" );

}

function closePopup() {
	$aboutOverlay.hide();
	$blockOverlay.hide();
	$startOverlay.hide();
	$resultOverlay.hide();
}

/*getRoute();
$aboutOverlay.hide();
$blockOverlay.hide();
$startOverlay.hide();*/
//initGraph();

function getRoute( from, to ) {

	//console.log( from, to );

	var from = from.lat + "," + from.lng; //"51.52817,-0.084718";
	var to = to.lat + "," + to.lng; //"51.523911,-0.07738";

	var url = "http://open.mapquestapi.com/directions/v2/route?key=" + mapQuestKey + "&ambiguities=ignore&routeType=pedestrian&from=" + from + "&to=" + to;

	var url = "http://172.16.50.13:5000/route/" + from + "/" + to;

	///total_rank: 10927.170510544487
	//bject {hip_rank: Array[5382], route: Object, total_rank: 13940.236570026374}
 

	console.log( url );

	$.ajax( {

		url: url,
		dataType: "jsonp",
		success: function( data ) {
			console.log( "succes", data );
			parseGetRouteResponse( data );
		},
		error: function( xhr ) {
			console.error( xhr );
		}

	})

}

function parseGetRouteResponse( data ) {

	routeStartPoints = [];
	if( polyline ) map.removeLayer( polyline );

	var route = data.route.route;
	var legs = route.legs;
	$.each( legs, function( i,leg ) {

		//console.log( leg );
		var maneuvers = leg.maneuvers;
		$.each( maneuvers, function( i, maneuver ) {

			//console.log( maneuver );
			var startPoint = maneuver.startPoint;
			routeStartPoints.push( startPoint );

		});

	});

	//console.log( "onGetRoute" );
	//console.log( routeStartPoints );
	var polyline_options = { color: '#000' };
	polyline = L.polyline(routeStartPoints, polyline_options).addTo(map);

	//show result
	$blockOverlay.show();
	$resultOverlay.show();
	initGraph( data["hip_rank"]);

	setLevel( data["total_rank"] );

	$resultOverlayPopup.show();

}

function showResultOverlay() {
	$blockOverlay.show();
	$resultOverlay.show();
}

//setLevel( 2 );

function setLevel( level ) {

	var iconClass = "mustache1";
	var btnClass = "mustache1-btn";
	var comment = "";

	if( level < 2 ) {
		iconClass = "mustache1";
		btnClass = "mustache1-btn";
		comment = "Getting Hip";
	} else if( level >= 2 && level < 4 ) {
		iconClass = "mustache2";
		btnClass = "mustache2-btn";
		comment = "Rookie Hipster";
	} else if( level >= 4 && level < 6 ) {
		iconClass = "mustache3";
		btnClass = "mustache3-btn";
		comment = "Bonafide Hipster";
	} else if( level >= 6 && level < 8 ) {
		iconClass = "mustache4";
		btnClass = "mustache4-btn";
		comment = "Alpha Hipster";
	} else if( level >= 8 && level < 8 ) {
		iconClass = "mustache5";
		btnClass = "mustache5-btn";
		comment = "KING OF HIPSTERS";
	}
	
	level = level.toFixed(2);

	$resultOverlayPopup.addClass( btnClass );
	$mustache.addClass( iconClass );
	$mustacheComment.find( ".number" ).text( level );//comment );
	$mustacheComment.find( ".text" ).text( comment );//comment );

}

/* D3 */
/* implementation heavily influenced by http://bl.ocks.org/1166403 */
// define dimensions of graph
function initGraph( data ) {

	var overlayWidth = $resultOverlay.width();
	var overlayHeight = $resultOverlay.height();

	var m = [0, 80, 80, 20]; // margins
	var w = overlayWidth - m[1] - m[3]; // width
	var h = overlayHeight - m[0] - m[2]; // height

	// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
	//var data = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7];

	// X scale will fit all values from data[] within pixels 0-w
	var x = d3.scale.linear().domain([0, data.length]).range([0, w + m[1]]);
	// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
	var y = d3.scale.linear().domain([0, 10]).range([h, 0]);
		// automatically determining max range can work something like this
		// var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

	// create a line function that can convert data[] into x and y points
	var line = d3.svg.line()
		// assign the X function to plot our line as we wish
		.x(function(d,i) { 
			// verbose logging to show what's actually being done
			//console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
			// return the X coordinate where we want to plot this datapoint
			return x(i); 
		})
		.y(function(d) { 
			// verbose logging to show what's actually being done
			//console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
			// return the Y coordinate where we want to plot this datapoint
			return y(d); 
		}).interpolate("basis");

		// Add an SVG element with the desired dimensions and margin.
		var graph = d3.select("#graph").append("svg:svg")
		      .attr("width", w + m[1] + m[3])
		      .attr("height", h + m[0] + m[2])
		    .append("svg:g")
		      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

		// create yAxis
		var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
		// Add the x-axis.
		/*graph.append("svg:g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + h + ")")
		      .call(xAxis);*/


		// create left yAxis
		var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
		// Add the y-axis to the left
		/*graph.append("svg:g")
		      .attr("class", "y axis")
		      .attr("transform", "translate(-25,0)")
		      .call(yAxisLeft);*/
		
			// Add the line by appending an svg:path element with the data line we created above
		// do this AFTER the axes above so that the line is above the tick-lines
		graph.append("svg:path").attr("d", line(data));

}


