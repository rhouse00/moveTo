// Server Dependencies
const express = require('express'),
      bodyParser = require('body-parser'),
      exphbs = require('express-handlebars'), 
      methodOverride = require('method-override'),
      firebase = require("firebase");
// Express Instance

const app = express();

// Set Port
const PORT = process.env.PORT || 3000;

let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);

app.use(express.static("./public"));



// ------------------ Routes -------------------------------

// Main route
app.get("/", (req, res) => {
  res.render('index')
});

// Listener
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
