//Model


var Restaurant = function(name, vicinity, rating) {
	this.name = name;
	this.address = vicinity;
	this.rating = rating;
}

//Init map, markers and initialRestaurants




var ViewModelMapApp = function() {
	var self = this;
	this.initialRestaurants = ko.observableArray();


	this.initMap = function() {
		// Create a map object and specify the DOM element for display.
		var athens = new google.maps.LatLng(37.9738868, 23.7368454);
		var map = new google.maps.Map(document.getElementById('map'), {
		  center: athens,
		  scrollwheel: false,
		  zoom: 15
		});


		var request = {
		    location: athens,
		    radius: '500',
		    types: ['restaurant']
		  };

		// Create the PlaceService and send the request.
		// Handle the callback with an anonymous function.
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, function(results, status) {
			// If the request succeeds, draw the place location on
			// the map as a marker, and register an event to handle a
			// click on the marker.
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
				  	var place = results[i];
				  	console.log(place);
				  	//I check if rating for restaurant exists
				   	if (!place.rating) {
					    place.rating="No rating provided";
				   	}
			   	   	else {
				    	place.rating = place.rating.toString();
				   	}	
			   		//create new Restaurant and add it to my list of restaurants
				    self.initialRestaurants.push( new Restaurant(place.name, place.vicinity, place.rating) );
			   		console.log(self.initialRestaurants()[0]);
				    //create markers
				    var marker = new google.maps.Marker({
					    map: map,
				     	position: place.geometry.location
					});
				}
				//for(i in self.initialRestaurants()) {
				//	console.log(self.initialRestaurants()[i].name);
				//}
			}
		});
	};	


	
	google.maps.event.addDomListener(window, 'load', this.initMap);
}

ko.applyBindings(new ViewModelMapApp());
