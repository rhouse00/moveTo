# [MoveTo](http://moveto.herokuapp.com) - UCLA Coding Bootcamp Project 1

MoveTo was created by [Andrey Orlov](https://github.com/andreyorlov33), [Matt Whitcomb](https://github.com/mwhitcom), and [Ryan House](https://github.com/rhouse00) as their first project for the UCLA Coding Bootcamp.


## Objective 
MoveTo is a website that will efficiently provide a quick snapshot of a location you may be interested in moving to. MoveTo provides an overview of weather, average rent, and music to see in a select city. 


## Project Requirements
The project requirements listed below were provided by the project markdown:

* Must use at least two APIs
* Must use AJAX to pull data
* Must utilize at least one new library or technology that we haven’t discussed
* Must have a polished frontend / UI 
* Must meet good quality coding standards (indentation, scoping, naming)
* Must NOT use alerts, confirms, or prompts (look into modals!)
* Must have some sort of repeating element (table, columns, etc)
* Must use Bootstrap or Alternative CSS Framework
* Must be Deployed (Heroku or Firebase)
* Must have User Input Validation 
* Utilize Firebase for Persistent Data Storage (Consider this basically a requirement).
* Mobile Responsive
* Use an alternative CSS framework like Materialize


## MVP

* User login
* User is able to search a city
* Web app returns map of city, weather, music events, and average rent
* Searches are stored in db so user can easily click the city to search again


## Technologies Used

* JavaScript
* jQuery
* Node.js
* Express.js
* Firebase
* HTML5
* CSS3
* Material Design Lite
* Google Charts Library
* Google Places API
* Google Map API
* Quandl API
* Zipcode API
* Jambase API
* OpenWeather API 


## Approach Taken

Each of us in the group have moved around a great deal. To scope out what a city is like before we visit usually involves a lot of google searching that takes a while. We wrote a throrough proposal and presented it to our instructors after careful research on technologies that we could use.

Then we started Trello board to keep track of tasks and then seperated the project into 3 main areas: UI/UX, API implementation, and Authentication (using Firebase). Each us us picked a section and took charge of that code, and then all worked together on merging it together into a coehsive, efficient web app.


## Roadblocks

The largest roadblock was getting 5 APIs to work togther, as some of the query info for one would depend on the other. Implementating authentication was also a big undertaking, but luckily Firebase is very intuitive. 


## Future Implementations

* When a user signs up for the service, they will preferences (types of music, things they like to do) that will help cater each search to the specific user
* Grow the info that is displayed (schools, museums, etc.)
* Update the UI/UX using React.js to help deal with the large amounts of changing data.