(function(){
	//initialize FireBase
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


    $(document).on("click", "#logIn" , loginFunction);

    $(document).on("click", "#register" , register);

    $(document).on("click", "#logOut" , logOut);


    function loginFunction(){
    	email = $("#email").val();
    	password = $("#Password").val();

    	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(firebaseUser) {  
  	            if (firebaseUser) {
     	 var id =  firebaseUser.uid;	
  	    		database.ref(id).push({userID: id})
    } else {
      console.log("No user!")
      console.log(firebase.auth())
    }
});
    }

    function register(event){
    	event.preventDefault();
    	email = $("#email").val();
    	password = $("#Password").val();
    	name = $("#name").val();
    	console.log("imhere")
    	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(firebaseUser) {
    	console.log("im there")
       if (firebaseUser) {
     	 var id =  firebaseUser.uid;
     	 database.ref(id).push({userID: id})
     	 database.ref(id).set({username:name})
    } else {
      console.log("No user!")
     
    }
 	    
});
    }

 // firebase.auth().onAuthStateChanged(function(firebaseUser) {
 //         console.log("hellow orld")
 //         if (firebaseUser) {
 //     	 var id =  firebaseUser.uid;	
 //  	    		database.ref(id).set({userID: id})
 //    } else {
 //      console.log("No user!")
 //      // console.log(firebase.auth())
 //    }
 //  });
   
function logOut(){
	firebase.auth().signOut();
}
}());


