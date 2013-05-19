namespace :db do
  desc "Fill database with sample songs"
  task :populate => :environment do
    make_songs
  end
end

def make_songs
  10.times do |n|
    #name = "song #{n}"
    #url = "null"
    song_id = (rand * (7000000)).floor
    user = "aaron rosen"
    latitude = rand * (41.5620 - 41.5519) + 41.5519
    longitude = rand * (-72.6652 - -72.6530) + -72.6530
    address = "45 Wyllys Ave Middletown, Ct 06459"
    Song.create!(:song_id => song_id, :user => user, :latitude => latitude, 
                 :longitude => longitude)
  end
end
