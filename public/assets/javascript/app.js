(function(){

var userInput;   // search term from user is stored here.
var parsedInput;   // output of autocomplete, in form of City, State.
var city;   // City output of autocomplete function i.e. Los Angeles.
var state;   // Stat output of autocomplete function i.e. CA.
var zipcode;   // 5 digit zipcode output of zipcode function i.e. 90028.
var name;   // Name of user when they register or login.
var email;   // Email of user when they register or login.
var password;   // Password of user when they register or login.
var id;   // UID of user in firebase.
var pastSearches = [];   // Array of past cities searched.
var graphData = [];   // Array of arrays of average rent vs time.

var placesKey = "&key=AIzaSyCosNzeaDeb3bNZKdVQMu8AJxzQxaL6jDo";
// var zipcodeKey = "l24t8gV4cPlE14PoXJK9IfKnrGjaY8PkbTNk9IpmyK0zPPXMzIWhYGFqnZBm8qGj";
var zipcodeKey = "7C3XmcSRSlaYneADZyG74YhgAuE7X964M929lU0egbdEpNholXvqVNGwhlEfvKkh";
var googleKey = "&key=AIzaSyAau6LZg7LxUiZ0KjzV_srJ3Ko37t7C1f4";
var jambaseKey = "&api_key=pqzvessme5nr32v3wy5qzsfk&o=json";
var weatherKey = "&APPID=f66bce88fb7fff146e41f75c464a5549";
var houseKey = "api_key=uGsJ4y6VNJNe6ce2ujzk";

// Firebase initilization
// var config = {
// 	apiKey: "AIzaSyB04EBE4lAomxsuidTOhzbx7ea128dh9Vg",
// 	authDomain: "moveto-6bafd.firebaseapp.com",
// 	databaseURL: "https://moveto-6bafd.firebaseio.com",
// 	storageBucket: "moveto-6bafd.appspot.com",
// 	messagingSenderId: "449877402191"
// };

// firebase.initializeApp(config);
// var database = firebase.database();


// ------------------------------ Firebase Login, Register, Logout Functions -------------------------- /

// register function adds user to firebase database based on their email, password, and name entries.

function register(){
    email = $("#email").val();
    password = $("#password").val();
    name = $("#name").val();
	$("#nameDisplay").html("Welcome " + name);
    	
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(firebaseUser) {	
		if (firebaseUser) {
			loadAppKeys();
			id =  firebaseUser.uid;
			database.ref(id).set({userID: id, username: name})
			database.ref(id).child("pastSearches").set(pastSearches);
			
		} else {
			// console.log("No user!")
		}   
	});
}


// loginFunction allows user to enter email and password to log into their specific 
// firebase tree and read out past searches.

function loginFunction(){
    email = $("#email").val();
    password = $("#password").val();

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(firebaseUser) {  
  	    if (firebaseUser) {
  	    	loadAppKeys();
     	 	id =  firebaseUser.uid;	
			pastSearches = [];
			
  	    	database.ref(id).once('value').then(function(snapShot){ 
				if(snapShot.child("pastSearches").val() !== null){ // checks to make sure there is a value in the database node to prevent error //
					pastSearches = snapShot.child("pastSearches").val();
				}
				name = snapShot.child("username").val();
				$("#nameDisplay").html("Welcome " + name);
				printPastSearches();
  	    	});
      	}
   	});
};
// retrieves api keys from firebase 
// function loadAppKeys(){
// 	database.ref(0).child("keys").once('value').then(function(snapShot){
// 		placesKey = snapShot.child("placesKey").val();
// 		zipcodeKey = snapShot.child("zipcodeKey").val();
// 		googleKey = snapShot.child("googleKey").val();
// 		jambaseKey = snapShot.child("jambaseKey").val();
// 		weatherKey = snapShot.child("weatherKey").val();
// 		houseKey = snapShot.child("houseKey").val();
// 	})
// }
// logOut function takes all searches made during session and stores them in the user 
// specific tree in firebase.

