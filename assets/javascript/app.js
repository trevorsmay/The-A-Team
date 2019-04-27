// Homework #8
// Team #4
// 4/24/2019
// Project #1 - Pack  Your Bags
// 
// Key new functionality:
// 
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
            var day = "Day" + i;
            var whereAmI = "SomeWhere" + i;
            var howTravel = "PlanetrainBus" + i;
            var whatToDo = "Something" + i;
            var contact = "Contact" + i;
            var newDate = thisDate.format("X");

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

        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(day),
            $("<td>").text(newDate),
            $("<td>").text(whereAmI),
            $("<td>").text(howTravel),
            $("<td>").text(whatToDo),
            $("<td>").text(contact)
        );

        // Put day key on row
        newRow.attr("data-index", day);
        // console.log(newRow.attr("data-index"));
        // console.log(newRow);

        // Append the new row to the table
        $("#itinerary-table > tbody").append(newRow);
    });

    // Handle clicks on itinerary 
    // Use delegate function to get row clicked on
    // http://api.jquery.com/delegate/
    $("#itinerary-table tbody").delegate("tr", "click", function (e) {

        console.log("Click on table");
        console.log($(this));

        // Get data-index attribute to get day of itinerary
        var index = $(this).attr("data-index");
        console.log("Row number = " + index);

    });

    // Grab text from destination and connect to flight API
    var destination =  $("#destination-input").val();
    console.log(destination);
    

});