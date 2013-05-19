class AddAddressToSongs < ActiveRecord::Migration
  def change
    add_column :songs, :address, :string
  end
end