function logOut(){
	database.ref(id).child("pastSearches").set(pastSearches);
	firebase.auth().signOut()
	
}


// ------------------------------ User Input Parsing Functions --------------------------------- /

// autoComplete function takes user input, calls google places API, and returns City, State
//  in correct format for our further searches.

// function autoComplete(input){

// 	var placesUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json?";
// 	var placesInput = "input=" + input;
// 	var placesType = "&types=geocode";
// 	var placesQueryUrl = placesUrl + placesInput + placesType + placesKey;

// 	$.ajax({
// 		url: placesQueryUrl,
// 		method:"GET"
// 	}).done(function(placesResponse){
// 		city = placesResponse.predictions[0].terms[0].value;
// 		state = placesResponse.predictions[0].terms[1].value;
// 		parsedInput = city + ", " + state;
// 		$("#city").text(parsedInput);
// 		pushToPastSearchesArray(parsedInput);
// 		printPastSearches();
// 	});
// };

function search(input){
	console.log(input);
	var info = input.split(', ');
	console.log(info);
	city = info[0];
	state = info[1];
	$("#city").text(input);
	pushToPastSearchesArray(input);
	printPastSearches();
}

// checks to see if pasedInput is already present in the pastSearches array//
function pushToPastSearchesArray(parsedInput){
	if (pastSearches.indexOf(parsedInput) > -1) return;
	pastSearches.push(parsedInput);
};



// zipcodeFinder takes city and state of search, returns list of all zipcodes within city // 
function zipcodeFinder (){
	
	var zipcodeQueryUrl = "https://crossorigin.me/https://www.zipcodeapi.com/rest/";
	var zipcodeCityState = `/city-zips.json/${city}/${state}`;
	
	var zipcodeFullQueryUrl = zipcodeQueryUrl + zipcodeKey + zipcodeCityState;
	// var zipcodeFullQueryUrl = "https://crossorigin.me/https://www.zipcodeapi.com/rest//city-zips.json/portland/or"
	$.ajax({
		url: zipcodeFullQueryUrl,
		method: "GET"
	}).done(function(response){
		zipcode = response.zip_codes[0];
		jambase();
		quandl();
	});
};


// ------------------------------ Google Map Function --------------------------------- /

// Google Map function takes user search and returns a static map of the city with a 
// link to google.maps.com or that specific city.

function googleMap () {
	$(".googleMapDiv").empty();
	var mapUrl = "https://maps.googleapis.com/maps/api/staticmap?center=";
	var zoom = "&zoom=14";
	var size = "&size=425x275&scale=1"

	var fullMapUrl = mapUrl + userInput + zoom + size + googleKey;
	var mapLink = $("<a>");
	var newMap = $("<img>");

	newMap.attr("src", fullMapUrl);
	newMap.addClass("googleMap");
	mapLink.append(newMap);
	mapLink.attr("href", "https://www.google.com/maps/place/"+userInput);
	mapLink.attr("target", "_blank");
	$(".googleMapDiv").append(mapLink);
};


// ------------------------------ Music Nearby Functions --------------------------------- /

// jambase takes random zipcode within city, queries jambase API, and returns concert information.

function jambase(){

	
	var jambaseQueryUrl = "http://api.jambase.com/events?";
	var jambaseZipcode = "zipcode=" + zipcode;
	var numberPages = 0;
	var jambasePages = "&page=" + numberPages;

	var jambaseFullQueryUrl = jambaseQueryUrl + jambaseZipcode + jambasePages + jambaseKey;

	$.ajax({
		url: jambaseFullQueryUrl,
		method: "GET"
	})
	.done(function(response){
		var results = response.Events;
		addMusicEvents(results);
	});
};


// addMusicEvents function takes the concert info from above and prints it to the website

