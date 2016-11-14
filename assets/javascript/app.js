(function(){

$(".mdl-cell--6-col").hide();

var userInput = "";
var parsedInput = "";

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

// Google Maps API Key = AIzaSyCXUJGafVbCwieSLcNI2KUw-gkJ-eh0ig0

//<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
var zipcode = 90210;

var jambaseKey = "&api_key=9jb9b7n5gjuehm3kah3zqe4b&o=json";
var jambaseQueryUrl = "http://api.jambase.com/events?";
var jambaseZipcode = "zipCode=" + zipcode;
var numberPages = 0;
var jambasePages = "&page=" + numberPages

var jambaseFullQueryUrl = jambaseQueryUrl + jambaseZipcode + jambasePages + jambaseKey;

function addMusicEvents(results) {
	for(var i = 0; i < results.length; i++) {
		var newTr = $("<tr>");
		var newDateTd = $("<td>");
		var newNameTd = $("<td>");
		var newVenueTd = $("<td>");
		var newTixTd = $("<td>");
		var date = moment(results[0].Date).format("MMM YYYY");
		var name = results[0].Artists[0].Name;
		var venue = results[0].Venue.Name;
		var tix = results[0].TicketUrl;

		newDateTd.text(date);
		newNameTd.text(name);
		newVenueTd.text(venue);
		newTixTd.text(tix);

		newTr.append(newDateTd, newNameTd, newVenueTd, newTixTd);
			// Now the newTr needs to be added into the HTML
		$("XXXX").append(newTr)
	}
};

$.ajax({
	url: jambaseFullQueryUrl,
	method: "GET"
})
.done(function(response){
	var results = response.Events;
	addMusicEvents(results);
});






var houseQueryUrl = "https://www.quandl.com/api/v3/datasets/ZILL/";
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

var fullQueryZipcode = houseQueryUrl + areaType.zipcode + zipcode + housingType.medianRent + format + houseKey;
var fullQueryCity = houseQueryUrl + areaType.city + city + housingType.medianRent + format + houseKey;

$.ajax({
	url: fullQueryZipcode,
	method: "GET",	
})
.done(function(response){
	var results = response.dataset.data;
	addHomeInfo(results);
});

function addHomeInfo(results) {
	
	for (var i = 0; i < results.length; i++) {
		var newTr = $("<tr>");
		var newDateTd = $("<td>");
		var newPriceTd = $("<td>");
		var newTable = $("<table>");
		var newTBody = $("<tbody>")
		var price = results[0][1];
		var date = moment(results[0][0]).format("MMM YYYY");

		newDateTd.text(date);
		newPriceTd.text(price);

		newTr.append(newDateTd, newPriceTd);

			// Now the newTr needs to be added into the HTML
		$("XXXXX").append(newTable);
	};
};




// on enter key

$("#citySearch").on("submit", function() {
	$(".mdl-cell--6-col").show();
	$("#search").css("margin-top", "-2%");
	userInput = $("#location").val().trim();
	$("#location").val("");
	autoComplete();
});

$("#loginButton").on("click", function(){
	$("#overlay").hide();
	$(".card-wide").hide();
});



})(this);