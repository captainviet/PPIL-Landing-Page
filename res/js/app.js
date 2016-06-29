//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {

    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 50
        }, 2000, 'easeInOutExpo');
        event.preventDefault();
    });

    $("#get-route").bind("click", function(event) {
    	$("html, body").stop().animate({
    		scrollTop: $("#venue-heading").offset().top - 50
    	}, 2000, 'easeInOutExpo');
    })

    $(".navbar-nav").on("click", function() {
    	if ($(window).width() < 768) {
    		$(".navbar-toggle").click();
    	}
    });

    $(".read-more").click(function() {
    	var read_more_id = this.id;
    	var type = $(this).prop("tagName").toLowerCase();
    	if (type == "img") {
    		imgReadMore(read_more_id);
    	} else {
    		pReadMore(read_more_id);
    	}
    });

    function pReadMore(id) {
    	$("#" + id).hide();
    	$("#" + id + "-info").show();
    }

    function imgReadMore(id) {
    	$("#" + id).animate({
    		opacity: 0.2,
    	}, {
    		duration: 500,
    		queue: false,
    	});
    	$("#" + id + "-info").animate({
    		opacity: 1,
    	}, {
    		duration: 500,
    		queue: false,
    	});
    };

    $(document).click(function(e) {
    	var id = e.target.id;
    	var img = ["rohan-img", "iswaran-img"];
    	for (var i = 0; i < img.length; i++) {
	    	if (id != img[i]) {
				$("#" + img[i]).animate({
		    		opacity: 1,
		    	}, {
		    		duration: 500,
		    		queue: false,
		    	});
		    	$("#" + img[i] + "-info").animate({
		    		opacity: 0,
		    	}, {
		    		duration: 500,
		    		queue: false,
		    	});
		    }
		}
    });

});

// global variables for map manipulation
var autocompleteOrigin, autocompleteVia, map, directionsDisplay;

// for changing the transport mode underbar
function quarter1() {
	$(".underline").css("margin-left", "0");
};

function quarter2() {
	$(".underline").css("margin-left", "10%");
};

function quarter3() {
	$(".underline").css("margin-left", "20%");
};

function quarter4() {
	$(".underline").css("margin-left", "30%");
};

// initialize GMaps and its associating service classes
function initMap() {
	// map instantiation
	var mapElement = document.getElementById("map");
	var dest = {lat: 1.2936604, lng: 103.857193};
	map = new google.maps.Map(mapElement, {
		center: dest,
		zoom: 15
	});

	// marker instantiation
	var marker = new google.maps.Marker({
		map: map,
		position: dest,
		title: "Suntec Convention & Exhibition Center",
		visible: true
	});
	// console.log(marker);
	var infoWindow = new google.maps.InfoWindow();
	infoWindow.setContent("<div id='content'><p><strong>Suntec Convention & Exhibition Center</strong></p><p>1 Raffles Boulevard, <span class='street-address'>Suntec City</span>, <span class='country-name'>Singapore</span> <span class='postal-code'>039593</span></p></div>");
	marker.addListener("click", function() {
		infoWindow.open(map, marker);
	});

	// autocomplete initialization
	var defaultBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(1.146666, 103.598748),
		new google.maps.LatLng(1.475193, 104.091667));
	var options = {
		bounds: defaultBounds
	};
	var origin = document.getElementById("origin");
	autocompleteOrigin = new google.maps.places.Autocomplete(origin, options);
	var via = document.getElementById("via");
	autocompleteVia = new google.maps.places.Autocomplete(via, options);

	directionsDisplay = new google.maps.DirectionsRenderer(options);
	directionsDisplay.setMap(map);


};

