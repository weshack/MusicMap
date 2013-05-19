YUI().use('node', 'autocomplete', 'gallery-player', 'slider',
function(Y) {
  var WES_COORDS = new google.maps.LatLng(41.555577, -72.657437);
  var INIT_ZOOM = 17;
  var SEARCH_TPL = "<div class='songsearch'>" +
                      "<div class='instructions'>Search for a song to tag at this location:" +
                      "</div>" +
                      "<input class='searchbox' placeholder='Search...'>"
                    "</div>";
  var SONG_AC_TPL = "<div class='song'>" +
                      "<img class='album-art' src={art_url}>" +
                      "<div class='song-info'>" +
                        "<div class='song-name'>{song}</div>" +
                        "{artist}<br>{album}" +
                      "</div>" +
                    "</div>";
  var curSearchWindow = null;
  google.maps.visualRefresh = true;

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
      var song = result.raw;
      var max_len = 37;
      return Y.Lang.sub(SONG_AC_TPL, {
        art_url: song.art_url,
        song: ellipsize(song.song, max_len),
        artist: ellipsize(song.artist, max_len),
        album: ellipsize(song.album, max_len)
      });
    });
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
        source: 'http://localhost:3000/songlib/{query}.json',
        resultFormatter: songResultFormatter,
        activateFirstItem: true,
        queryDelay: 300,
        maxResults: 7
      });
      // TODO: This is pretty hacky. Try to find a better way to make
      // the autocomplete results drop below the InfoWindow.
      Y.one('.songsearch').get('parentNode')
                          .setStyle('overflowX', 'hidden')
                          .get('parentNode')
                          .setStyle('overflow', 'visible')
    });
    curSearchWindow.open(map);
  }

  function initialize() {
    var mapOptions = {
      center: WES_COORDS,
      zoom: INIT_ZOOM,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
    google.maps.event.addListener(map, 'click', function(e) {
      tagSong(e.latLng, map);
    });
    var playSlider = new Y.Slider();
    playSlider.render("#play-slider");
  }

  Y.on('domready', initialize);
});
