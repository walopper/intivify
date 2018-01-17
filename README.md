# Intivify Favs App

## Description

This app will let you find song in spotify and added to your favorites list. Adding song to your favorites list, will let you browse and play it on this app and any other spotify app.

## Install

### Backend server

1. Install required packages.
    ```
    $ npm install
    ```
    Or you can use Yarn as well
    ```
    $ yarn
    ```
    
2. Start the server
    ```
    $ yarn serve
    ```
    You can also use ```npm run serve```
    
### Start the app
Since this app is a test development, the app need to be served in a specific port (8085). If you want to serve it in another port, and with any other webserver, you need to change the port in ``` ./dist/callback/index.html ```

#### Serving the app with webpack-dev-server

Enter main folder and run
```
$ yarn start
```

You can also use ```npm run start```

## TODO
- Delete favorites
- More results (results pagination)
- InApp music player
- Implement GraphQL instead of REST
- Use a refresh token
- Make a nide header
- Convert Stylus file to SASS and bundle in webpack
- Unit testing
- Code refactor (It's a little messy right now, React components must be in separated files).
- Render views in backend with react
- Make it responsive
- Implement a service worker and add a manifest

## Test regarding
Since I didn't have much time (just a few hours in the weekends), there is a lot of TODO for this app. I will continue it just to practice all those technologies.
I had so many issues with node-sass in muy computer (not working with my OS) so I code styles in Stylus and compile it with Stylus npm package.

## Technical description
The main front-end app is located in ```./src``` folder, where ```app.jsx``` is the entry point.
This app will require an external service ```./src/js/service.js```. This service will fetch the backend and return the response to the app.

In the login action, the service will popup the Spotify OAuth2 login page. Once you autorize the app to use your spotify account, the window will redirect to the local ```./public/index.html``` and that page will pass the access token to the app  and close the window. The app will store the access token for later use.
Once you are logged in, that app will fetch your current favorites list and display it in the right side. All api call in the app, will use the service, with fetch the backend. 
Request in the service are done with Jquery ajax method and return the promise to the app.

The backend uses node-fetch, via an external service (spotifyGateway.js) to query spotify api. This is a class with all method needed for the app. Some of this methos, map the spotify responses to remove unused properties.
The server uses ExpressJS yo serve the responses to the app and serve static conttent to the app, like styles and bundle.js.

Font-icons were bundle with icomoon app. Icons were download from flaticon.com as svg and imported in icomoon app.
