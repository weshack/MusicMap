class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :name
      t.string :url
      t.string :location
      t.string :user

      t.timestamps
    end
  end
end