function getRoute() {


	event.preventDefault();

	try {
		// user input collection
		var origin_location = autocompleteOrigin.getPlace().geometry.location;
		// console.log(origin_location);
		// console.log(autocompleteOrigin.getPlace().formatted_address);
		var orig = new google.maps.LatLng(origin_location.lat(), origin_location.lng());
		// console.log(orig.lat(), orig.lng());
		var dest = new google.maps.LatLng(1.2936604, 103.857193);
		// console.log(dest);
		var directionsService = new google.maps.DirectionsService();
		// var via = $("#via").val();
		// console.log(autocompleteVia.getPlace());
		var via;
		if (autocompleteVia.getPlace() == null) {
			via = "";
		} else {
			var via_location = autocompleteVia.getPlace().geometry.location;
			via = new google.maps.LatLng(via_location.lat(), via_location.lng());
		}
		// console.log(via);
		var mode = $("input[name='mode']:checked").val();
		// console.log(mode);

		// request compilation
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
		// console.log(request);

		// request submission and response handler
		directionsService.route(request, function(result, status) {
			// console.log(result);
			// console.log(status);
			switch (status) {
				// if a response is available
				case google.maps.DirectionsStatus.OK:
					displayResult(result, mode);
					directionsDisplay.setDirections(result);
					break;
				// if no response is available
				case google.maps.DirectionsStatus.NOT_FOUND:
					displayError("The location you entered cannot be found!");
					break;
				case google.maps.DirectionsStatus.ZERO_RESULTS:
					displayError("No route found!");
					break;
				case google.maps.DirectionsStatus.INVALID_REQUEST:
					displayError("Developer's apologize, it's my fault!");
					break;
				default:
					displayError("Unknown error! Please re-submit the search");
			}
		});
	}

	// general exception handler
	catch (e) {
		displayError("Error! Please re-submit the search");
	}
};

// function for displaying result on the website
function displayResult(result, mode) {
	
	// GMaps response handler
	var route = result.routes[0];
	// console.log(route);
	var warnings = route.warnings;
	var total_distance = 0;
	var total_duration = 0;
	// console.log("Length: " + route.legs.length);

	// navigation response compiler
	var details = "<li style='list-style: none'><i class='fa fa-dot-circle-o'></i> ";
	for (var l = 0; l < route.legs.length; l++) {
		var leg = route.legs[l];
		// console.log(leg);

		// general info computation
		total_distance += leg.distance.value;
		total_duration += leg.duration.value;
		details += legBuilder(leg);

	};
	details += "</li><li style='list-style: none'><i class='fa fa-circle-o'></i> Suntec Convention & Exhibition Center, Nicoll Hwy, Singapore</li>";
	// console.log(details);
	// console.log(total_duration + "s");
	// console.log(total_distance + "m");
	switch (mode) {
		case "DRIVING":
			mode = "Drive";
			quarter1();
			break;
		case "TRANSIT":
			mode = "Ride";
			quarter2();
			break;
		case "BICYCLING":
			mode = "Cycle";
			quarter3();
			break;
		case "WALKING":
			mode = "Walk";
			quarter4();
			break;
	}
	// show route cost in terms of time and distance
	$("#route-cost").text(mode + " " + (total_distance/1000).toFixed(1) + " km, " + (total_duration/60).toFixed(1) + " min");
	// show warnings from GMaps
	if (route.warnings.length != 0) {
		$("#route-warning").text(route.warnings[0]);
	} else {
		$("#route-warning").empty(); // or empty placeholder if there's none
	}
	// show route details (navigation)
	$("#route-details").html(details);

};

// function for compiling details for certain legs in route
function legBuilder(leg) {
	var result = leg.start_address + "\n" + "<ul class='fa-ul'>";
	var steps = leg.steps;
	var style;
	for (var s = 0; s < steps.length; s++) {
		if (steps[s].instructions.toLowerCase().includes("left")) {
			style = "<li><i class='fa-li fa fa-arrow-left'></i> "
		} else if (steps[s].instructions.toLowerCase().includes("right")) {
			style = "<li><i class='fa-li fa fa-arrow-right'></i> "
		} else {
			style = "<li><i class='fa-li fa fa-long-arrow-up'></i> ";
		}
		var instruction = style + steps[s].instructions + "</li>";
		result += instruction;
	}
	result += "</ul>";
	// console.log(result);
	return result;
}

// function for displaying error message in warning placeholder
function displayError(errorMessage) {
	// console.log(errorMessage)
	$("#route-cost").empty();
	$("#route-details").empty();
	$("#route-warning").text(errorMessage);
};

// This example displays an address form, using the autocomplete feature 
// of the Google Places API to help users fill in the information. 
// This example requires the Places library. Include the libraries=places 
// parameter when you first load the API. For example: // 