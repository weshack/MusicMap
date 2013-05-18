class Song < ActiveRecord::Base
  attr_accessible :location, :name, :url, :user
end
