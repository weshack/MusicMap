class AddSongIdToSongs < ActiveRecord::Migration
  def change
    add_column :songs, :song_id, :integer
    remove_column :songs, :name
    remove_column :songs, :url
  end
end
