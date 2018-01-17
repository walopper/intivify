import React from 'react';
import ReactDOM from 'react-dom';
import service from './js/service';

function errorHandlerFunction(error){
	// do something with this error
	console.log("error:", error);
}

/**
 * Search input to write string to search
 */
const SearchInput = props => {

	return (
		<div className="searchBox">
			<input type="text" name="searchString" placeholder="Search in spotify..." onKeyPress={props.search} />
		</div>
	)
}

/**
 * Search result box, with songs
 */
const SearchResults = props => {
	return (
		<div className="resultsSongs">
			<div className="panelTitle">{props.searchString}</div>
			{props.songs.map(function(song, index){
				return <SongItem song={song} key={index} type="search" addToFavorites={props.addToFavorites} />;
            })}
		</div>
	)
}

/**
 * Song box, either fot search results or favorites songs in list
 */
const SongItem = props => {
	return (
		<div className="songItem">
			<div className="imagePreview"><img src={props.song.image} alt={props.song.song} /></div>
			<a className="actionItems" onClick={() => {props.addToFavorites(props.song)}}><i className="icon-add" /></a>
			<div className="songData">
				<div className="title">{props.song.song}</div>
				<div className="artist"><span>by</span> {props.song.artist} <span>on</span> {props.song.album}</div>
			</div>
		</div>
	)
}

/** 
 * display a non results search
 */
const NoResultsBox = props => {
	return (
		<div className="noResults">
			<i className="icon-music"></i>
			{props.string}
		</div>
	)
}

class Intivify extends React.Component{
	constructor(props){
		// Pass props to parent class
		super(props);

		this.state = {
			access_token: null,
			searchString: '',
			searchPanelString: 'Search your favorite songs to display it here',
			searchResultSongs: [],
			myFavorites: []
		}
	}

	setAccessToken(access_token) {
		this.setState({access_token: access_token});
	}

	search(event) {
		if(event.key !== 'Enter'){
			return;
		}

		service.searchSong(event.currentTarget.value).then(this.showSearchResults.bind(this)).catch(errorHandlerFunction);

		if(event.currentTarget.value && event.currentTarget.value.length){
			this.setState({searchString: event.currentTarget.value});
		}
	}

	logout(){
		this.setState({access_token: null});
	}

	showSearchResults(songs) {
		let songsList = [];
		if(songs[0] && songs[0].song){
			songs.map(song => {
					songsList.push({
					artist: song.artist.name,
					artistId: song.artist.id,
					image: song.image,
					album: song.album,
					song: song.song,
					id: song.id,
					href: song.href,
					preview: song.preview
				})
			})
		}
		this.setState({searchResultSongs: songsList});
	}

	addToFavorites(song) {
		
		service.saveUserTrack(song.id).then(response => {
			if(response !== true){
				this.state.myFavorites.push(song);
				this.setState({myFavorites: this.state.myFavorites});
				return;
			}
		}).catch(errorHandlerFunction);


	}

	initUserTracks(songs) {
		service.getUserTracks().then(songs => {
			let songsList = [];
			if(songs[0] && songs[0].song){
				songs.map(song => {
						songsList.push({
						artist: song.artist.name,
						artistId: song.artist.id,
						image: song.image,
						album: song.album,
						song: song.song,
						preview: song.preview
					})
				})
			}
			this.setState({myFavorites: songsList});
		}).catch(errorHandlerFunction);
	}

	render(){
		return (
			<div className="intivifyApp">
				{this.state.access_token === null ? 
					<div className="loginButtonContainer">
						<input type="button" className="loginButton" onClick={() => service.login(this.setAccessToken.bind(this), this.initUserTracks.bind(this))} value="Login into spotify" /> 
					</div>
				: 
					<div className="container">
						<div id="searchPanel" className="searchPanel">
							<div className="searchInput">
								<SearchInput search={this.search.bind(this)} />
							</div>

							<div className="panelTitle">Search results</div>

							<div className="searchResults">
								{this.state.searchResultSongs.length > 0 ?
									<SearchResults addToFavorites={this.addToFavorites.bind(this)} searchString={this.state.searchString} songs={this.state.searchResultSongs} />
								:
									<NoResultsBox string={this.state.searchPanelString} />
								}
							</div>
						</div>
						<div id="favoritesPanel" className="favoritesPanel">
							<div className="panelTitle">My Favorites</div>

							<div className="favoritesList">
								{this.state.myFavorites.length > 0 ?
									this.state.myFavorites.map(function(song, index){
										return <SongItem song={song} key={index} type="favorites" />;
									})
								:
									<div className="noFavs">
										<i className="icon-heart"></i>
										This list is empty. Search your favorites songs and add it here
									</div>
								}
							</div>
						</div>
					</div>
				}
			</div>
		);
	}
}


ReactDOM.render(<Intivify />, document.getElementById('IntififyApp'));