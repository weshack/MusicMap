require 'sevendigital'

class SongsController < ApplicationController

  def songlib
    client = Sevendigital::Client.new
    query = params[:query]
    query = client.track.search(query)
    @json_list = (list_query(query))
    respond_to do |format|
      format.html
      format.json { render :json => @json_list }
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
    @song = Song.new ( { :song => params[:song],
    :artist => params[:artist],
    :album => params[:album],
    :song_id => params[:song_id],
    :longitude => params[:longitude],
    :latitude => params[:latitude],
    :stream_url => params[:stream_url],
    :art_url => params[:art_url],
    :user => current_user
    } )

    respond_to do |format|
      if @song.save
        format.json { render :json => @song, :status => :created, :location => @song }
      else
        format.json { render :json => @song.errors, :status => :unprocessable_entity }
      end
    end
  end

  # POST /songtags
  # POST /songtags.json
  def songtags(json_object)
    client = Sevendigital::Client.new
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
    @songs = Song.near(current_location, radius)
  end

  private
    
    def distance(a, b)
      sq = a.zip(b).map{|a,b| (a-b) ** 2}
      Math.sqrt(sq.inject(0) {|s,c| s + c})
    end

    # given a latitude(lat) and longitude(lng), return a list of 

  def set_geolocation
    session[:location] = {:latitude => params[:latitude],
                          :longitude => params[:longitude] }
  end
    # given a latitude(lat) and longitude(lng), return a list of
    # songs that were tagged near that
    def surrounding_songs(lat, long)
      radius = 0.000823

      @close_songs = Song.where(distance([:latitude, :longitude], [lat, long]) < radius )
    end

  def list_query(query)
    client = Sevendigital::Client.new
    ret_list = []
    if query.length < 7
      for song in query
        song_id = song.id
        details = client.track.get_details(song_id)
        artist = details.artist.name
        title = details.title
        album = details.release.title
        stream_url = details.preview_url
        art_url = details.release.image(100)
        ret_list.push( { :song_id => song_id, :artist => artist,
                         :album => album, :song => title,
                         :stream_url => stream_url, :art_url => art_url } )
      end
    else
      for i in 0..6
        song_id = query[i].id
        details = client.track.get_details(song_id)
        artist = details.artist.name
        title = details.title
        album = details.release.title
        stream_url = details.preview_url
        art_url = details.release.image(100)
        ret_list.push( { :song_id => song_id, :artist => artist,
                         :album => album, :song => title,
                         :stream_url => stream_url, :art_url => art_url } )
      end
    end
    return ret_list
  end

end
