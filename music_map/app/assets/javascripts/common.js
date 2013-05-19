YUI.add('common', function(Y) {

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

	Y.AudioPlayer = function() {
		var player = Y.Node.create("<audio></audio>");
		var domNode = player.getDOMNode();
		var isPlaying = false;
		var canPlay = false;
		var curSrc = null;
		var controller;
		//Y.one("body").append(player);
		player.on('canplay', function() {
		  canPlay = true;
		});
		return {
		  setSource: function(src) {
		    if (curSrc !== src) {
		      curSrc = src;
		      player.set('src', curSrc);
		      canPlay = false;
		    }
		  },

		  getSource: function() {
		    return curSrc;
		  },

		  getController: function() {
		    return controller;
		  },

		  play: function() {
		    domNode.play();
		  },

		  pause: function() {
		    domNode.pause();
		  },

      toggle: function(controlId) {
		    controller = controlId;
		    if (isPlaying) {
		      domNode.pause();
		      isPlaying = false;
		    }
		    else {
		      if (canPlay) {
		        this.play();
		        isPlaying = true;
		      }
		      else {
		        domNode.addEventListener('canplay', function() {
		          canPlay = true;
		          this.play();
		          domNode.removeEventListener('canplay', this);
		          isPlaying = true;
		        });
		      }
		    }
		  }
		}
	}

  function ellipsize(str, maxLen) {
     if (str.length > maxLen) {
       return str.substring(0, maxLen-3) + "...";
     }
     else {
       return str;
     }
  }

   

   Y.getNearbyMobile = function(latLng, radius) {
     console.log(latLng);
      var latitude = latLng.lat(),
          longitude = latLng.lng();
      Y.once('io:success', function(id, o, args) {
        nearbySongs = Y.JSON.parse(o.parseText);
        //TODO: use the music player to play throught the list of songs in
        //      nearbySongs
      });
   }

  Y.songTagFormatter = function (songTag) {
    var max_len = 37;
    return Y.Lang.sub(SONG_TAG_TPL, {
      art_url: songTag.art_url,
      song: ellipsize(songTag.song, max_len),
      artist: ellipsize(songTag.artist, max_len),
      album: ellipsize(songTag.album, max_len),
      address: songTag.address,
      stream_url: songTag.stream_url
    });
  }


}, '0.0.1', {
    requires: ['node', 'event']
});
