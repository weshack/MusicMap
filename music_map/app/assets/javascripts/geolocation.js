function get_lat_lng(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var xhr = new XMLHttpRequest();
    var base_url = "localhost:3000/close_songs/";
    var url = base_url + Math.round(latitude) + "/" + Math.round(longitude) + ".json";
    xhr.open("GET", url);
}

navigator.geolocation.getCurrentPosition(get_lat_lng);

