/* Global Variables */
// const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip='
// const apiKey = '&APPID=d73946388d98ee33c464c625756851e2&units=imperial'
// const zipCode = document.getElementById('zip').value;
const geonames_username = 'mahum'
const geonameURL = 'http://api.geonames.org/searchJSON?q='
const weatherbit_apiKey = '25e64ccb62c842c6a2f539514735a74f'
const weatherbitURL = 'https://api.weatherbit.io/v2.0/forecast/daily?lat='
const pixabay_apiKey = '17623880-f3832363eaa493c9749941d77'
const pixabayURL = 'https://pixabay.com/api/?key='
const apiURL = 'http://localhost:3000'

document.getElementById('generate').addEventListener('click', bringAction);
/* Function called by event listener */
function bringAction(event) {

// Get city and dates from UI
const city = document.getElementById('city').value;
const deptDate = document.getElementById('deptdate').value
const retDate = document.getElementById('retdate').value

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
	if(document.getElementById("tripInfo")) {
	    document.getElementById("tripInfo").innerHTML = `Your trip is ${days} days away`;
	};


// Fetching geonames stats of destination place
	// dataGeonames(geonameURL, city, geonames_username)
	dataGeonames(city)
    	.then(function(data) {
        	// console.log(data)
        // return postData("http://localhost:3000/geonames", {
        	// OR
        // return postData('/geonames', {
            // latitude: data.main.latitude,
            // longitude: data.main.longitude,
            // country: data.main.country

          // After the research, figured this out:
         return postData('/geonames', {
        	latitude: data.geonames[0].lat,
        	longitude: data.geonames[0].lng,
        	city: data.geonames[0].name
        })
        })

// Understanding this part from: "https://knowledge.udacity.com/questions/248845"

        .then(function(res) {
        	console.log("res")
        	// const lat = res[res.length - 1].latitude;
        	// const lng = res[res.length - 1].longitude;
        	const lat=res[0].latitude
            const lng= res[0].longitude
        	return {lat, lng};
        })
        .then (function({lat, lng}) {
        	console.log("coords for Weather", lat, lon)
        	dataWeatherbit(lat, lng);
        })
        .then(function (weatherData) {
        	return postData('/weatherbit', {
        		high: weatherData.data[0].high_temp,
        		low: weatherData.data[0].low_temp,
        		description: weatherData.data[0].weather.description
        	});

        })
        .then(function() {
        	return dataPixabay(city);
        })
        .then(function (data) {
        	return postData('/pixabay', {
        		image: data.hits[0].webformatURL
        	})
       	// Update
        .then(function() {
        	updateUI()
        })
        })
};
// OR
	// .then(function(data){
	// updateUI()
	// });

// Function to get Geonames data
	// const dataGeonames = async (geonameURL, city, geonames_username) => {
		const dataGeonames = async (city) => {
		const gnurl = `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${geonames_username}`
		const res = await fetch (gnurl);
		try {
			const data = await res.json();
			return data;
		}
		catch (error) {
			console.log("dataGeonames Error", error);
		}
	}

//Function to get Weatherbit data
	const dataWeatherbit = async (weatherbitURL, lat, lng, weatherbit_apiKey) => {
		const wburl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${weatherbit_apiKey}`;
		const res = await fetch (wburl);
		try {
			const data = await res.json();
			return data;
		}
		catch (error) {
			console.log("dataWeatherbit Error", error);
		}
	}

// Function to ger Pixabay data
	const dataPixabay = async (pixabayURL, pixabay_apiKey, city, image) => {
		const pburl = `https://pixabay.com/api/?key=${pixabay_apiKey}&q=${city}&image_type=photo`;
		const res = await fetch (pburl);
		try {
			const data = await res.json();
			return data;
		}
		catch (error) {
			console.log("dataPixabay Error", error);
		}
	}


	const postData = async (url = '', data = {}) => {
		const response = await fetch('url', {
			method: "POST",
			credentials: "same-origin",
			headers: {
			    "Content-Type": "application/json",
			    // 'Accept': 'application/json'
		    },
		    body: JSON.stringify(data),
		});
		  	try {
			    const newData = await response.json();
			    console.log(newData);
			    return newData;
		  	} 
		  	catch (error) {
		    	console.log("error", error);
		  	}



//Updating the UI dynamically
	const updateUI = async () => {
		const request = await fetch('http://localhost:3000/data');
		try{
		  	const allData = await request.json();
		  	// console.log(allData)
		  	document.getElementById('content').innerHTML = `The Weather Forecast Today <br> 
		 		High: ${allData[allData.length - 2].high},
		 		Low: ${allData[allData.length - 2].low} <br> ${allData[allData.length - 2].description}`;
		    document.getElementById("image").src = allData[allData.length - 1].image;
  		} 
  		catch (error) {
		    console.log("error", error);
		}
	}
}


	
// export { 
// 	bringAction,
// 	dataGeonames,
// 	dataWeatherbit,
// 	dataPixabay,
// 	postData,
// 	updateUI
// };