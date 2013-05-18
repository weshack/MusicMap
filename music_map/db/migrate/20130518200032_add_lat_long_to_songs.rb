class AddLatLongToSongs < ActiveRecord::Migration
  def change
    remove_column :songs, :location
    add_column :songs, :latitude, :float
    add_column :songs, :longitude, :float
  end
end
