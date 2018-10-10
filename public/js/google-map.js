function myMap() {
    var mapOptions = {
        center: new google.maps.LatLng(36.174465, -86.767960),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById("google-map"), mapOptions);
}
