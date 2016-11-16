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
var zipcode = 90028;

function jambase(){

	var jambaseKey = "&api_key=9jb9b7n5gjuehm3kah3zqe4b&o=json";
	var jambaseQueryUrl = "https://crossorigin.me/http://api.jambase.com/events?";
	var jambaseZipcode = "zipCode=" + zipcode;
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

function addMusicEvents(results) {
	for(var i = 0; i < results.length; i++) {
		var newTr = $("<tr>");
		var newDateTd = $("<td>").addClass("mdl-data-table__cell--non-numeric");
		var newNameTd = $("<td>");
		var newVenueTd = $("<td>");
		var newTixTd = $("<td>");
		var date = moment(results[i].Date).format("MMM YYYY");
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

	console.log(fullQueryZipcode);

	$.ajax({
		url: fullQueryZipcode,
		method: "GET",	
	})
	.done(function(response){
		var results = response.dataset.data;
		addHomeInfo(results);
	});
};

function addHomeInfo(results) {
	
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


// on enter key

$("#citySearch").on("submit", function() {
	$(".mdl-cell--6-col").show();
	$("#search").css("margin-top", "-2%");
	userInput = $("#location").val().trim();
	$("#location").val("");
	autoComplete();
	jambase();
	quandl();
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