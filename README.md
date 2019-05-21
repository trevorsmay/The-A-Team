# The-A-Team

## Project Title - Pack Your Bags

May 4, 2019

### Project Team - Team #4

1. Serena Brown
2. Trevor May
3. Zac Portillos
4. Paul Raab

### Minimum Viable Product - MVP

- Our target audience is everyone in the world who travels.
- Our product will address the problem of having your travel itinerary scattered among many different sources - transportation, lodging, sightseeing, contact info. Our application will bring all this information into one consolidated easy to access application organized as a daily trip itinerary.
- As a user I want to create a trip itinerary that I can edit, delete, save, and send out to friends.
- I will use APIs to get travel info, weather, flights, currency exchange, and other travel related data related to my trip. I will then organize and store this information in an easy to use form on a day by day basis.
- Make it look and act cool.

### Description

The Pack Your Bags application will allow a user to login to the main application, enter user and trip information including user name, from location and to destination, and trip start and end dates. The application will then create a daily itinerary table for the user to populate. The user/trip/itinerary information are stored in a Firebase database.  Web APIs are used to collect and display information about the country being visited, the flights available, the weather at the travel destination, and a currency exchange calculator.

### Motivation

This application will provide an easy to use travel itinerary manager. The user will be able to create, edit, and save their itinerary for future use.

### Result

The application developed for this project met the MVP requirements and will provide a sound foundation for future deveopment.

### Team Efforts

The team worked together to develop the project focus and scope. We worked through several possible implementations and selected a MVP that seemed doable. As a team, we tried to do major commits to the repository when everyone was in the same room so we could resolve conflicts. Everyone contributed to the project and to the team presentation.

### Individual Responsibilities

Serena developed the landing/splash page with a slideshow background of cool travel locations and the login template. Trevor and Zac worked on the APIs, JavaScript, and the application look and feel. Trevor implemented the date widget to select and validate start/end travel dates in the form. Paul worked on the Firebase database connection and JavaScript.

### Challenges

The biggest challenge was merging the different individual efforts into the application repository. We had a number of merge conflicts which were resolved by the group working as a team. Some of the APIs we initially worked with did not prove successful. We continued searching until we found APIs that worked. Some APIs worked on our local machines but did not work on GitHub due to GitHub policies (for example requiring a https connection).

### Improvements

- Add multiple users/trips functionality.
- Add new APIs for activities, hotels, and other travel related information.
- Store historical trips/itineraries.
- Share itineraries.
- Administrator functionality to see all users/trips/itineraries - useful for a company that needs to see all employee trips.
- Use Firebase authentication for login function.
- Allow for direct insertion of itinerary items from a search API.
- Develop a settings function to let user set display and other preferences.
- Improve the mobile responsiveness of this app.
- Create a PDF of the itinerary.
- Improved user input validation.

### Technologies Used

- JavaScript
- jQuery
- Firebase
- Modals
- APIs used
  - Travel Information
    - https://www.state.gov/api/ (new)
  - Flights
    - https://api.skypicker.com/ (new) - provided by https://docs.kiwi.com/
  - Weather
    - https://api.openweathermap.org/ (old)
  - Currency Exchange
    - https://exchangeratesapi.io/ (new)
- AJAX - used to get information from APIs
- New Technologies
  - Bootstrap Modals
  - Date widget to select and validate start/end travel dates in form
- Polished Front-End - using Bootstrap
- Good Quality Coding Standards used
- No alerts, confirms, or prompts
- Bootstrap CSS framework
- Deployed on GitHub
- User input validation
- Mobile Responsive