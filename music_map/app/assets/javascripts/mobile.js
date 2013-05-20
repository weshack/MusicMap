YUI().use('node', 'common', 'json', 'io',
    function(Y) {

      var CURR_COORDS = new google.maps.LatLng(41.555577, -72.657437);
      var INIT_ZOOM = 17;
      var map;


      function show_map(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        var coords = new google.maps.LatLng(latitude, longitude);
        var init_zoom = 17;
        
        var mapOptions = {
          center: coords,
          zoom: init_zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDoubleClickZoom: true
        };
        
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        //TODO: get songs from database and put on map
        Y.once('io:success', function(id, o, args) {
          Y.getNearbyMobile(map.getCenter(), 50);
        });
      }

      /*
       * UPDATE MAP TO FOLLOW  USERS POSITION
       */
      function scrollMap(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        map.setCenter(new google.maps.LatLng(lat, lng));

        //TODO: load songs near position
        Y.getNearbyMobile(position, 50);
      }

      var watchId = navigator.geolocation.watchPosition(scrollMap);       

      function initialize() {
        navigator.geolocation.getCurrentPosition(show_map);          
      }
      
      Y.one('window').on('load', initialize);
      Y.one('window').on('close', navigator.geolocation.clearWatch(watchId));

    });
