// Homework #8
// Team #4
// 4/24/2019
// Project #1 - Pack  Your Bags
// 
// Key new functionality:
// 4/27/2019
//   Added row selection from itinerary table
//   Got data for particular row and put on itinerary day update view
//   On update btn click, updated firebaase with modfied itinerary for selected day.
// ToDo

// Wait for document to finish loading
$(document).ready(function () {

    // Define global variables
    var userRef = null;
    var itinRef = null;

    // Initialize Firebase - user aand itinerary
    var config = {
        apiKey: "AIzaSyDrMiR3_zjAuyVfWTilJ6Xu9ZMpelhzLd8",
        authDomain: "pvraab-packbags.firebaseapp.com",
        databaseURL: "https://pvraab-packbags.firebaseio.com",
        projectId: "pvraab-packbags",
        storageBucket: "pvraab-packbags.appspot.com",
        messagingSenderId: "414747253725"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    // Set references to user and itinerary database children
    userRef = database.ref("/user");
    itinRef = database.ref("/itinerary");

    // Add or update user on #add-user-btn button click
    $("#add-user-btn").on("click", function (event) {

        // Prevent default form action
        event.preventDefault();

        // Grabs user input from form
        var user = $("#user-input").val().trim();
        var location = $("#location-input").val().trim();
        var destination = $("#destination-input").val().trim();

        // Convert dates to unix seconds
        var startDate = moment($("#start-input").val().trim(), "MM/DD/YYYY").format("X");
        var endDate = moment($("#end-input").val().trim(), "MM/DD/YYYY").format("X");

        // Creates local "temporary" object for holding user data
        var newUser = {
            user: user,
            location: location,
            destination: destination,
            startDate: startDate,
            endDate: endDate
        };

        // Use set instead of push so there is only one
        userRef.set(newUser);

        // Logs everything to console
        console.log(newUser);

    });

    // On value event get a user snapshot
    // from the databaase. Then use that object to 
    // create a user on the screen.
    userRef.on("value", function (snapshot) {

        // Store everything into a variable.
        var user = snapshot.val().user;
        var location = snapshot.val().location;
        var destination = snapshot.val().destination;
        var startDate = moment(snapshot.val().startDate, "X").format("MM/DD/YYYY");
        var endDate = moment(snapshot.val().endDate, "X").format("MM/DD/YYYY");

        // Update screen
        $("#user-input").val(user);
        $("#location-input").val(location);
        $("#destination-input").val(destination);
        $("#start-input").val(startDate);
        $("#end-input").val(endDate);

    });

    // Add itinerary on #add-user-btn button click
    $("#add-itinerary-btn").on("click", function (event) {

        // Prevent default form action
        event.preventDefault();

        // Get the user reference
        var ref = database.ref("user");
        ref.on("value", createItinerary);

    });

    // Create a new itinerary and store it in the database
    function createItinerary(data) {

        // Empty table
        // https://stackoverflow.com/questions/370013/jquery-delete-all-table-rows-except-first
        $("#itinerary-table").find("tr:gt(0)").remove();

        // Empty database itinerary
        var ref = database.ref("itinerary");
        ref.set(null);

        // Store everything into a variable.
        var user = data.val().user;
        var location = data.val().location;
        var destination = data.val().destination;
        var startDate = moment(data.val().startDate, "X");
        var endDate = moment(data.val().endDate, "X");
        var numberOfDays = endDate.diff(startDate, "days") + 1;
        var thisDate = startDate;

        // Create number of days rows in itinerary and store in databasae
        for (var i = 1; i <= numberOfDays; i++) {

            // Create data
            // Put some HTML examples in  first row
            if (parseInt(i) === 1) {
                var day = "Day" + i;
                var whereAmI = '<a href="https://www.guoman.com/en/london/the-cumberland.html">The Cumberland Hotel</a>';
                var howTravel = '<a href="https://www.google.com/flights?lite=0#flt=DEN./m/04jpl.2019-05-26*/m/04jpl.DEN.2019-06-10;c:USD;e:1;a:VS*VS;sd:1;t:f">Denver to London</a>';
                var whatToDo = '<a href="https://www.hrp.org.uk/tower-of-london/">Tower of London</a>';
                var contact = '<img src="./assets/images/bean.jpg" width="50" height="50">';
                var newDate = thisDate.format("X");
            }

            // Dummy data - take this out later
            else {
                var day = "Day" + i;
                var whereAmI = "SomeWhere" + i;
                var howTravel = "PlanetrainBus" + i;
                var whatToDo = "Something" + i;
                var contact = "Contact" + i;
                var newDate = thisDate.format("X");
            }

            // Creates local "temporary" object for holding itinerary data
            var newItineraryDay = {
                day: day,
                thisDate: newDate,
                whereAmI: whereAmI,
                howTravel: howTravel,
                whatToDo: whatToDo,
                contact: contact
            };

            // Use push instead of set to create rows
            itinRef.push(newItineraryDay);

            thisDate = thisDate.add(parseInt(1), "day");

        }
    }

    // On child_added event get an itinerary childSnapshot
    // from the databaase. Then use that object to 
    // create a row in the #itineraryTable.
    itinRef.on("child_added", function (childSnapshot) {

        // console.logconsole.log("Trip ref on child added");
        // console.log(childSnapshot.val());

        // Grab the key to iterate over the object
        // console.log("Key " + childSnapshot.key);

        // Store everything into a variable.
        var day = childSnapshot.val().day;
        var thisDate = childSnapshot.val().thisDate;
        var newDate = moment(thisDate, "X").format("MM/DD/YYYY");
        var whereAmI = childSnapshot.val().whereAmI;
        var howTravel = childSnapshot.val().howTravel;
        var whatToDo = childSnapshot.val().whatToDo;
        var contact = childSnapshot.val().contact;

        // Prettify the start/end dates
        // var tripStartPretty = moment.unix(thisDate).format("MM/DD/YYYY");

        // Create the new row - note I have switched to using html()
        // instead of text() to make the HTML and IMG tags live. 
        var newRow = $("<tr>").append(
            $("<td>").html(day),
            $("<td>").html(newDate),
            $("<td>").html(whereAmI),
            $("<td>").html(howTravel),
            $("<td>").html(whatToDo),
            $("<td>").html(contact)
        );

        // Put day key on row
        newRow.attr("data-index", day);
        // console.log(newRow.attr("data-index"));
        // console.log(newRow);

        // Append the new row to the table
        $("#itinerary-table > tbody").append(newRow);
    });

    var currentRow = null;
    var currentKey = null;
    var itineraryIndex = null;
    var currentDay = null;
    var currentDate = null;
    var currentWhereAmI = null;
    var currentHowTravel = null;
    var currentWhatToDo = null;
    var currentContact = null;

    // Handle clicks on itinerary 
    // Use delegate function to get row clicked on
    // Populate single day update screen
    // http://api.jquery.com/delegate/
    $("#itinerary-table tbody").delegate("tr", "click", function (e) {

        console.log("Click on table");
        console.log($(this));

        // Save row
        currentRow = $(this)[0];

        // Get data-index attribute to get day of itinerary
        itineraryIndex = $(this).attr("data-index");
        console.log("Row number = " + itineraryIndex);

        // Get the row from the DB
        itinRef.orderByChild("day").equalTo(itineraryIndex).on("child_added", function (snapshot) {
            console.log(snapshot.key + " was " + snapshot.val().day + " day");

            // Save row key
            currentKey = snapshot.key;

            currentDay = snapshot.val().day;
            currentDate = snapshot.val().date;
            currentWhereAmI = snapshot.val().whereAmI;
            currentHowTravel = snapshot.val().howTravel;
            currentWhatToDo = snapshot.val().whatToDo;
            currentContact = snapshot.val().contact;

            // Update screen
            $("#where-input").val(currentWhereAmI);
            $("#travel-input").val(currentHowTravel);
            $("#todo-input").val(currentWhatToDo);
            $("#contact-input").val(currentContact);

        });

    });

    // Update itinerary on #update-user-btn button click
    $("#update-itinerary-btn").on("click", function (event) {

        console.log("Update itinerary");

        // Prevent default form action
        event.preventDefault();

        // Create data
        var day = currentDay;
        var thisDate = currentDate;
        var whereAmI = $("#where-input").val();
        var howTravel = $("#travel-input").val();
        var whatToDo = $("#todo-input").val();
        var contact = $("#contact-input").val();

        // Update
        database.ref("itinerary/" + currentKey + "/whereAmI").set(whereAmI);
        database.ref("itinerary/" + currentKey + "/howTravel").set(howTravel);
        database.ref("itinerary/" + currentKey + "/whatToDo").set(whatToDo);
        database.ref("itinerary/" + currentKey + "/contact").set(contact);

        // Get the row from the DB
        itinRef.orderByChild("day").equalTo(itineraryIndex).on("child_added", function (snapshot) {

            // Update screen
            $("#where-input").val(snapshot.val().whereAmI);
            $("#travel-input").val(snapshot.val().howTravel);
            $("#todo-input").val(snapshot.val().whatToDo);
            $("#contact-input").val(snapshot.val().contact);

        });

        // Update the row - note that using the innerHTML
        // I can put a link such as <a href="https://www.msn.com/">MSN</a>
        // inside a cell and have it work.
        console.log(currentRow.cells);
        currentRow.cells[2].innerHTML = whereAmI;
        currentRow.cells[3].innerHTML = howTravel;
        currentRow.cells[4].innerHTML = whatToDo;
        currentRow.cells[5].innerHTML = contact;

    });



    $("#getCountryInfo").on("click", function () {
        // Grab text from destination and connect to flight API
        var destination = $("#destination-input").val();
        console.log(destination);
   

    // Get api to grab country 

    // Country info click handler
   

        // Here we are building the URL we need to query the database
        var queryURL = "https://www.state.gov/api/v1/?command=get_country_fact_sheets&fields=title,terms,full_html&terms=" + destination + "";

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            // We store all of the retrieved data inside of an object called "response"
            .then(function (response) {

                $("#modalText").html(response.country_fact_sheets[0].full_html);
                $("#moreInfoModalTitle").text("Country Info");

            });
    });

    $("#getWeather").on("click", function () {
        // Grab text from destination and connect to flight API
        var destination = $("#destination-input").val();
        console.log(destination);

        APIKey = "eb8931f9eac8bb60eb3936fa07a6e242";


        var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + destination +"&units=imperial&appid=" + APIKey;

        //  queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
        // "q=Bujumbura,Burundi&units=imperial&appid=" + APIKey;
  

         // Here we run our AJAX call to the OpenWeatherMap API
         $.ajax({
            url: queryURL,
            method: "GET"
        })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {
            console.log(response);

          $("#modalText").html("Name = "+ response.name +"<br>"+ "Wind = " + response.wind.speed + "<br>" + "Humidity = " + response.main.humidity + "<br>" + "Temperature =" + response.main.temp);
            $("#moreInfoModalTitle").text("Weather");

        });
});
      
   
   


});