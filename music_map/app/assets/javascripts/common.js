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

  var SONG_MAP_TPL = "<div class='song'>" +
                      "<img class='album-art' src={art_url}>" +
                      "<img class='album-art' src={facebook_url}>\n" +
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
		Y.one("body").append(player);
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

      getPlayElt: function() {
        return domNode;
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

  Y.PlaylistPlayer = function(songTags) {
    var audio = new Audio();
    function _play(queue) {
      console.log("in _play");
      console.log(queue.length + " items in queue");
      if (queue.length == 0) return;
      var songTag = queue.shift();
      audio.src = songTag.stream_url;
      audio.addEventListener('ended', function() {
        console.log(queue.length + "recursive call");      
        _play(queue);
      });
      console.log("playing song");
      audio.play();
    }

    return {
      startPlay: function() {
        _play(songTags);
        Y.later(10000, this, function() {
          this.pause();
        });
      },

      next: function() {
        audio.currentTime = audio.duration;
      },

      pause: function() {
        audio.pause();
      },

      resumePlay: function() {
        audio.play();
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
      var latitude = latLng.lat(),
          longitude = latLng.lng();
      Y.once('io:success', function(id, o, args) {
        var nearbySongs = Y.JSON.parse(o.parseText);
        var playList = Y.PlayListPlayer(nearbySongs);
        
        playlist.play();

        Y.one("#Next").on('click', function(){
          console.log('press next');
          playList.next(); 
        });
        Y.one("#Pause").on('click', function() {
          playList.pause();
        });  
      });

      Y.io('/close_songs/' + latitude + '/' + longitude + '/' + radius + '/song.json');
  }

  
  Y.songTagFormatter = function (songTag, max_len) {
    max_len = max_len || 37;
    return Y.Lang.sub(SONG_TAG_TPL, {
      art_url: songTag.art_url,
      song: ellipsize(songTag.song, max_len),
      artist: ellipsize(songTag.artist, max_len),
      album: ellipsize(songTag.album, max_len),
      address: songTag.address,
      stream_url: songTag.stream_url
    });
  }


  Y.songTagFormatter2 = function (songTag, max_len) {
    max_len = max_len || 37;
    console.log(max_len);
    console.log("In song tag formatter two");
    console.log(songTag.facebook_url);
    console.log(songTag.facebook_url === null);
    if (songTag.facebook_url !== null) {
      return Y.Lang.sub(SONG_MAP_TPL, {
      art_url: songTag.art_url,
      song: ellipsize(songTag.song, max_len),
      artist: ellipsize(songTag.artist, max_len),
      album: ellipsize(songTag.album, max_len),
      address: songTag.address,
      stream_url: songTag.stream_url,
      facebook_url: songTag.facebook_url
      });
    }
    else {
      return Y.Lang.sub(SONG_TAG_TPL, {
      art_url: songTag.art_url,
      song: ellipsize(songTag.song, max_len),
      artist: ellipsize(songTag.artist, max_len),
      album: ellipsize(songTag.album, max_len),
      address: songTag.address,
      stream_url: songTag.stream_url
      });
    }
  }



}, '0.0.1', {
    requires: ['node', 'event']
});
