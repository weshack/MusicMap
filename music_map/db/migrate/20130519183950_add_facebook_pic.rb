class AddFacebookPic < ActiveRecord::Migration
  def change
    add_column :songs, :facebook_url, :string
  end
end
