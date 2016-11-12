(function(){


// Google Maps API Key = AIzaSyCXUJGafVbCwieSLcNI2KUw-gkJ-eh0ig0

//<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
var zipcode = 95128;

var jambaseKey = "&api_key=9jb9b7n5gjuehm3kah3zqe4b&o=json";
var jambaseQueryUrl = "http://api.jambase.com/events?";
var jambaseZipcode = "zipCode=" + zipcode;
var numberPages = 1;
var jambasePages = "&page=" + numberPages

var jambaseFullQueryUrl = jambaseQueryUrl + jambaseZipcode + jambasePages + jambaseKey;

$.ajax({
	url: jambaseFullQueryUrl,
	method: "GET"
})
.done(function(response){
	console.log(response);
	
});


var houseQueryUrl = "https://www.quandl.com/api/v3/datasets/ZILL/";
var houseKey = "api_key=y2xh6kV4KLrYCNGRJmSj"
var numResults = 10; //number
var addLimit = "limit=" + numResults;

var city = 10001;
var format = ".json?"

var areaType = {
	state: "S",
	county: "CO",
	metropolitan: "M",
	neighborhood: "H",
	city: "C",
	zipcode: "Z"
};

var housingType = {
	allHomes: "_A",
	singleFamily: "_SF",
	medianRent: "_RMP",
	medianListPrice: "_MLP",
	medianSalePrice: "_MSP",

};

var fullQueryZipcode = houseQueryUrl + areaType.zipcode + zipcode + housingType.medianRent + format + houseKey;
var fullQueryCity = houseQueryUrl + areaType.city + city + housingType.medianRent + format + houseKey;



$.ajax({
	url: fullQueryZipcode,
	method: "GET",
	
})
.done(function(response){
	// var results = response.dataset.data;
	console.log(response);
	// console.log(results[0][1]); //first # is for the month, the lower the # the more recent. second # is the date (0) or Price (1)
	
});

function addHomeInfo(response) {
		
};









})(this);