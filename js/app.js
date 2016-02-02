//Restaurant object

var Restaurant = function(name, vicinity, rating, currentMap, markerLocation) {
	this.name = name;
	this.address = vicinity;
	this.rating = rating;
	this.map = currentMap;
	this.marker = markerLocation;
}


//View Model

var ViewModelMapApp = function() {
	var self = this;
	this.searchStr  = ko.observable("");
	//the current restaurant list according to search results
	self.RestaurantsList = ko.observableArray();
	self.removedRestaurants = [];
	self.markers = [];

	self.setMapOnAll = function(map) {
	  for (var i = 0; i < self.markers.length; i++) {
	    self.markers[i].setMap(map);
	  }
	}

	//Init map, markers and initialRestaurants
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
				  	//I check if rating for restaurant exists
				   	if (!place.rating) {
					    place.rating = "No rating provided";
				   	}
			   	   	else {
				    	place.rating = place.rating.toString();
				   	}

				   	//create markers and add them to an array for manipulation
				   	var markers = [];
				    var marker = new google.maps.Marker({
					    map: map,
				     	position: place.geometry.location
					});
					self.markers.push(marker);

			   		//create new Restaurant and add it to my list of restaurants
				    self.RestaurantsList.push( new Restaurant(place.name, place.vicinity, place.rating, map, marker.position) );

				}
			}
		});
		
	};	

	//search through initialRestaurants function using the updated searchStr


	this.search = function() {
		console.log("searching!!");
		//clears the markers from map
		//Hide all markers from map
		self.setMapOnAll(null);
		//check first if the name exists in the current restaurant list
		//if not remove the elements
		for (var i=0; i<self.RestaurantsList().length; i++) {
			console.log(self.RestaurantsList()[i].name, self.searchStr());
			if (self.RestaurantsList()[i].name.indexOf(self.searchStr()) == -1) {
				console.log(self.RestaurantsList()[i].name.indexOf(self.searchStr()));
				console.log("removed " + self.RestaurantsList()[i].name);
				self.restaurant = self.RestaurantsList()[i];
				self.removedRestaurants.push( new Restaurant(self.RestaurantsList()[i].name,self.RestaurantsList()[i].vicinity, self.RestaurantsList()[i].rating, self.RestaurantsList()[i].map, self.RestaurantsList()[i].marker) );
				self.RestaurantsList().splice(i, 1);
				i--;
				console.log(i);
				console.log("RestaurantsList length is " + self.RestaurantsList().length);
			}
			console.log(self.RestaurantsList().length);
		}
		//or if the subString is found on the initial Restaurants list
		//add the restaurant again to the current list
		//and remove it from the removedRestaurants list
		for (var j=0; j<self.removedRestaurants.length; j++) {
			console.log("j is " + j);
			console.log("started search in the removed");
			if (self.removedRestaurants[j].name.indexOf(self.searchStr()) > -1) {
				console.log("found restaurant in the removed");
				console.log("restaurant name is " + self.removedRestaurants[j].name);
				console.log("RestaurantsList length before is " + self.RestaurantsList().length);
				self.RestaurantsList().push( new Restaurant(self.removedRestaurants[j].name, self.removedRestaurants[j].vicinity, self.removedRestaurants[j].rating, self.removedRestaurants[j].map, self.removedRestaurants[j].marker) );
				self.removedRestaurants.splice(j, 1);
				console.log("RestaurantsList length after is " + self.RestaurantsList().length);
				j--;
			}
		}

		//Make the corresponding markers visible
		for (i in self.RestaurantsList()) {
			console.log(self.RestaurantsList()[i].name);
			self.markers[i].setMap(self.RestaurantsList()[i].map);
		}
		console.log("length is " + self.RestaurantsList().length);
	}
	
	google.maps.event.addDomListener(window, 'load', this.initMap);
}

ko.applyBindings(new ViewModelMapApp());
