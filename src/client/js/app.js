/* Global Variables */
// const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip='
// const apiKey = '&APPID=d73946388d98ee33c464c625756851e2&units=imperial'
// const zipCode = document.getElementById('zip').value;
const geonames_username = 'mahum'
// const geonameURL = 'http://api.geonames.org/searchJSON?q='
const weatherbit_apiKey = '25e64ccb62c842c6a2f539514735a74f'
// const weatherbitURL = 'http://api.weatherbit.io/v2.0/forecast/daily?lat='
const pixabay_apiKey = '17623880-f3832363eaa493c9749941d77'
// const pixabay_apiKey = '18363707-17c9855955e991a32387a6493'
// const pixabayURL = 'http://pixabay.com/api/?key='
// const apiURL = 'http://localhost:3000'

document.getElementById('generate').addEventListener('click', bringAction);
// /* Function called by event listener */
function bringAction(event) {


// function bringAction(e){
//   e.preventDefault();

// Get city and dates from UI
const city = document.getElementById('city').value;
const deptDate = document.getElementsByClassName("myInput")[0].value;
const retDate = document.getElementsByClassName("myInput")[1].value;

// Understanding this part from: "https://www.w3schools.com/howto/howto_js_countdown.asp"

// Get today's date 
	var now = new Date().getTime()
// Set the date we're counting down to
	var countDownDate = new Date(deptDate).getTime()
// Find the distance between now and the count down date
	var difference = countDownDate - now
// Time calculations for days
	var days = Math.floor(difference / (1000 * 60 * 60 * 24));
// Display the result in the element with id="demo"
  document.getElementById("tripInfo").innerHTML = `Your trip is ${days} days away`;

// Fetching geonames stats of destination place
	// dataGeonames(geonameURL, city, geonames_username)
	getDataFromGeoNames(city)
    	.then(async function(data) {
          // After the research, figured this out:
          //add data to POST request
         return  await postData('http://localhost:3000/geonames', {
        	latitude: data.geonames[0].lat,
        	longitude: data.geonames[0].lng
        })
        })
        
// Understood this part from: "https://knowledge.udacity.com/questions/248845"

        .then(function(res) {
        	console.log("MY res", res)
        	const lat = res[res.length - 1].latitude;
            const lng = res[res.length - 1].longitude;
            console.log("MY LAT", lat)
        	return {lat, lng};
        
        })

        .then(async function({lat, lng}) {
        	console.log("coords for Weather", lat, lng)
        	return await getDataFromWeatherBit(lat, lng);
        })
        .then(function (weatherData) {
        	return  postData('http://localhost:3000/weatherbit', {
        		high: weatherData.data[0].high_temp,
        		low: weatherData.data[0].low_temp,
        		description: weatherData.data[0].weather.description
        	})

        })
        .then(async function() {
        	return await getDataFromPixabay(city);
        })
        .then(function (data) {
        	console.log("llllll")
        	return postData('http://localhost:3000/pixabay', {
        		image: data.hits[0].webformatURL
        	})
       	// Update
       	.then(updateUI());

    })
};

// OR
	// .then(function(data){
	// updateUI()
	// });

// Function to get Geonames data
	// const dataGeonames = async (geonameURL, city, geonames_username) => {
		const getDataFromGeoNames = async (city) => {
		const url = `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${geonames_username}`
		const res = await fetch (url);
		try {
			const data = await res.json();
			return data;
		}
		catch (error) {
			console.log("Geonames Error", error);
		}
	}

//Function to get Weatherbit data
	const getDataFromWeatherBit  = async (lat, lng) => {
		const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${weatherbit_apiKey}`;
		const res = await fetch (url);
		try {
			const data = await res.json();
			return data;
		}
		catch (error) {
			console.log("Weatherbit Error", error);
		}
	}

// Function to ger Pixabay data
	const getDataFromPixabay = async (city) => {
		const url = `http://pixabay.com/api/?key=${pixabay_apiKey}&q=${city}&image_type=photo`;
		// const url = `https://pixabay.com/api/?key=18363707-17c9855955e991a32387a6493&q=istanbul&image_type=photo`;
		const res = await fetch (url);
		console.log(city, "pppppp")
		try {
			const data = await res.json();
			return data;
		}
		catch (error) {
			console.log("Pixabay Error", error);
		}
	}

	const postData = async (url = "", data = {}) => {
  		const response = await fetch(url, {
		    method: "POST",
		    credentials: "same-origin",
		    headers: {
		      "Content-Type": "application/json",
		    },
		    body: JSON.stringify(data)
		});
  			try {
			    const newData = await response.json();
			    return newData;
  			} 
  			catch (error) {
    			console.log("error", error);
 			}
	};



//Updating the UI dynamically

	const updateUI = async () => {
  const res = await fetch("http://localhost:3000/data");

  try {
    const allData = await res.json();
    document.getElementById("content").innerHTML = `The Weather Forecast is <br> High: ${allData[allData.length - 2].high}, Low: ${allData[allData.length - 2].low} <br>  ${allData[allData.length - 2].description}`;
    document.getElementById("image").src = allData[allData.length - 1].image;
  } catch (error) {
    console.log("error", error);
  }
};
	
export { 
	bringAction,
	getDataFromGeoNames,
	  getDataFromWeatherBit,
	  getDataFromPixabay,
	  updateUI,
	  postData,
};