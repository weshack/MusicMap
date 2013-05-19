YUI.add('audio-player', function(Y) {
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
}, '0.0.1', {
    requires: ['node', 'event']
});
