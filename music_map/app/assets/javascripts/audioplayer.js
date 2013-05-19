YUI.add('audio-player', function(Y) {
	Y.AudioPlayer = Y.Base.create('audioPlayer', Y.Base, [], {
	    initializer: function(cfg) {
	      this._player = Y.Node.create('<audio></audio>').getDOMNode();
	      this._isPlaying = false;
	      Y.one('body').append(player);
	    },

	    setSource: function(src) {
	      this_player.src = src;
	    },

	    play: function() {
	      this_player.play();
	    },

	    pause: function() {
	      this_player.pause();
	    },

	    toggle: function() {
	      if (this_isPlaying) {
	        this.pause();
	      }
	      else {
	        this.play();
	      }
	      this_isPlaying = !this._isPlaying;
	    }
	});
});
