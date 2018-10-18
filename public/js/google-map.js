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

    var marker1 = new google.maps.Marker({
          position: new google.maps.LatLng(36.159623, -86.780363),
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          map: map,
          title: 'Nashville First Baptist Church'
    });

    var marker2 = new google.maps.Marker({
        position: new google.maps.LatLng(36.004916, -86.884880),
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        map: map,
        title: "Grassland Heights Church"
      });

    markers[0] = marker1;
    markers[1] = marker2;
}

function mouseEnter(churchEntry) {
  if(churchEntry.id == "nfb") {
    markers[0].setMap(null);
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(36.159623, -86.780363),
      map: map,
      title: "Nashville First Baptist Church"
    });

    markers[0] = marker;
  } else if (churchEntry.id == "ghc") {
    markers[1].setMap(null);
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(36.004916, -86.884880),
      map: map,
      title: "Grassland Heights Church"
    });

    markers[1] = marker;
  }
}

function leaving(churchEntry) {
  if(churchEntry.id == "nfb") {
    markers[0].setMap(null);
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(36.159623, -86.780363),
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      map: map,
      title: "Nashville First Baptist Church"
    });

    markers[0] = marker;
  } else if (churchEntry.id == "ghc") {
    markers[1].setMap(null);
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(36.004916, -86.884880),
      icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      map: map,
      title: "Grassland Heights Church"
    });

    markers[1] = marker;
  }
}
