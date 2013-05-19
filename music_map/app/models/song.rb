class Song < ActiveRecord::Base
  reverse_geocoded_by :latitude, :longitude
  after_validation :reverse_geocode
  attr_accessible :song_id, :user, :latitude, :longitude, :artist, :album, 
                  :stream_url, :art_url, :song
<<<<<<< HEAD

=======
>>>>>>> 90fe564ede639c668975dddec144951962723a04
end
