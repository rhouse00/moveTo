// Server Dependencies
const express = require('express');
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');

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

// Morgan initilize and bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Grab public folder and Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("./public"));


// ------------------ Routes -------------------------------

// Main route
app.get('/', (req, res) => {
  res.render('index');
});


// Listener
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
