YUI().use('node', 'gallery-player', 'autocomplete', 'gallery-modernizr', function(Y) {
  var WES_COORDS = new google.maps.LatLng(41.555577, -72.657437);
  var INIT_ZOOM = 17;
  var SEARCH_TPL = "<div class='songsearch'>" +
                      "<div class='instructions'>Search for a song to " +
                      "tag at this location" +
                      "</div>" +
                      "<input class='searchbox' placeholder='Search...'>"
                    "</div>";

  google.maps.visualRefresh = true;
  var curSearchWindow = null;

  function tagSong(position, map) {
    map.panTo(position);
    if (curSearchWindow !== null) {
      curSearchWindow.close();
    }

    curSearchWindow = new google.maps.InfoWindow({
      content: SEARCH_TPL,
      position: position,
      maxWidth: 500,
      pixelOffset: new google.maps.Size(0, 0)
    });
    curSearchWindow.open(map);
    google.maps.event.addListener(curSearchWindow, 'domready', function() {
      var ac = new Y.AutoComplete({
        inputNode: Y.one('.songsearch .searchbox'),
        render: true,
        source: ["We Found Love", "Can't Stop", "Ay Bay Bay"],
      });
      // TODO: This is super hacky. Try to find a better way to make
      // the autocomplete results drop below the InfoWindow.
      Y.one('.songsearch').get('parentNode')
                          .setStyle('overflowX', 'hidden')
                          .get('parentNode')
                          .setStyle('overflow', 'visible')
    });
  }

  function get_lat_lng(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var xhr = new XMLHttpRequest();
    var base_url = "localhost:3000/close_songs/";
    var url = base_url + Math.round(latitude) + "/" + Math.round(longitude) + ".json";
    xhr.open("GET", url);
  }

  function initialize() {
    var mapOptions = {
      center: WES_COORDS,
      zoom: INIT_ZOOM,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    google.maps.event.addListener(map, 'click', function(e) {
      tagSong(e.latLng, map);
    });

    //navigator.geolocation.getCurrentPosition(get_lat_lng);

  }

  

  

  Y.on('domready', initialize);
});
