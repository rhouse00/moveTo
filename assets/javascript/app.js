(function(){

$(".mdl-cell--6-col").hide();
$("#signOutButton").hide();
$("#signInButton").hide();

var userInput = "";
var parsedInput = "";
var cityCode;
var city;
var state;
var zipcode;
var graphData = [];
var name = "";
var email = "";
var password = "";
var id;
var pastSearches = [];



// Login logic

var config = {
	apiKey: "AIzaSyB04EBE4lAomxsuidTOhzbx7ea128dh9Vg",
	authDomain: "moveto-6bafd.firebaseapp.com",
	databaseURL: "https://moveto-6bafd.firebaseio.com",
	storageBucket: "moveto-6bafd.appspot.com",
	messagingSenderId: "449877402191"
};

firebase.initializeApp(config);
var database = firebase.database();


function loginFunction(){
    email = $("#email").val();
    password = $("#password").val();

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(firebaseUser) {  
  	    if (firebaseUser) {
     	 	id =  firebaseUser.uid;	
			pastSearches = [];
     	 	console.log(id);
  	    	database.ref(id).once('value').then(function(snapShot){ 
				pastSearches = snapShot.child("pastSearches").val();
				name = snapShot.child("username").val();
				$("#nameDisplay").html("Welcome " + name);
				printPastSearches();
  	    	});
      	}
   	});
};

function register(){
    email = $("#email").val();
    password = $("#password").val();
    name = $("#name").val();
	$("#nameDisplay").html("Welcome " + name);
    	
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(firebaseUser) {	
		if (firebaseUser) {
			id =  firebaseUser.uid;
			database.ref(id).set({userID: id, username: name})
		} else {
			console.log("No user!")
		}   
	});
}

function logOut(){
	console.log(id);
	database.ref(id).child("pastSearches").set(pastSearches);
	firebase.auth().signOut()
	
}


// Autocomplete to get the perfectly parsed city name 
function autoComplete(input){
	var placesKey = "&key=AIzaSyCosNzeaDeb3bNZKdVQMu8AJxzQxaL6jDo";
	var placesUrl = "https://crossorigin.me/https://maps.googleapis.com/maps/api/place/autocomplete/json?";
	var placesInput = "input=" + input;
	var placesType = "&types=geocode";

	var placesQueryUrl = placesUrl + placesInput + placesType + placesKey;

	$.ajax({
		url: placesQueryUrl,
		method:"GET"
	}).done(function(placesResponse){
		city = placesResponse.predictions[0].terms[0].value;
		state = placesResponse.predictions[0].terms[1].value;
		parsedInput = city + ", " + state;
		console.log(parsedInput);
		$("#city").text(parsedInput);
		pastSearches.push(parsedInput);
		printPastSearches();
	});
};


function zipcodeFinder (){
	var zipcodeKey = "l24t8gV4cPlE14PoXJK9IfKnrGjaY8PkbTNk9IpmyK0zPPXMzIWhYGFqnZBm8qGj";
	var zipcodeQueryUrl = "https://crossorigin.me/https://www.zipcodeapi.com/rest/";
	var zipcodeCity = "/city-zips.json/" + city;
	var zipcodeState = "/"+ state + ".";
	
	var zipcodeFullQueryUrl = zipcodeQueryUrl +zipcodeKey + zipcodeCity + zipcodeState;

	$.ajax({
		url: zipcodeFullQueryUrl,
		method: "GET"
	}).done(function(response){
		var randomNumber = Math.floor(Math.random() * response.zip_codes.length) + 1;
		zipcode = response.zip_codes[randomNumber];
	});
};


