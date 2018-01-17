const SpotifyWebApi = require('spotify-web-api-node')
const settings = require('./settings.js');
const fetch = require('node-fetch');

class SpotifyClient {
	constructor(){
		this.baseUrl = 'https://api.spotify.com/v1';
		this.access_token = '';
		this.requestOptions = {};
	}


	// sets the access token after login
	setToken(access_token){
		this.access_token = access_token;

		this.requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${access_token}`
			}
		};
	}

	// search in spotify by track name
	search(stringToSearch){

		return fetch(`${this.baseUrl}/search?type=track&limit=10&q=${stringToSearch}`, this.requestOptions)
			.then(response => response.json())
			.then(data => {

				// if get any result different than tracks, return empty list
				if(!data.tracks || !data.tracks.items || data.tracks.items.length === 0){
					return [];
				}
				// console.log("search response: ", JSON.stringify(data.tracks.items));

				// make the object only with properties I need
				return data.tracks.items.map(song => { 
					return {
						artist: song.album.artists[0],
						album: song.album.name,
						song: song.name,
						preview: song.preview_url,
						image: song.album.images[0].url || '',
						href: song.href,
						id: song.id,
						uri: song.uri
					}
				});
			})
			.catch(errorHandler);
	}

	// search in spotify by track name
	getUserTracks(){

		return fetch(`${this.baseUrl}/me/tracks`, this.requestOptions)
			.then(response => response.json())
			.then(data => {

				// if get any result different than tracks, return empty list
				if(!data.items || data.items.length === 0){
					// return [];
				}
				// console.log("search response: ", JSON.stringify(data.tracks.items));

				// make the object only with properties I need
				return data.items.map(song => { 
					return {
						artist: song.track.album.artists[0],
						album: song.track.album.name,
						song: song.track.name,
						preview: song.track.preview_url,
						image: song.track.album.images[0].url || '',
						href: song.track.href,
						id: song.track.id,
						uri: song.track.uri
					}
				});
			})
			.catch(errorHandler);
	}

	// save user track
	saveUserTrack(trackID) {
		const request =  {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${this.access_token}`
			}
		}

		return fetch(`${this.baseUrl}/me/tracks?ids=${trackID}`, request)
			.then(data => {
				if(data.status === 200){
					return true
				} else {
					false
				}

			})
			.catch(errorHandler);
	}

}

const errorHandler = error => {
	console.log("Ups! ", error);
}

const getRequest = (access_token) => {
	let request =  {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Bearer ${access_token}`
		}
	}
	return request;
}

module.exports = SpotifyClient;