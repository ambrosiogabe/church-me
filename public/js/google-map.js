// blue Marker
// icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",

var map = null;
markers = {}

function myMap() {
    var mapOptions = {
        center: new google.maps.LatLng(36.174465, -86.767960),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("google-map"), mapOptions);

    var churches = document.getElementsByClassName("church-entry");

    for (var i = 0; i < churches.length; i++) {
      var church = churches[i];
      var long = parseFloat(church.getAttribute("gps_long"));
      var lat = parseFloat(church.getAttribute("gps_lat"));
      console.log(long + " " + lat);
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        map: map,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        title: church.getAttribute("title")
      })
      markers["" + church.id] = marker;
    }
}

function mouseEnter(churchEntry) {
  markers["" + churchEntry.id].setMap(null);
  var long = parseFloat(churchEntry.getAttribute("gps_long"));
  var lat = parseFloat(churchEntry.getAttribute("gps_lat"));
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, long),
    map: map,
    title: churchEntry.getAttribute("title")
  });

  markers["" + churchEntry.id] = marker;
}

function leaving(churchEntry) {
  markers["" + churchEntry.id].setMap(null);
  var long = parseFloat(churchEntry.getAttribute("gps_long"));
  var lat = parseFloat(churchEntry.getAttribute("gps_lat"));
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, long),
    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    map: map,
    title: churchEntry.getAttribute("title")
  });

  markers["" + churchEntry.id] = marker;
}
