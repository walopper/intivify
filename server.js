
const settings = require('./settings.js');

const express = require('express');  
const app = express();  
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
//const io = require('socket.io')(server);
const spotifyGateway = require('./spotifyGateway');
let spotify = new spotifyGateway();

// cords
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// server static contect
app.use(express.static('public'));

// after login, set access_token to api
app.get('/init/:access_token', function(req, res) {

    // console.log("Init with access_token", req.params.access_token);
    spotify.setToken(req.params.access_token);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({done: true}));

});

// get the send request from the frontend and request results from spotify gateway
app.post('/search', function(req, res) {

    spotify.search(req.body.stringToSearch)
        .then(result => {
            res.setHeader('Content-Type', 'application/json');
            // console.log("SR", result);
            res.send(JSON.stringify(result));
        })
        .catch(errorHandler);

});

// get user favorites / saves tracks
app.get('/getUserFavorites', function(req, res) {

    spotify.getUserTracks()
        .then(result => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        })
        .catch(errorHandler);

});

// get user favorites / saves tracks
app.get('/saveUserTrack/:trackID', function(req, res) {

    spotify.saveUserTrack(req.params.trackID)
        .then(result => {
            res.setHeader('Content-Type', 'application/json');
            console.log("track SAVED");
            res.send(result);
        })
        .catch(errorHandler);

});


// create the server
app.listen(settings.localServer.port, () => console.log(`Visit http://localhost:${settings.localServer.port}`));

function errorHandler(error){
    console.log("Ups!", error);
}
