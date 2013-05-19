require 'sevendigital'

namespace :db do
  desc "Fill database with sample songs"
  task :populate => :environment do
    make_songs
  end
end

def make_songs
  
  10.times do |n|
    client = Sevendigital::Client.new
    #name = "song #{n}"
    #url = "null"
    #song_id = (rand * (1000000)).floor
    song_id = 28905854
    user = "aaron rosen"
    latitude = rand * (41.5620 - 41.5519) + 41.5519
    longitude = rand * (-72.6652 - -72.6530) + -72.6530
    details = client.track.get_details(song_id)
    artist = details.artist.name
    title = details.title
    album = details.release.title
    stream_url = details.preview_url
    art_url = details.release.image(100)

    address = "45 Wyllys Ave Middletown, Ct 06459"
    Song.create!(:song_id => song_id, :user => user, :latitude => latitude,
                 :longitude => longitude, :artist => artist, :album => album,
                 :song => title, :stream_url => stream_url,
                 :art_url => art_url)
  end
end
