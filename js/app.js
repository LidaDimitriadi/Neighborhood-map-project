function initMap() {
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.9738868, lng: 23.7368454},
    scrollwheel: false,
    zoom: 15
  });
}