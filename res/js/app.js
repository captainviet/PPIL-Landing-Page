//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {

    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });

 //    function quarter1() {
	// 	$(".underline").css("margin-left", "0");
	// 	alert("Changed!");
	// };

	// function quarter2() {
	// 	$(".underline").css("margin-left", "25%");
	// };

	// function quarter3() {
	// 	$(".underline").css("margin-left", "50%");
	// };

	// function quarter4() {
	// 	$(".underline").css("margin-left", "75%");
	// };
});

var autocomplete;


function quarter1() {
	$(".underline").css("margin-left", "0");
};

function quarter2() {
	$(".underline").css("margin-left", "25%");
};

function quarter3() {
	$(".underline").css("margin-left", "50%");
};

function quarter4() {
	$(".underline").css("margin-left", "75%");
};

function initMap() {
	var mapElement = document.getElementById("gmaps");
	var dest = new google.maps.LatLng(1.2936604, 103.857193);
	var map = new google.maps.Map(mapElement, {
		center: dest,
		zoom: 15
	});

	var directionsService = new google.maps.DirectionsService();
	var defaultBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(1.146666, 103.598748),
		new google.maps.LatLng(1.475193, 104.091667));
	var options = {
		bounds: defaultBounds
	};
	var origin = document.getElementById("origin");
	autocomplete = new google.maps.places.Autocomplete(origin, options);
};


function getUserData() {

	// var orig = $("#origin").val();
	// console.log(orig);
	// var via = $("#via").val();
	// console.log(via);
	// var mode = $("input[name='mode']:checked").val();
	// console.log(mode);

	var origin_location = autocomplete.getPlace().geometry.location;
	var orig = new google.maps.LatLng(origin_location.lat(), origin_location.lng());

	var request;

	if (mode != "TRANSIT" && via != "") {
		request = {
			origin: orig,
			destination: dest,
			travelMode: mode,
			waypoints: [{
				location: via,
				stopover: false
			}],
			region: "SG"
		}
	} else {
		request = {
			origin: orig,
			destination: dest,
			travelMode: mode,
			region: "SG"
		}
	}
	console.log(request);

	directionsService.route(request, function(result, status) {
		console.log(result);
		console.log(status);
		switch (status) {
			case google.maps.DirectionsStatus.OK:
				displayResult(result);
				break;
			case google.maps.DirectionsStatus.NOT_FOUND:
				displayError("The location you entered cannot be found!");
				break;
			case google.maps.DirectionsStatus.ZERO_RESULTS:
				displayError("No route found!");
				break;
			case google.maps.DirectionsStatus.INVALID_REQUEST:
				displayError("Fuck you Front-end Dev!");
				break;
			default:
				displayError("Unknown error! Please re-submit the search");
		}
	});
};

function displayResult(result) {
	
	var route = result.routes[0];
	console.log(route);
	var warnings = route.warnings;
	var total_distance = 0;
	var total_duration = 0;
	console.log("Length: " + route.legs.length);
	for (var l = 0; l < route.legs.length; l++) {
		console.log(route.legs[l]);
		total_distance += route.legs["0"].distance.value;
		total_duration += route.legs["0"].duration.value;
	};
	console.log(total_duration + "s");
	console.log(total_distance + "m");
};

function displayError(errorMessage) {
	var errorWindow = "<div style='padding: 10%'><p class='text-warning'>" + errorMessage + "</p></div>";
};

// This example displays an address form, using the autocomplete feature 
// of the Google Places API to help users fill in the information. 
// This example requires the Places library. Include the libraries=places 
// parameter when you first load the API. For example: // 