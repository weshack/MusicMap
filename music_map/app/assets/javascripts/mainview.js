YUI().use('node', 'autocomplete', 'gallery-player', 'slider',
  'stylesheet', 'json', 'io',
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
  var windowWidth, windowHeight;
  var map;
  var responsiveStyle = new Y.StyleSheet();
  var curSearchWindow = null;
  google.maps.visualRefresh = true;

  function resizeResponse() {
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

  function postTag(e, position, infoWindow) {
    var songRec = e.result.raw,
        latitude = position.lat(),
        longitude = position.lng();
    var tagAttrs = {
      longitude: longitude,
      latitude: latitude,
      song_id: songRec.song_id,
      artist: songRec.artist,
      album: songRec.album,
      song: songRec.song,
      stream_url: songRec.stream_url,
      art_url: songRec.art_url
    };
    var cfg = {
      method: 'POST',
      data: Y.JSON.stringify(tagAttrs),
      headers: {
        'Content-Type': 'application/json'
      },
      on: {
        success: function(e) {
          curSearchWindow.close();
          var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: songRec.song,
            animation: google.maps.Animation.DROP,
          });
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
                          .setStyle('overflow', 'visible')
    });
    curSearchWindow.open(map);
  }

  function initMap() {
    var mapOptions = {
      center: WES_COORDS,
      zoom: INIT_ZOOM,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
    Y.on("io:complete", function(id, o, args) {
      var songTags = Y.JSON.parse(o.responseText);
      for (var i = 0; i < songTags.length; i++) {
        var songTag = songTags[i];
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(songTag.latitude, songTag.longitude),
          map: map,
          title: "a song",
          animation: google.maps.Animation.DROP,
        });
      }
    });
    Y.io("/songs.json");
    google.maps.event.addListener(map, 'click', function(e) {
      tagSong(e.latLng, map);
    });
  }

  function initAudioPlayer() {
    // scale = 10000;
    // var playSlider = new Y.Slider({
    //   length: '500px',
    //   min: 0,
    //   max: scale
    // });
    // playSlider.render('#play-slider');
    // var player = Y.one('#audio-player').getDOMNode();
    // player.src = "http://previews.7digital.com/clips/480/28905854.clip.mp3";
    // player.addEventListener('loadedmetadata', function() {
    //    duration = player.duration;
    //    // player.addEventListener('timeupdate', function(e) {
    //    //   curTime = player.currentTime;
    //    //   playSlider.setValue(Math.floor(scale*curTime/duration));
    //    // });
    //    playSlider.on('slideEnd', function(e) {
    //      // console.log(playSlider.get('value'));
    //      songTime = playSlider.get('value')/scale * player.duration;
    //      console.log(songTime);
    //      player.pause();
    //      player.currentTime = Math.floor(songTime);
    //      console.log(player.currentTime);
    //      player.play();
    //    });
    // });
  }

  Y.on('domready', initAudioPlayer);
  Y.one('window').on('resize', resizeResponse);
  Y.one('window').on('load', initMap);
  resizeResponse();
});
