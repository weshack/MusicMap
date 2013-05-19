YUI().use('node', 'autocomplete',
  'stylesheet', 'json', 'io', 'common',
function(Y) {
  var img = new Image();
  img.src = "https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-poi.png&scale=1";

  var WES_COORDS = new google.maps.LatLng(41.555577, -72.657437);
  var INIT_ZOOM = 17;
  var SEARCH_TPL = "<div class='songsearch'>" +
                      "<div class='instructions'>Search for a song to tag at this location:" +
                      "</div>" +
                      "<input class='searchbox' placeholder='Search...'>"
                    "</div>";
  var SONG_AC_TPL = "<div class='song'>" +
                      "<img class='album-art' src={art_url}>" +
                      "<div  class='song-info'>" +
                        "<div class='song-name'>{song}</div>" +
                        "{artist}<br>{album}" +
                      "</div>" +
                    "</div>";
  var SONG_TAG_TPL = "<div class='song'>\n" +
                       "<img class='album-art' src={art_url}>\n" +
                       "<div class='song-info'>\n" +
                         "<div class='song-name'>{song}</div>\n" +
                         "{artist}<br>{album}<br>\n" +
                         "<a class='playpause' href='{stream_url}'>Play/Pause</a>\n" +
                       "</div>\n";
  var windowWidth, windowHeight;
  var map, radiusCircle;
  var responsiveStyle = new Y.StyleSheet();
  var curSearchWindow = null;
  var curMarkerDisplay = null;
  var audioPlayer = Y.AudioPlayer();
  google.maps.visualRefresh = true;

  function resizeResponse(center) {
    var canvasHeight = parseInt(Y.one('#map-canvas').getComputedStyle('height'));
    responsiveStyle.set('#map-canvas .yui3-aclist .yui3-aclist-content', {
      maxHeight: (canvasHeight/2) + 'px',
    });
  }

  function ellipsize(str, maxLen) {
     if (str.length > maxLen) {
       return str.substring(0, maxLen-3) + "...";
     }
     else {
       return str;
     }
  }

  function songResultFormatter(query, results) {
    return Y.Array.map(results, function(result) {
      var songRec = result.raw;
      var max_len = 37;
      return Y.Lang.sub(SONG_AC_TPL, {
        art_url: songRec.art_url,
        song: ellipsize(songRec.song, max_len),
        artist: ellipsize(songRec.artist, max_len),
        album: ellipsize(songRec.album, max_len)
      });
    });
  }

  function getNearbySongs(latLng, radius) {
    var latitude = latLng.lat(),
        longitude = latLng.lng();
    Y.once('io:success', function(id, o, args) {
      nearbySongs = Y.JSON.parse(o.responseText);//.slice(0, 1);
      html = "<div class='nearby-songs'>";
      nearbySongs.forEach(function(songTag) {
        html += Y.songTagFormatter(songTag);
      });
      html += "</div>";
      Y.one("#sidebar").setHTML(html);
    });

    Y.io('/close_songs/' + latitude + '/' + longitude + '/' + radius +
         "/song.json");
    }

  function postTag(e, latLng, infoWindow) {
    var songRec = e.result.raw,
        latitude = latLng.lat(),
        longitude = latLng.lng();
    var songTag = {
      longitude: longitude,
      latitude: latitude,
      song_id: songRec.song_id,
      artist: songRec.artist,
      album: songRec.album,
      song: songRec.song,
      stream_url: songRec.stream_url,
      art_url: songRec.art_url,
      user: UID
    };

    var cfg = {
      method: 'POST',
      data: Y.JSON.stringify(songTag),
      headers: {
        'Content-Type': 'application/json'
      },
      on: {
        success: function(e) {
          curSearchWindow.close();
          var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: songRec.song,
            animation: google.maps.Animation.DROP,
          });
          google.maps.event.addListener(marker, 'click', makeMarkerCallback(songTag, latLng));
        },
        failure: function(e){
          curSearchWindow.close();
          alert("An error occured while attempting to tag your song. Please try again later.");
        }
      }
    };
    var request = Y.io('/create', cfg);
  }

  function tagSong(position, map) {
    map.panTo(position);
    if (curSearchWindow !== null) {
      curSearchWindow.close();
    }
    curSearchWindow = new google.maps.InfoWindow({
      content: SEARCH_TPL,
      position: position,
      maxWidth: 500,
    });
    // The domready event listener should be the better way to do this,
    // but it doesn't reliably fire the event. So I just wait a bit.
    Y.later(300, Y, function() {
    // google.maps.event.addListener(curSearchWindow, 'domready', function() {
      var ac = new Y.AutoComplete({
        inputNode: Y.one('.songsearch .searchbox'),
        render: true,
        source: '/songlib/{query}.json',
        resultFormatter: songResultFormatter,
        activateFirstItem: true,
        queryDelay: 300,
        maxResults: 7,
        enableCache: true
      });
      ac.on('select', postTag, this, position);
      // TODO: This is pretty hacky. Try to find a better way to make
      // the autocomplete results drop below the InfoWindow.
      Y.one('.songsearch').get('parentNode')
                          .setStyle('overflowX', 'hidden')
                          .get('parentNode')
                          .setStyle('overflow', 'visible');
    });
    curSearchWindow.open(map);
  }


  function placeRadius(position, map) {
     var circleOptions = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.6,
      strokeWeight: .5,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: position,
      radius: 27.432,
      editable: true,
      draggable: true
    };
    radiusCircle = new google.maps.Circle(circleOptions);
    google.maps.event.addListener(radiusCircle, 'center_changed', function() {
      getNearbySongs(radiusCircle.center, radiusCircle.radius);
    });
    google.maps.event.addListener(radiusCircle, 'radius_changed', function() {
      getNearbySongs(radiusCircle.center, radiusCircle.radius);
    });
  }

  function closeMarkerDisplay() {
    if (curMarkerDisplay !== null)
      curMarkerDisplay.close();
  }

  function makeMarkerCallback(songTag, latLng) {
    return function() {
      var max_len = 37;
      var content = Y.Node.create(Y.songTagFormatter(songTag));
      closeMarkerDisplay();
      curMarkerDisplay = new google.maps.InfoWindow({
        content: content.getDOMNode(),
        position: latLng,
        maxWidth: 500,
      });
      curMarkerDisplay.open(map);
      google.maps.event.addListener(curMarkerDisplay, 'closeclick', function() {
        console.log(audioPlayer.getController());
        if (audioPlayer.getController() === content.one('.playpause').get('id')) {
          audioPlayer.pause();
        }
      });
    }
  }

  function initMap() {
    console.log('init');
    var mapOptions = {
      center: WES_COORDS,
      zoom: INIT_ZOOM,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDoubleClickZoom: true
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
    Y.once('io:complete', function(id, o, args) {
      var songTags = Y.JSON.parse(o.responseText);
      for (var i = 0; i < songTags.length; i++) {
        var songTag = songTags[i];
        var latLng = new google.maps.LatLng(songTag.latitude, songTag.longitude);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            animation: google.maps.Animation.DROP,
        });
        google.maps.event.addListener(marker, 'click', makeMarkerCallback(songTag, latLng));

    var cfg = {
      method: 'GET',
      on: {
        complete: function(id, o, args) {
          console.log(o.responseText);
          var songTags = Y.JSON.parse(o.responseText);
            for (var i = 0; i < songTags.length; i++) {
              var songTag = songTags[i];
              var latLng = new google.maps.LatLng(songTag.latitude, songTag.longitude);
              var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              animation: google.maps.Animation.DROP,
            });
            console.log(marker);
            google.maps.event.addListener(marker, 'click', makeMarkerCallback(songTag, latLng));
          }
        }
      }
    };
    var request = Y.io("/songs.json", cfg);
    google.maps.event.addListener(map, 'dblclick', function(e) {
      tagSong(e.latLng, map);
    });
    google.maps.event.addListener(map, 'click', closeMarkerDisplay);
    placeRadius(WES_COORDS, map);
    getNearbySongs(WES_COORDS, 27.432);
  }

  Y.one('window').on('resize', resizeResponse);
  Y.one('window').on('load', initMap);
  Y.one('body').delegate('click', function(e) {
      e.preventDefault();
      audioPlayer.setSource(e.currentTarget.get('href'));
      audioPlayer.toggle(e.currentTarget.get('id'));
  }, '.playpause');
  resizeResponse();
});
