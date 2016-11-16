(function(){

$(".mdl-cell--6-col").hide();

var userInput = "";
var parsedInput = "";
var zipcode = userInput;

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
	});
};

function jambase(){

	var jambaseKey = "&api_key=9jb9b7n5gjuehm3kah3zqe4b&o=json";
	var jambaseQueryUrl = "https://crossorigin.me/http://api.jambase.com/events?";
	var jambaseZipcode = "zipcode=" + userInput;
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
		console.log(response);
	});
};

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

function quandl(){
	var houseQueryUrl = "https://crossorigin.me/https://www.quandl.com/api/v3/datasets/ZILL/";
	var houseKey = "api_key=y2xh6kV4KLrYCNGRJmSj"
	var numResults = 10; //number
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
	var fullQueryCity = houseQueryUrl + areaType.city + userInput + housingType.medianRent + format + houseKey;

	$.ajax({
		url: fullQueryZipcode,
		method: "GET",	
	})
	.done(function(response){
		var results = response.dataset.data;
		console.log(results);
		addHomeInfo(results);
	});
};

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

function googleMap () {
	$(".googleMapDiv").empty();
	var mapUrl = "https://maps.googleapis.com/maps/api/staticmap?center=";
	var zoom = "&zoom=14";
	var size = "&size=425x275&scale=1"
	var googleKey = "&key=AIzaSyAau6LZg7LxUiZ0KjzV_srJ3Ko37t7C1f4";
	var fullMapUrl = mapUrl + userInput + zoom + size + googleKey;
	var newMap = $("<img>");

	newMap.attr("src", fullMapUrl);
	$(".googleMapDiv").append(newMap);

	console.log(userInput);
	console.log(fullMapUrl);
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
	$("#search").css("margin-top", "-2%");
	userInput = $("#location").val().trim();
	$("#location").val("");
	autoComplete();
	jambase();
	quandl();
	googleMap();
	weatherInfo();
	// initMap();
});

$("#loginButton").on("click", function(){
	$("#overlay").hide();
	$(".card-wide").hide();
});

$("#registerButton").on("click", function(){
	$("#overlay").hide();
	$(".card-wide").hide();
});


})(this);