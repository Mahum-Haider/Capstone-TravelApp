// Setup empty JS object to act as endpoint for all routes
let projectData = [];

// Require Express to run server and routes
const express = require('express');
const http = require('http');

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require('body-parser')
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Specify the directory from where to load files
app.use(express.static('dist'));

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

const port = 3000;
// Setup Server
const server = app.listen(port, listening);
 function listening(){
    console.log("server running"); 
    console.log(`running on localhost: ${port}`);
  };

// // Add a GET route that returns the projectData
  app.get('/data', callBack)
    function callBack (req, res) {
      res.send(projectData);
    };


// Add a "Geonames POST Route" that adds incoming data to projectData 
	app.post('/geonames', function (req, res) {
    console.log(req.body)
    dataGeonames = {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        // country: req.body.country
    };
  	 //   Object.assign(projectData, dataGeonames);
		  // res.send(projectData)
		  // console.log("MY", projectData);
      projectData.push(dataGeonames);
      res.send(projectData);
      console.log("MY", projectData);
  });

// Add a "WeatherBit POST Route" that adds incoming data to projectData 
  app.post('/weatherbit', function (req, res) {
    dataWeatherbit = {
        high: req.body.high,
        low: req.body.low,
        description: req.body.description
    };
      projectData.push(dataWeatherbit);
      res.send(projectData);
  });

// Add a "Pixabay POST Route" that adds incoming data to projectData 
  app.post('/pixabay', function (req, res) {
    dataPixabay = {
        image: req.body.image
    };
    projectData.push(dataPixabay);
    res.send(projectData);
  });

// export server
module.exports = server;

