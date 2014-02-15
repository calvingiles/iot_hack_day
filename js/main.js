var map;

function initialize() {

  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.515000000000001, -0.15500000000000003)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);



var foursquareApiId = "21M5CXSCBBOYRITEKRXDR2KHHNHHK1UVT0FX1CQUJKLLHD23";
var foursquareSecret = "YUYZUCL13PS0KUQUMWIHKBBAOGE0VG4NMW0S0TPA0C0XPWOS";

//https://api.foursquare.com/v2/venues/search?client_id=21M5CXSCBBOYRITEKRXDR2KHHNHHK1UVT0FX1CQUJKLLHD23&client_secret=YUYZUCL13PS0KUQUMWIHKBBAOGE0VG4NMW0S0TPA0C0XPWOS&v=20130815&ll=40.7,-74&query=sushi

//https://api.foursquare.com/v2/venues/search?client_id=21M5CXSCBBOYRITEKRXDR2KHHNHHK1UVT0FX1CQUJKLLHD23&client_secret=YUYZUCL13PS0KUQUMWIHKBBAOGE0VG4NMW0S0TPA0C0XPWOS&v=20130815&ll=40.7,-74


function getPlaces( lat, lng ) {

	console.log( "getPlaces", lat, lng );

	var url = "https://api.foursquare.com/v2/venues/search?client_id=" + foursquareApiId + "&client_secret=" + foursquareSecret + "&v=20130815&ll=" + lat + "," + lng;

	console.log( "url", url );

	$.ajax( {

		url: url,
		success: function( data ) {

			console.log( "success" );
			console.log( data );
			//localStorage.setItem( lat.toString() + ";" + lng.toString(), JSON.stringify(data) );
			storePoint( lat, lng, data );

		}, 
		error: function( xhr ) {

			console.error( "error request" );
			console.error( xhr );


		}


	});


}

function storePoint( lat, lng, data ) {

	$.ajax( {

		url: "php/saveCsv.php",
		type: "POST",
		data: { data: data, lat:lat, lng:lng },
		success: function( ) {

			console.log( "success storing file " );

		},
		error: function( xhr ) {

			console.error( xhr );

		}

	});

}

function processPoint( lat, lng ) {

	var marker = new google.maps.Marker( {
		position: new google.maps.LatLng( lat, lng ),
		map: map
	});

	getPlaces( lat, lng );

	//localStorage.setItem( lat.toString() + ";" + lng.toString(), "0" );

}

var north = 51.539289;
var south = 51.478069;
var west = -0.192803;
var east = -0.069721;
var step = 0.005;

var nowLng = west, nowLat = north;
var numberOfPoints = 0;
var limit = 10;

var interval = setInterval( function() {

	// w->e, n->s
	/*if( numberOfPoints >= limit ) {
		console.log( "limit!!!");
		end();
		return;
	}*/

	if( nowLng < east ) {
		nowLng += step; 
	} else {

		//skip to next 
		nowLng = west;

		if( nowLat > south ) {

			nowLat -= step;

		} else {

			//all done
			end();
			return;

		}


	}

	console.log( nowLat, nowLng, numberOfPoints );
	processPoint( nowLat, nowLng );

	numberOfPoints++;

}, 500 );


function end() {

	console.log( "end" );

	clearInterval( interval );

}


