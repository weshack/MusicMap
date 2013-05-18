YUI().use('node', 'autocomplete', function(Y) {
  var WES_COORDS = new google.maps.LatLng(41.555577, -72.657437);
  var INIT_ZOOM = 17;
  var SEARCH_TPL = "<div class='songsearch'>" +
                      "<div class='instructions'>Search for a song to " +
                      "tag at this location" +
                      "</div>" +
                      "<input class='searchbox' placeholder='Search...'>"
                    "</div>";

  google.maps.visualRefresh = true;

  function tagSong(position, map) {
    var marker = new google.maps.Marker({
      position: position,
      map: map
    });
    map.panTo(position);
    searchWindow = new google.maps.InfoWindow({
      content: SEARCH_TPL,
      position: position,
      maxWidth: 500
    });
    searchWindow.open(map);
    // TODO: This is hacky. Why doesn't the DOM node exist immediately
    // after the InfoWindow is created?
    Y.later(300, Y, function() {
      var ac = new Y.AutoComplete({
        inputNode: Y.one('.songsearch .searchbox'),
        render: false,
        source: ["We Found Love", "Can't Stop", "Ay Bay Bay"]
      });
      ac.render();
      // TODO: This is super hacky. Try to find a better way to make
      // the autocomplete results drop below the InfoWindow.
      Y.one('.songsearch').get('parentNode')
                          .setStyle('overflowX', 'hidden')
                          .get('parentNode')
                          .setStyle('overflow', 'visible')
    });


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
  }

  Y.on('domready', initialize);
});
