var map = L.map('map');
map.locate({setView: true, maxZoom: 16});

var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © OpenStreetMap contributors';
var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 22, attribution: osmAttrib});	

var cloudMade = L.tileLayer('http://{s}.tile.cloudmade.com/b3180c8b32584ffabcda9ab9f0d178e4/997/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18
}).addTo(map);

map.addLayer(cloudMade);



function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

$(".geocomplete-input").geocomplete().bind("geocode:result", function(event, result){
    console.log(result);	
    geocodeComplete( result.geometry );

 });


function geocodeComplete( geometry ) {

	$( ".start-overlay" ).hide();

	var gLatLng = geometry.location;
	var latLng = L.latLng( gLatLng.lat(), gLatLng.lng() );

	console.log( latLng );
	map.setView( latLng );

}
