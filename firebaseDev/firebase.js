(function(){
	//initialize FireBase 

	$(document).on("click", "#logIn" , loginFunction);

    $(document).on("click", "#register" , register);

    $(document).on("click", "#logOut" , logOut);

	 var config = {
    apiKey: "AIzaSyBYWTeOhT42zgZZnA21IcyAQ10pNAtQaWs",
    authDomain: "angulardev-699fa.firebaseapp.com",
    databaseURL: "https://angulardev-699fa.firebaseio.com",
    storageBucket: "angulardev-699fa.appspot.com",
    messagingSenderId: "527207620597"
  };

  firebase.initializeApp(config);
   var database = firebase.database();

   var name, email, password;
   var addresses = ["17800 ucla street", "56st SE Portland OR 999999", "5679 DERP! street LA 91406"];
   var music = ["blink 182" , "eminem" , "what ever kids listen to now days"];
   var favorites = ["favorite address here", "another favorite address"];
   var pastSearches = [];

   

    function loginFunction(){
    	email = $("#email").val();
    	password = $("#Password").val();

    	firebase.auth().signInWithEmailAndPassword(email, password).then(function(firebaseUser) {  
  	            if (firebaseUser) {
     	 			var id =  firebaseUser.uid;	
  	    			database.ref(id).once('value').then(function(snapShot){ 
  	    				var citiesU = snapShot.child("cities").val();
  	    				pastSearches= citiesU;
  	    				console.log(pastSearches)
  	    			});
      			}
   		})
    }

    function register(event){
    	event.preventDefault();
    	email = $("#email").val();
    	password = $("#Password").val();
    	name = $("#name").val();
    	
    	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(firebaseUser) {
    	
      	 if (firebaseUser) {

     	 	var id =  firebaseUser.uid;
     	 		database.ref(id).set({userID: id, username:name})
     	 		database.ref(id).child("addresses").set(addresses);
     	 		database.ref(id).child("music").set(music);
     	 		database.ref(id).child("favorites").set(favorites);
  		 } else {
     		 console.log("No user!")
     	 }
 	    
		});
    }


function logOut(firebaseUser){
	console.log(firebaseUser.uid);
	if(firebaseUser == false) return;
	firebase.auth().signOut().then(function(firebaseUser) {
    	
      	 if (firebaseUser) {

     	 	var id =  firebaseUser.uid;
     	 		database.ref(id).set({userID: id, username:name})
     	 		database.ref(id).child("addresses").set(addresses);
     	 		database.ref(id).child("music").set(music);
     	 		database.ref(id).child("favorites").set(favorites);
  		 } else {
     		 console.log("No user!")
     	 }
 	    
		});
}
}());



		
