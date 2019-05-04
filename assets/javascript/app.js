// Homework #8
// Team #4
// 4/24/2019
// Project #1 - Pack  Your Bags
// 
// Key new functionality:
// 4/27/2019
//   Added row selection from itinerary table
//   Got data for particular row and put on itinerary day update view
//   On update btn click, updated firebase with modfied itinerary for selected day.
// ToDo

// Wait for document to finish loading
$(document).ready(function () {

    // Define global variables
    var userRef = null;
    var itinRef = null;
    var currencyRate = null;
    var fromRate = null;
    var toRate = null;

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
    // and create a new itinerary
    $("#add-user-btn").on("click", function (event) {

        // Prevent default form action
        event.preventDefault();

        // Grabs user input from form
        var user = $("#user-input").val().trim();
        var location = $("#location-input").val().trim();
        var destination = $("#destination-input").val().trim();

        // Convert dates to unix seconds
        var startDate = moment($("#start-input").val().trim(), "YYYY-MM-DD").format("X");
        var endDate = moment($("#end-input").val().trim(), "YYYY-MM-DD").format("X");

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

        // Get the user reference
        createItinerary();

        reload_page();

    });

    // On value event get a user snapshot
    // from the databaase. Then use that object to 
    // create a user on the screen.
    userRef.on("value", function (snapshot) {

        // Store everything into a variable.
        var user = snapshot.val().user;
        var location = snapshot.val().location;
        var destination = snapshot.val().destination;
        var startDate = moment(snapshot.val().startDate, "X").format("YYYY-MM-DD");
        var endDate = moment(snapshot.val().endDate, "X").format("YYYY-MM-DD");

        // Update screen
        $("#user-input").val(user);
        $("#location-input").val(location);
        $("#destination-input").val(destination);
        $("#start-input").val(startDate);
        $("#end-input").val(endDate);

    });

    // Create a new itinerary and store it in the database
    function createItinerary() {

        // Empty table
        // https://stackoverflow.com/questions/370013/jquery-delete-all-table-rows-except-first
        $("#itinerary-table").find("tr:gt(0)").remove();

        // Empty database itinerary
        var ref = database.ref("itinerary");
        ref.set(null);

        // Store everything into a variable.
        // Grabs user input from form
        var user = $("#user-input").val().trim();
        var location = $("#location-input").val().trim();
        var destination = $("#destination-input").val().trim();

        // Convert dates to unix seconds
        var startDate = moment($("#start-input").val().trim(), "YYYY-MM-DD");
        var endDate = moment($("#end-input").val().trim(), "YYYY-MM-DD");

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
        var newDate = moment(thisDate, "X").format("YYYY-MM-DD");
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

    // Handle clicks on itinerary table
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

        console.log("Update itinerary from btn");
        updateItinerary();

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
    
    // Reload page
    function reload_page() {
        window.location.reload();
    }

    // Update the itinerary table view after a DB change - all except add
    function updateItinerary() {

        console.log("Update itinerary");

        // Empty table except for header row
        // https://stackoverflow.com/questions/370013/jquery-delete-all-table-rows-except-first
        $("#itinerary-table").find("tr:gt(0)").remove();

        // Loop through the current itinerary data and
        // create new rows in the table
        itinRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                console.log(childKey);
                console.log(childData);

                // Store everything into a variable.
                var day = childSnapshot.val().day;
                var thisDate = childSnapshot.val().thisDate;
                var newDate = moment(thisDate, "X").format("MM/DD/YYYY");
                var whereAmI = childSnapshot.val().whereAmI;
                var howTravel = childSnapshot.val().howTravel;
                var whatToDo = childSnapshot.val().whatToDo;
                var contact = childSnapshot.val().contact;

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

                // Append the new row to the table
                $("#itinerary-table > tbody").append(newRow);

            });
        });
    }

    // On an itinerary DB child_removed event, update the itinerary table.
    itinRef.on("child_removed", function (childSnapshot) {

        console.log("Itin Ref On Child Removed");
        console.log(childSnapshot.val().day);
        console.log(childSnapshot.val().key);
        console.log("Update itinerary from Remove");
        updateItinerary();

    });

    // On an itinerary DB child_changed event, update the itinerary table.
    itinRef.on("child_changed", function (childSnapshot) {

        console.log("Itin Ref On Child Changed");
        console.log(childSnapshot.val().day);
        console.log(childSnapshot.key);
        console.log("Update itinerary from Update");
        updateItinerary();

    });

    // Currency exchange button click handler
    // https://exchangeratesapi.io/
    // https://fixer.io/quickstart
    $('#getCurrencyExchange').on("click", function () {
        // console.log("Currency");

        $("#fromMenu").empty();
        $("#toMenu").empty();
        var currency = [];
        var rate = [];

        // Get everything
        // Here we are building the URL we need to query the database for just the USD
        // Originally used this API - GitGub would not let us use it since our
        // supscription doesn't allow https access for free.
        // This is our API key
        // var APIKey = "2363396842cbd6f647b46f205c08efff";
        // var queryURL = "https://data.fixer.io/api/latest?access_key=2363396842cbd6f647b46f205c08efff&format=1";
        var queryURL = "https://api.exchangeratesapi.io/latest";

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            // We store all of the retrieved data inside of an object called "response"
            .then(function (response) {

                // Get the JSON object
                var jsonString = JSON.stringify(response);
                var jsonObj = JSON.parse(jsonString);

                // Get the rates child and fill the currency code array and
                // the rate array
                var x, i;
                var rates = jsonObj.rates;

                // Push USD on top
                currency.push("USD");
                rate.push(parseFloat(rates.USD));

                // Push Euro on top as well
                currency.push("EUR");
                rate.push(parseFloat(1));

                for (x in rates) {
                    var code = x.split(" ");
                    // console.log(code[0]);
                    currency.push(code[0]);
                }
                for (i in rates) {
                    rate.push(parseFloat(rates[i]));
                }

                // Load up the currency modal dropdown
                currency.forEach(function (elem, i) {

                    var newMenuItemFrom = $("<button>");
                    newMenuItemFrom.addClass("dropdown-item");
                    // if (i === 0) {
                    //     console.log("In add button");
                    //     console.log(currency[i]);
                    // }
                    newMenuItemFrom.text(currency[i]);
                    newMenuItemFrom.attr("type", "button");
                    newMenuItemFrom.attr("id", "button" + i);
                    newMenuItemFrom.attr("data-index", i);
                    newMenuItemFrom.attr("data-rate", rate[i]);
                    newMenuItemFrom.val(elem + " " + rate[i]);

                    $("#fromMenu").append(newMenuItemFrom);

                    var newMenuItemTo = $("<button>");
                    newMenuItemTo.addClass("dropdown-item");
                    newMenuItemTo.text(currency[i]);
                    newMenuItemTo.attr("type", "button");
                    newMenuItemTo.attr("id", "button" + i);
                    newMenuItemTo.attr("data-index", i);
                    newMenuItemTo.attr("data-rate", rate[i]);
                    newMenuItemTo.val(elem + " " + rate[i]);

                    $("#toMenu").append(newMenuItemTo);
                });

            });
    });

    $("#fromMenu").on("click", ".dropdown-item", function () {
        // console.log("From Btn");
        // console.log($(this));
        // console.log($(this).attr("id"));
        // console.log($(this).attr("data-index"));
        // console.log($(this).attr("data-rate"));
        fromRate = parseFloat($(this).attr("data-rate"));
        $("#from-code").val($(this).val());
    })
    $("#toMenu").on("click", ".dropdown-item", function () {
        // console.log("To Btn");
        // console.log($(this));
        // console.log($(this).attr("id"));
        // console.log($(this).attr("data-index"));
        // console.log($(this).attr("data-rate"));
        $("#to-code").val($(this).val());
        toRate = parseFloat($(this).attr("data-rate"));
    })
    $("#compute-btn").on("click", function () {
        currencyRate = parseFloat(toRate) / parseFloat(fromRate);
        $("#conversion-val").val(currencyRate);
        var fromVal = $("#from-val").val();
        fromVal = parseFloat(fromVal);
        var toVal = fromVal * currencyRate;
        $("#to-val").val(toVal);
        $("#conversion-val").val(currencyRate);
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


        var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + destination + "&units=imperial&appid=" + APIKey;

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

                $("#modalText").html("Name = " + response.name + "<br>" + "Wind = " + response.wind.speed + "<br>" + "Humidity = " + response.main.humidity + "<br>" + "Temperature =" + response.main.temp);
                $("#moreInfoModalTitle").text("Weather");

            });
    });

    // Grab text from destination and connect to flight API
    //  var destination = $("#destination-input").val();
    // console.log(destination);

    $("#getFlights").on("click", function () {

        //var destination =$("#destination-input").val();

        var queryURL = "https://api.skypicker.com/flights?flyFrom=DEN&to=LGW&dateFrom=08/07/2019&dateTo=08/07/2019&partner=picky"
        //var queryURL= "https://api.skypicker.com/flights?flyFrom=DEN&to=LGW&dateFrom=05/10/2020&dateTo=05/17/2020&partner=picky";
        // var queryURL = "https://api.skypicker.com/flights?flyFrom=" + location + "&to=" + destination + "&dateFrom=&dateTo=&partner=picky&one_per_city=1";

        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function (response) {
            console.log(response);

            // Response is an object - must be converted to HTML for this too work
            // $("#modalText").html(response);

            // Using JSON.stringify and JSON.parse to get a text string
            // which will look good in the modal
            // Put it inside a <pre> tag will retain the JSON formatting
            var results = response.data;
            var jsonString = JSON.stringify(results);
            var jsonPretty = JSON.stringify(JSON.parse(jsonString), null, 2);
            console.log(jsonPretty);

            var preElem = $("<pre>");
            preElem.html(jsonPretty);
            $("#modalText").html(preElem);

            // Using JSON.stringify and JSON.parse to get the
            // JSON as an Object so we can work with the data
            var jsonString = JSON.stringify(response);
            var jsonObj = JSON.parse(jsonString);

            // Get the data child and extract the deep_link
            // and other info
            var i;
            var data = jsonObj.data;
            var outString = "";
            for (i in data) {

                // Convert departure/arrival date/time in  Unix seconds to 
                // date/time as "MM/DD/YYYY HH:mm"
                var departureDate = moment(data[i].dTime, "X").format("MM/DD/YYYY HH:mm");
                var arrivalDate = moment(data[i].aTime, "X").format("MM/DD/YYYY HH:mm");

                outString = outString + "<a href=\"" + data[i].deep_link + "\">" + 
                  data[i].flyFrom + " - " + data[i].flyTo + "- Dep - " + departureDate + "Arr - " + arrivalDate + "</a><br>";
            }

            $("#modalText").html(outString);

            //will response return every flight possible?
            $("#moreInfoModalTitle").text("Flight Information");
        });
    });
});
