class Song < ActiveRecord::Base
  reverse_geocoded_by :latitude, :longitude
  after_validation :reverse_geocode
  attr_accessible :song_id, :user, :latitude, :longitude, :artist, :album, 
                  :stream_url, :art_url, :song, :facebook_url
end