function jambase(){

	var jambaseKey = "&api_key=9jb9b7n5gjuehm3kah3zqe4b&o=json";
	var jambaseQueryUrl = "https://crossorigin.me/http://api.jambase.com/events?";
	var jambaseZipcode = "zipcode=" + zipcode;
	var numberPages = 0;
	var jambasePages = "&page=" + numberPages

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


// music event function

function addMusicEvents(results) {
	$("#musicBody").empty();
	for(var i = 0; i < 15; i++) {
		var newTr = $("<tr>");
		var newDateTd = $("<td>").addClass("mdl-data-table__cell--non-numeric");
		var newNameTd = $("<td>");
		var newVenueTd = $("<td>");
		var newTixTd = $("<td>");
		var date = moment(results[i].Date).format("MMM Do YY");
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


// Quandl function

function quandl(){
	var houseQueryUrl = "https://crossorigin.me/https://www.quandl.com/api/v3/datasets/ZILL/";
	var houseKey = "api_key=y2xh6kV4KLrYCNGRJmSj"
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
	// var fullQueryCity = houseQueryUrl + areaType.city + cityCode + housingType.medianRent + format + houseKey;

	$.ajax({
		url: fullQueryZipcode,
		method: "GET",	
	})
	.done(function(response){
		var results = response.dataset.data;
		addHomeInfo(results);
	});
};


// function checkInput(userInput){
//   	var alphaExp = /^[a-zA-Z ]+$/;
// 	var numericExpression = /^[0-9]+$/;
// 	if(userInput.match(alphaExp)){
// 		getCityCode(userInput);
// 	} else if(userInput.match(numericExpression)){

// 	};
// };

// function getCityCode (userInput) {
// 	database.ref().child("-KWklNSHU4YBCKzFREu7").once('value').then(function(snapShot){ 
// 		var inputCityCode = snapShot.val().find(function(cityCode){
// 			if(cityCode.City === userInput){
// 				return cityCode;
// 			}
// 		});
// 		cityCode = inputCityCode.Code;
// 	});
// };


// Home info function

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


// Google Map function

function googleMap () {
	$(".googleMapDiv").empty();
	var mapUrl = "https://maps.googleapis.com/maps/api/staticmap?center=";
	var zoom = "&zoom=14";
	var size = "&size=425x275&scale=1"
	var googleKey = "&key=AIzaSyAau6LZg7LxUiZ0KjzV_srJ3Ko37t7C1f4";
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


// Weather API

function weatherInfo () {
	var weatherKey = "&APPID=d08b9cd3e13cf6b5a305591b965112f6"
	var numResults = "&cnt=" + 16
	var weatherQueryUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + userInput + numResults + weatherKey;
	$.ajax({
		url: weatherQueryUrl,
		method: "GET"
	})
	.done (function(response){
		addWeather(response);
	});
};

function addWeather (response) {
	var results = response.list;
	$("#weatherBody").empty();
	for (var i = 0; i < results.length; i++) {
		var high = Math.ceil(response.list[i].temp.max * 9/5 - 459.67); //farenheit
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


// on enter key

$("#citySearch").on("submit", function() {
	$(".mdl-cell--6-col").show();
	$("#search").css("margin-top", "0");
	userInput = $("#location").val().trim();
	autoComplete(userInput);
	$("#location").val("");
	setTimeout(zipcodeFinder, 1000);
	// checkInput(userInput);
	setTimeout(jambase, 2000);
	setTimeout(quandl, 2000);
	googleMap();
	weatherInfo();
	printPastSearches();
	return false;
});

$(document).on("click", ".past-search", function(){
	userInput = $(this).data("term");
	for (var i = 0; i < pastSearches.length; i++) {
		if (userInput === pastSearches[i]){
			pastSearches.splice(i, 1);
		};
	};
	autoComplete(userInput);
	setTimeout(zipcodeFinder, 1000);
	// checkInput(userInput);
	setTimeout(jambase, 2000);
	setTimeout(quandl, 2000);
	googleMap();
	weatherInfo();
	return false;
})


// button functionalities

$("#loginButton").on("click", function(){
	loginFunction();
	logDisplay();
});

$("#registerButton").on("click", function(){
	register();
	logDisplay();
});

$("#guestButton").on("click", function(){
	logDisplay();
	$("#nameDisplay").html("Past Searches");
	$("#signOutButton").hide();
	$("#signInButton").show();
});

$("#signOutButton").on("click", function(){
	$("#overlay").show();
	$(".card-wide").show();
	$("#signInButton").hide();
	$("#signOutButton").hide();
	$("#nameDisplay").html("");
	logOut();
});

$("#signInButton").on("click", function(){
	loginFunction();
	$("#overlay").show();
	$(".card-wide").show();
	$("#signOutButton").hide();
	$("#signInButton").hide();
	$("#nameDisplay").html("");
	$(".card-wide").css("margin-top", "-150px");
});

function logDisplay(){
	$("#overlay").hide();
	$(".card-wide").hide();
	$("#email").val("");
	$("#name").val("");
	$("#password").val("");
	$("#signOutButton").show();
};

function drawChart() {
	var data = new google.visualization.DataTable();
	data.addColumn("string", "Date");
	data.addColumn("number", "Rent");
	data.addRows(graphData);

	var chart = new google.visualization.LineChart(document.getElementById("rentGraph"));
	chart.draw(data, null);
};


})(this);