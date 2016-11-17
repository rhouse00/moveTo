(function(){

$(".mdl-cell--6-col").hide();
$("#signOutButton").hide();
$("#signInButton").hide();

var userInput = "";
var parsedInput = "";
var cityCode;



// Login logic

var config = {
    apiKey: "AIzaSyBYWTeOhT42zgZZnA21IcyAQ10pNAtQaWs",
    authDomain: "angulardev-699fa.firebaseapp.com",
    databaseURL: "https://angulardev-699fa.firebaseio.com",
    storageBucket: "angulardev-699fa.appspot.com",
    messagingSenderId: "527207620597"
};

firebase.initializeApp(config);
var database = firebase.database();

var name = "";
var email = "";
var password = "";
var id = "";
var pastSearches = [];

function loginFunction(){
    email = $("#email").val();
    password = $("#password").val();

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(firebaseUser) {  
  	    if (firebaseUser) {
     	 	id =  firebaseUser.uid;	
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
			var id =  firebaseUser.uid;
				database.ref(id).set({userID: id, username: name})
		} else {
			console.log("No user!")
		}   
	});
}

function logOut(){
	database.ref(id).child("pastSearches").set(pastSearches);
	firebase.auth().signOut()
	pastSearches = [];
}


// Autocomplete to get the perfectly parsed city name 
function autoComplete(){
	var placesKey = "&key=AIzaSyCosNzeaDeb3bNZKdVQMu8AJxzQxaL6jDo";
	var placesUrl = "https://crossorigin.me/https://maps.googleapis.com/maps/api/place/autocomplete/json?";
	var placesInput = "input=" + userInput;
	var placesType = "&types=geocode";

	var placesQueryUrl = placesUrl + placesInput + placesType + placesKey;

	$.ajax({
		url: placesQueryUrl,
		method:"GET"
	}).done(function(placesResponse){
		var city = placesResponse.predictions[0].terms[0].value;
		var state = placesResponse.predictions[0].terms[1].value;
		parsedInput = city + ", " + state;
		$("#city").text(parsedInput);
		pastSearches.push(parsedInput);
		printPastSearches();
	});
};

function jambase(){

	var jambaseKey = "&api_key=9jb9b7n5gjuehm3kah3zqe4b&o=json";
	var jambaseQueryUrl = "https://crossorigin.me/http://api.jambase.com/events?";
	var jambaseZipcode = "zipcode=" + userInput;
	var numberPages = 0;
	var jambasePages = "&page=" + numberPages

	var jambaseFullQueryUrl = jambaseQueryUrl + jambaseZipcode + jambasePages + jambaseKey;

	// $.ajax({
	// 	url: jambaseFullQueryUrl,
	// 	method: "GET"
	// })
	// .done(function(response){
	// 	var results = response.Events;
	// 	addMusicEvents(results);
	// 	console.log(response);
	// });
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

		newDateTd.text(date);
		newNameTd.text(name);
		newVenueTd.text(venue);
		newTixTd.text(tix);

		newTr.append(newDateTd, newNameTd, newVenueTd, newTixTd);
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

	var fullQueryZipcode = houseQueryUrl + areaType.zipcode + userInput + housingType.allHomes + format + houseKey;
	var fullQueryCity = houseQueryUrl + areaType.city + cityCode + housingType.medianRent + format + houseKey;

	// $.ajax({
	// 	url: fullQueryCity,
	// 	method: "GET",	
	// })
	// .done(function(response){
	// 	var results = response.dataset.data;
	// 	console.log(results);
	// 	addHomeInfo(results);
	// });
};


function checkInput(userInput){
  	var alphaExp = /^[a-zA-Z ]+$/;
	var numericExpression = /^[0-9]+$/;
	if(userInput.match(alphaExp)){
		getCityCode(userInput);
	} else if(userInput.match(numericExpression)){

	};
};

function getCityCode (userInput) {
	database.ref().child("-KWklNSHU4YBCKzFREu7").once('value').then(function(snapShot){ 
		var inputCityCode = snapShot.val().find(function(cityCode){
			if(cityCode.City === userInput){
				return cityCode;
			}
		});
		cityCode = inputCityCode.Code;
	});
};

// Home info function

function addHomeInfo(results) {
	$("#statsBody").empty();
	for (var i = 0; i < results.length; i++) {
		var newTr = $("<tr>");
		var newDateTd = $("<td>").addClass("mdl-data-table__cell--non-numeric");
		var newPriceTd = $("<td>");
		var price = "$" + results[i][1];
		var date = moment(results[i][0]).format("MMM YYYY");

		newDateTd.text(date);
		newPriceTd.text(price);

		newTr.append(newDateTd, newPriceTd);
		$("#statsBody").append(newTr);
	};
};


// Google Map function

function googleMap () {
	$(".googleMapDiv").empty();
	var mapUrl = "https://maps.googleapis.com/maps/api/staticmap?center=";
	var zoom = "&zoom=14";
	var size = "&size=425x275&scale=1"
	var googleKey = "&key=AIzaSyAau6LZg7LxUiZ0KjzV_srJ3Ko37t7C1f4";
	var fullMapUrl = mapUrl + userInput + zoom + size + googleKey;
	var newMap = $("<img>");

	newMap.attr("src", fullMapUrl);
	newMap.addClass("googleMap");
	$(".googleMapDiv").append(newMap);
};

function printPastSearches(){
	$("#pastSearchesList").empty();
	for (var i = 0; i < pastSearches.length; i++) {
		var button = $("<a>");
		button.addClass("mdl-button mdl-js-button mdl-js-ripple-effect");
		button.text(pastSearches[i]);
		$("#pastSearchesList").append(button);
	}
};


// function initMap() {
//     var uluru = "los+Angeles"
//     var map = new google.maps.map(document.getElementById('googleMapDiv'), {
//       zoom: 2,
//       center: userInput
//     });
//     var marker = new google.maps.Marker({
//       position: uluru,
//       map: map
//     });
//     console.log(uluru);
// };


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
	for (var i = 0; i < results.length; i++) {
		var temp = response.list[i].temp.day * 9/5 - 459.67; //farenheit
		var date = moment.unix(response.list[i].dt).format("MMM Do YYYY");
		var newTr = $("<tr>");
		var newTempTd = $("<td>");
		var newDateTd = $("<td>");

		newTempTd.text(temp);
		newDateTd.text(date);

		$(newTr).append(newTempTd, newDateTd);
		$(".WEATHERclassINFOinsertHEREmatt!!!!!!").append(newTr);
	}
}


// on enter key

$("#citySearch").on("submit", function() {
	$(".mdl-cell--6-col").show();
	$("#search").css("margin-top", "0");
	userInput = $("#location").val().trim();
	autoComplete();
	$("#location").val("");
	checkInput(userInput);
	jambase();
	setTimeout(quandl, 1000);
	googleMap();
	weatherInfo();
	printPastSearches();
	return false;
	// initMap();
});


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
	logOut();
	$("#overlay").show();
	$(".card-wide").show();
	$("#signInButton").hide();
	$("#signOutButton").hide();
	$("#nameDisplay").html("");
});

$("#signInButton").on("click", function(){
	$("#overlay").show();
	$(".card-wide").show();
	$("#signOutButton").hide();
	$("#signInButton").hide();
	$("#nameDisplay").html("");
});

function logDisplay(){
	$("#overlay").hide();
	$(".card-wide").hide();
	$("#email").val("");
	$("#name").val("");
	$("#password").val("");
	$("#signOutButton").show();
};

})(this);