// blue Marker
// icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",

var map = null;
markers = []

function myMap() {
    var mapOptions = {
        center: new google.maps.LatLng(36.174465, -86.767960),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("google-map"), mapOptions);

    var churches = document.getElementsByClassName("church-entry");

    for (var church in churches) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(churchEntry.gps_lat, churchEntry.gps_long),
        map: map,
        title: churchEntry.title
      })
      markers.push(marker);
    }
}

function mouseEnter(churchEntry) {
  markers[churchEntry.id].setMap(null);
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(churchEntry.gps_lat, churchEntry.gps_long),
    map: map,
    title: churchEntry.title
  });

  markers[churchEntry.id] = marker;
}

function leaving(churchEntry) {
  markers[churchEntry.id].setMap(null);
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(churchEntry.gps_lat, churchEntry.gps_long),
    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    map: map,
    title: churchEntry.title
  });

  markers[churchEntry.id] = marker;
}
