class SongsController < ApplicationController

  # GET /songtags
  # GET /songtags/json
  def songtags
    @songs = Song.all
    
    respond_to do |format|
      format.html
      format.json { render :json => @songs }
    end
  end


  # GET /songs
  # GET /songs.json
  def index
    @songs = Song.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @songs }
    end
  end

  # GET /songs/1
  # GET /songs/1.json
  def show
    @song = Song.find(:id)

    respond_to do |format|
      format.html # show.html.erb
      format.json { render :json => @song }
    end
  end

  # GET /songs/new
  # GET /songs/new.json
  def new
    @song = Song.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render :json => @song }
    end
  end

  # GET /songs/1/edit
  def edit
    @song = Song.find(params[:id])
  end

  # POST /songs
  # POST /songs.json
  def create
    @song = Song.new(params[:song])

    respond_to do |format|
      if @song.save
        format.html { redirect_to @song, :notice => 'Song was successfully created.' }
        format.json { render :json => @song, :status => :created, :location => @song }
      else
        format.html { render :action => "new" }
        format.json { render :json => @song.errors, :status => :unprocessable_entity }
      end
    end
  end

  # POST /songtags
  # POST /songtags.json
  def songtags(json_object) 
    client = client = Sevendigital::Client.new
    # Our has table
    h = JSON.parse json_object
    song_id = h["song_id"]
    lat = h["latitude"]
    long = h["longitude"]

    details = client.track.get_details(song_id)
    artist = details.artist.name
    title = details.title
    album = details.release.title
    stream_url = details.preview_url
    art_url = details.release.image(100)

    Song.create( {:song_id => song_id, :longitude => long, :latitude => lat,
                  :artist => artist, :album => album, :song => title,
                  :stream_url => stream_url, :art_url => art_url } )
  end

  # PUT /songs/1
  # PUT /songs/1.json
  def update
    @song = Song.find(params[:id])

    respond_to do |format|
      if @song.update_attributes(params[:song])
        format.html { redirect_to @song, :notice => 'Song was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render :action => "edit" }
        format.json { render :json => @song.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /songs/1
  # DELETE /songs/1.json
  def destroy
    @song = Song.find(params[:id])
    @song.destroy

    respond_to do |format|
      format.html { redirect_to songs_url }
      format.json { head :no_content }
    end
  end

  # GET /close_songs/:coord
  # GET /close_songs/:coord.json
  def show_close_songs
    # finds all songs tagged within a .5 mile radius
    radius = 0.5
    lat = params[:lat].to_f #lat_lng_list[0].to_f
    lng = params[:lng].to_f #lat_lng_list[1].to_f
    location = [lat, lng]
    @songs = Song.near(location, radius)

    respond_to do |format|
      format.html { redirect_to root_path }
      format.json { render :json => @songs }
    end
  end

  def set_geolocation
    session[:location] = {:latitude => params[:latitude], 
                          :longitude => params[:longitude] }
  end

end