function addMusicEvents(results) {
	$("#musicBody").empty();
	for(var i = 0; i < 15; i++) {
		var newTr = $("<tr>");
		var newDateTd = $("<td>").addClass("mdl-data-table__cell--non-numeric");
		var newNameTd = $("<td>");
		var newVenueTd = $("<td>");
		var newTixTd = $("<td>");
		// var date = moment(results[i].Date).format("MMM Do YY");
		var name = results[i].Artists[0].Name;
		var venue = results[i].Venue.Name;
		var tix = results[i].TicketUrl;
		var tixLink = $("<a>");

		newDateTd.text(date);
		newNameTd.text(name);
		newVenueTd.text(venue);
		tixLink.text("Tickets");
		tixLink.attr("href", tix);
		tixLink.attr("target", "_blank");
		newTixTd.append(tixLink);

		newTr.append(newDateTd, newNameTd, newTixTd, newVenueTd);
		$("#musicBody").append(newTr)
	}
};


// ------------------------------ Weather Info Functions --------------------------------- /

// weatherInfo function takes userinput, queries openWeatherAPI, and returns 16 day weather info.

function weatherInfo () {
	
	var numResults = "&cnt=7";
	var outputType = "&mode=json";
	var weatherQueryUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + outputType + numResults + weatherKey;
	$.ajax({
		url: weatherQueryUrl,
		method: "GET"
	})
	.done (function(response){
		addWeather(response);
	});
};


// addWeather function takes data from weatherInfo function and prints it to the website.

function addWeather (response) {
	var results = response.list;
	$("#weatherBody").empty();
	for (var i = 0; i < results.length; i++) {
		var high = Math.ceil(response.list[i].temp.max * 9/5 - 459.67);
		var low = Math.ceil(response.list[i].temp.min  * 9/5 - 459.67);
		var date = moment.unix(response.list[i].dt).format("MMM Do YYYY");
		var image = response.list[i].weather[0].icon;
		var newTr = $("<tr>");
		var newDateTd = $("<td>");
		var newWeatherTd = $("<img>")
		var newHighTd = $("<td>");
		var newLowTd = $("<td>");

		newWeatherTd.attr("src", "http://openweathermap.org/img/w/"+image+".png");
		newDateTd.text(date);
		newHighTd.text(high);
		newLowTd.text(low);

		$(newTr).append(newDateTd, newWeatherTd, newHighTd, newLowTd);
		$("#weatherBody").append(newTr);
	}
}


// ------------------------------ Average Rent Functions --------------------------------- /

// quandl function takes zipcode, queries quandl API, and returns average rent per month data of city.

function quandl(){
	var houseQueryUrl = "https://www.quandl.com/api/v3/datasets/ZILL/";
	
	var numResults = 10;
	var addLimit = "limit=" + numResults;

	var city = 10001;
	var format = ".json?"

	var areaType = {
		city: "C",
		zipcode: "Z"
	};

	var housingType = {
		allHomes: "_A",
		singleFamily: "_SF",
		medianRent: "_RMP",
		medianListPrice: "_MLP",
	};

	var fullQueryZipcode = houseQueryUrl + areaType.zipcode + zipcode + housingType.medianRent + format + houseKey;
	
	$.ajax({
		url: fullQueryZipcode,
		method: "GET",	
	})
	.done(function(response){
		var results = response.dataset.data;
		addHomeInfo(results);
	});
};


// addHomeInfo function takes the data from quandl function and adds it the graphData array, 
// then calls google charts library to print data to page.

function addHomeInfo(results) {
	$("#statsBody").empty();
	for (var i = 0; i < results.length; i++) {
		var price = results[i][1];
		var date = moment(results[i][0]).format("MMM YYYY");
		var dataPoint = [date, price];
		graphData.push(dataPoint);
	};

	graphData = graphData.reverse();

	google.charts.load('current', {packages: ['corechart']});
	google.charts.setOnLoadCallback(drawChart);

};


