class AddArtistAlbumStreamArtSong < ActiveRecord::Migration
  def change
    add_column :songs, :artist, :string
    add_column :songs, :album, :string
    add_column :songs, :song, :string
    add_column :songs, :stream_url, :string
    add_column :songs, :art_url, :string
  end
end
