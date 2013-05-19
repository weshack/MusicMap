class Song < ActiveRecord::Base
  reverse_geocoded_by :latitude, :longitude
  after_validation :reverse_geocode
<<<<<<< HEAD
  attr_accessible :song_id, :user, :latitude, :longitude
=======
  attr_accessible :song_id, :user, :latitude, :longitude, :artist, :album, 
                  :stream_url, :art_url, :song
>>>>>>> 0fe7ff8b1448a70183a62fec3094dbbdfe9ee8b5

end