// drawChart function uses google charts library to create a line graph of average rent vs time.

function drawChart() {
	var data = new google.visualization.DataTable();
	data.addColumn("string", "Date");
	data.addColumn("number", "Rent");
	data.addRows(graphData);

	var options = {
		width:500,
		height:300,
		vAxis: {
			title: "Average Rent in $"
		}
	}

	var chart = new google.visualization.LineChart(document.getElementById("rentGraph"));
	chart.draw(data, options);
};


// ------------------------------ On Click Events and DOM Manipulation --------------------------------- /

$(".mdl-cell--6-col").hide();
$("#signOutButton").hide();
$("#signInButton").hide();

// event listener attached to search bar, sets global variables for session, 
// calls functions to get info from APIs.

$("#citySearch").on("submit", function() {
	$(".mdl-cell--6-col").show();
	$("#search").css("margin-top", "0");
	userInput = $("#location").val().trim();
	// autoComplete(userInput);
	search(userInput);
	$("#location").val("");
	zipcodeFinder();
	googleMap();
	weatherInfo();
	printPastSearches();
	return false;
});


// event listener attached to past searches sidebar. On click of a city button, 
// it will search that term as if the user had typed it in the search bar.

$(document).on("click", ".past-search", function(){
	userInput = $(this).data("term");
	$('.displayPannel').show();
	$('#map').show();
	for (var i = 0; i < pastSearches.length; i++) {
		if (userInput === pastSearches[i]){
			pastSearches.splice(i, 1);
		};
	};
	// autoComplete(userInput);
	search(userInput);
	zipcodeFinder();
	googleMap();
	weatherInfo();
	return false;
})


// printPastSearches function takes past searches of the user (within session for non-logged in, 
// all sessions for logged in) and prints them the side bar.

function printPastSearches(){
	$("#pastSearchesList").empty();
	for (var i = 0; i < pastSearches.length; i++) {
		var button = $("<a>");
		button.addClass("mdl-button mdl-js-button mdl-js-ripple-effect past-search");
		button.text(pastSearches[i]);
		button.attr("data-term", pastSearches[i]);
		$("#pastSearchesList").prepend(button);
	}
};


// event listener on login button that will run loginFunction.

$("#loginButton").on("click", function(){
	loginFunction();
	logDisplay();
});


// event listener on register button that will run the register function.

$("#registerButton").on("click", function(){
	register();
	logDisplay();
});


// event listener on continue as guest button that will allow user to use site 
// without logging in or registering.

$("#guestButton").on("click", function(){
	logDisplay();
	$("#nameDisplay").html("Past Searches");
	$("#signOutButton").hide();
	$("#signInButton").show();
});


// event listener on signout button, calling logout fuction to push session data to firebase, 
// and bringing up login modal.

$("#signOutButton").on("click", function(){
	$('.displayPannel').hide();
	$('#map').hide();
	$("#city").empty();
	$("#overlay").show();
	$(".card-wide").show();
	$("#signInButton").hide();
	$("#signOutButton").hide();
	$("#nameDisplay").html("");
	$(".card-wide").css("margin-top", "-150px");
	$("#pastSearchesList").empty();
	logOut();
});


// event listener on signin button, allowing users who chose to continue as guest to now register / login.

$("#signInButton").on("click", function(){
	loginFunction();
	$("#overlay").show();
	$(".card-wide").show();
	$("#signOutButton").hide();
	$("#signInButton").hide();
	$("#nameDisplay").html("");
	$(".card-wide").css("margin-top", "-150px");
});


// logDisplay function houses DOM manipulation calls that are the same for more than one button.

function logDisplay(){
	$("#overlay").hide();
	$(".card-wide").hide();
	$("#email").val("");
	$("#name").val("");
	$("#password").val("");
	$("#signOutButton").show();
};


})(this);