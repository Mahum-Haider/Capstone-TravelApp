

// import { handleSubmit } from './js/formHandler'
// import { checkForName } from './js/nameChecker'
// console.log(checkForName);

// alert("I EXIST")

import { 
	bringAction,
	dataGeonames,
	dataWeatherbit,
	dataPixabay,
	postData,
	updateUI
} from './js/app.js'




document.addEventListener('DOMContentLoaded', () => {
    const button_submit = document.getElementById("generate");
    button_submit.addEventListener('click', bringAction);
});

alert("I EXIST")
console.log("CHANGE!!");

import './styles/style.scss'

export { 
	bringAction,
	dataGeonames,
	dataWeatherbit,
	dataPixabay,
	postData,
	updateUI
};