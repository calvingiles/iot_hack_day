/*var map = L.map('map');
map.locate({setView: true, maxZoom: 16});

var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © OpenStreetMap contributors';
var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 22, attribution: osmAttrib});	

var cloudMade = L.tileLayer('http://{s}.tile.cloudmade.com/b3180c8b32584ffabcda9ab9f0d178e4/997/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18
}).addTo(map);

map.addLayer(cloudMade);*/

var mapQuestKey = "Fmjtd%7Cluur21uz2q%2Can%3Do5-90tagf";
var routeStartPoints = [];
var startPoint = "";


var endPoint = "",
	polyline = null,
	endMark = null;

var $startOverlay = $( ".start-overlay" ),
 	$blockOverlay = $( ".block-overlay" ),
	$aboutOverlay = $( ".about-overlay" ),
	$geocompleteInput = $( ".geocomplete-input" ),
	$destinationLink = $( ".destination-link" ),
	$aboutLink = $( ".about-link" );

$aboutLink.on( "click", navClick );
$destinationLink.on( "click", navClick );

var map = L.mapbox.map('map', 'examples.map-9ijuk24y');
map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
	
	//var radius = e.accuracy / 2;
	L.marker(e.latlng).addTo(map);
        //.bindPopup("You are within " + radius + " meters from this point").openPopup();
	//L.circle(e.latlng, radius).addTo(map);
    
    startPoint = e.latlng;
    console.log( "onLocationFound ", startPoint );

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
	console.log( "startPoint",startPoint );
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

	} else if ( $this.attr( "class" ) == "destination-link" ) {

		$startOverlay.show();
		$blockOverlay.show();
		$aboutOverlay.hide();

		//clear previous address
		$geocompleteInput.val("");

	}

}

/*getRoute();
$aboutOverlay.hide();
$blockOverlay.hide();
$startOverlay.hide();*/

function getRoute( from, to ) {

	console.log( from, to );

	var from = from.lat + "," + from.lng; //"51.52817,-0.084718";
	var to = to.lat + "," + to.lng; //"51.523911,-0.07738";

	var url = "http://open.mapquestapi.com/directions/v2/route?key=" + mapQuestKey + "&ambiguities=ignore&routeType=pedestrian&from=" + from + "&to=" + to;

	//console.log( url );

	$.ajax( {

		url: url,
		dataType: "json",
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

	var route = data.route;
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

}
