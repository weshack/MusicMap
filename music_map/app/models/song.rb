class Song < ActiveRecord::Base
  reverse_geocoded_by :latitude, :longitude
  after_validation :reverse_geocode
  attr_accessible :location, :song_id, :user, :latitude, :longitude

end
