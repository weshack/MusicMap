YUI().use('node', function(Y) {
  SIDEBAR_WIDTH = 300;
  google.maps.visualRefresh = true;

  // function updateLayout() {
  //   width = Y.one('body').get('winWidth');
  //   height = Y.one('body').get('winHeight');
  //   Y.one('#map-canvas').setStyle('width', width-SIDEBAR_WIDTH-2)
  // }

  function placeMarker(position, map) {
    var marker = new google.maps.Marker({
      position: position,
      map: map
    });
    map.panTo(position);
  }

  function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(41.555577, -72.657437),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    google.maps.event.addListener(map, 'click', function(e) {
      placeMarker(e.latLng, map);
    });
  }

  google.maps.event.addDomListener(window, 'load', initialize);
  // Y.one('window').on('resize', updateLayout);
  // updateLayout();
});
