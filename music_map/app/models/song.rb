class Song < ActiveRecord::Base
  reverse_geocoded_by :latitude, :longitude
  after_validation :reverse_geocode
  attr_accessible :location, :name, :url, :user, :latitude, :longitude

end
