import fetch from 'node-fetch';
import $ from 'jquery';
import settings from '../../settings.js';

const service = {

	access_token: null,

	/** fetch to search the song */
	searchSong: stringToSearch => {
		return $.ajax(`http://localhost:${settings.localServer.port}/search`, {
			method: 'post',
			data: { stringToSearch: stringToSearch }
		});

	},

	/** fetch to search the song */
	getUserTracks: () => {
		return $.ajax(`http://localhost:${settings.localServer.port}/getUserFavorites?limit=50`, {
				method: 'get',
				dataType: 'json'
			});
	},

	/** save track to user songs list */
	saveUserTrack: trackID => {
		return $.ajax(`http://localhost:${settings.localServer.port}/saveUserTrack/${trackID}`, {
				method: 'get',
				dataType: 'json'
			});
	},

	/** login in spotify and autorize this app */
	login: (callback, setUserTracksCallback) => {

		// build url
		function getLoginURL(scopes) {
            return 'https://accounts.spotify.com/authorize?client_id=' + settings.spotify.ClientID +
              '&redirect_uri=' + encodeURIComponent(settings.spotify.RedirectURL) +
              '&scope=' + encodeURIComponent(scopes.join(' ')) +
              '&response_type=token';
        }

		// Auth scope
		const url = getLoginURL([
            'user-read-email', 
			'playlist-read-private', 
			'playlist-modify-public', 
			'playlist-modify-private',
			'playlist-read-collaborative',
			'user-library-read', 
			'user-library-modify',
			'user-read-private',
			'user-top-read'
        ]);

        /* add listener for the auth windows and wait for the access_ltoken */
		window.addEventListener('message', event => {
			if(!event.data) return; // patch

            const hash = JSON.parse(event.data);

            if (hash.type == 'access_token') {
				service.access_token = hash.access_token;
				callback(hash.access_token);
            }

			
			$.ajax(`http://localhost:${settings.localServer.port}/init/${hash.access_token}`, {
				method: 'get',
				dataType: 'json'
			}).then(() => {
				service.getUserTracks().then(setUserTracksCallback);
			}).catch(error => console.log("error getting user tracks", error));

			// kill the listener
			window.removeEventListener('message', () => {});


		}, false);
        
		const width = 450,
            height = 730,
            left = (screen.width / 2) - (width / 2),
            top = (screen.height / 2) - (height / 2);

        const w = window.open(url,
                            'Spotify',
                            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
                           );
	}

}

const getRequest = (postParams = {}) => {
	let request =  {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		data: postParams
	}
	return request
}

module.exports = service;