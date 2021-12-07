//VARS-CONSTS-LETS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// var gamesList = document.createElement("ul");
var apiKey = "148ea564e1a248f5a8bb2001c2cb5650";
var teamId = null;
var playedGames = []; //think we should push to an array and cut off the last 5 and just display that info
var displayLastFive = [];
var stadiumName = document.querySelector(".stadiumName");
var teamName = document.querySelector(".teamName");
var founded = document.querySelector(".founded");
var nation = document.querySelector(".nation");
var leagueName = document.querySelector(".leagueName");
var shortName = document.querySelector(".shortName");
var teamCrest = document.getElementById("teamCrest");
var mapImg = document.querySelector(".mapImg");
var gamesDisplay = document.querySelector(".LastGame1");
var submitBtn = document.getElementById("submitBtn");
var userInputForm = document.getElementById("userInputForm");
var mapDisplay = document.querySelector(".mapDisplay");
var squadListDisplay = document.getElementById("squadListDisplay");
//VARS-CONSTS-LETS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Event Lis ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var getUserInput = function (e) {
  e.preventDefault();
  var userInput = userInputForm.value;
  console.log("userInput:  " + userInput);
  premierLeagueFetch(userInput);
};

submitBtn.addEventListener("click", getUserInput);

//Event Lis ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FETCH-JQUERY ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var activeTeam = function (teamId) {
  $.ajax({
    headers: { "X-Auth-Token": "148ea564e1a248f5a8bb2001c2cb5650" },
    url: `https://api.football-data.org/v2/teams/${teamId}`,
    dataType: "json",
    type: "GET",
  }).done(function (response) {
    // do something with the response, e.g. isolate the id of a linked resource
    console.log(response);
    console.log(response.venue);
    console.log(response.name);
    stadiumName.textContent = "STADIUM:                  " + response.venue;
    teamName.textContent = "TEAM:                  " + response.name;
    founded.textContent = "FOUNDED:                  " + response.founded;
    nation.textContent = "NATION:                  " + response.area.name;
    leagueName.textContent =
      "LEAGUE:                  " + response.activeCompetitions[0].name;
    shortName.textContent =
      "ALSO KNOWN AS:                  " + response.shortName;

    teamCrest.setAttribute("src", response.crestUrl);
    //crest url works but the apis selection is poor, night worth selecting white background to lessen the contrast
  });
};

// VB 1&2/12/2021
// MAP API fetch - looking at HERE API Geocoding to get co-ordinates for map
// HERE API key
var myMapAPI = "GfV_5iSYTmVscV8gV9aBKUMNPyhvn6XNRYUhKui3CQc";

// Team address data fetch request
var getAddress = function (teamId) {
  $.ajax({
    headers: { "X-Auth-Token": "148ea564e1a248f5a8bb2001c2cb5650" },
    url: `https://api.football-data.org/v2/teams/${teamId}`,
    dataType: "json",
    type: "GET",
  }).done(function (response) {
    console.log("STADIUM ADDRESS:", response.address);

    // Change string to be added to Map API call
    var teamAddress = response.address;
    teamAddress.toString();
    var webTeamAddress = teamAddress.replaceAll(" ", "+");

    //var webTeamAddress = "Fulham+Road+London+SW6+1HS";
    console.log(webTeamAddress);
    // var corsAnywhere = "https://course-anywhere.herokuapp.com/"

    // API call using stadium address for map coordinates
    $.ajax({
      url: `https://geocode.search.hereapi.com/v1/geocode?q=${webTeamAddress}&apiKey=${myMapAPI}`,
      dataType: "json",
      type: "GET",
    }).done(function (response) {
      console.log("MAP LOCATION_____________________:", response);
      console.log(
        "MAP LATITUDE_____________________:",
        response.items[0].position.lat
      );
      console.log(
        "MAP LONGITUDE_____________________:",
        response.items[0].position.lng
      );
      // Declare coordinate variables to display map
      var teamLat = response.items[0].position.lat;
      var teamLong = response.items[0].position.lng;
      mapRender(teamLat, teamLong);

      // rendering are easier to reset if they're set up as functions, if they're set as just a constant criteria thats
      // what causes the writing of items on top of eachother like multiple maps, you have to reset the content before each render
      // Display map on page
    });
  });
};

var premierLeagueFetch = function (userInput) {
  $.ajax({
    headers: { "X-Auth-Token": "148ea564e1a248f5a8bb2001c2cb5650" },
    url: `https://api.football-data.org/v2/competitions/PL/teams`,
    dataType: "json",
    type: "GET",
  }).done(function (response) {
    // do something with the response, e.g. isolate the id of a linked resource
    console.log(response.teams);

    //manually setting ID for design ease-should be removed in final build vvvvvvvvvvvvvvvv
    //var userInput = "Manchester United";
    //Coment this in and out to turn off the search function ^^^^^^^^^^^
    var userInputLower = userInput.toLocaleLowerCase();

    for (var i = 0; i < 20; i++) {
      var teamName = response.teams[i].name.toLocaleLowerCase();
      console.log(
        "Name:  " +
          response.teams[i].name.toLocaleLowerCase() +
          "  teamID:  " +
          response.teams[i].id
      );
      console.log(response.teams[i].venue);
      if (teamName.includes(userInputLower)) {
        console.log("---------------------------id was the same");
        var teamId = response.teams[i].id;
        console.log(teamId + " " + teamName);
      } else console.log("id was not the same");
    }
    matchHistory(teamId);
    activeTeam(teamId);
    getAddress(teamId);
    getPlayers(teamId);
  });
};

//manually calling button all the time REMOVE IN FINAL BUILD - ONLY HEAR FOR EASE OF DESIGN
premierLeagueFetch();

// premierLeagueFetch()
///TODO:
//-- Finish this search function DONE
//-- go over Git Branches
//-- Setup User input
//-- go over wire frame
//----

// match history fetch
var matchHistory = function (teamId) {
  $.ajax({
    headers: { "X-Auth-Token": "148ea564e1a248f5a8bb2001c2cb5650" },
    url: `https://api.football-data.org/v2/teams/${teamId}/matches/`,
    dataType: "json",
    type: "GET",
  }).done(function (response) {
    // do something with the response, e.g. isolate the id of a linked resource
    console.log(
      "LAST MATCHES.....................LAST MATCHES.............",
      response
    );
    for (var i = 0; i < response.matches.length; i++) {
      if (response.matches[i].status == "FINISHED") {
        // console.log(i)
        ///THIS IS THE LOG THAT SHOWS ALL THE GAMES THAT HAVE BEEN PLAYED THIS SEASON
        // JUST NEED TO GET THEM RENDERED ON TO THE INDEX
        var homeTeamName = response.matches[i].homeTeam.name;
        var homeScore = response.matches[i].score.fullTime.homeTeam;
        var awayScore = response.matches[i].score.fullTime.awayTeam;
        var awayTeamName = response.matches[i].awayTeam.name;
        var comp = response.matches[i].competition.name;
        playedGames.push(
          homeTeamName +
            " " +
            homeScore +
            ":" +
            awayScore +
            " " +
            awayTeamName +
            " " +
            comp
        );
        // console.log(homeTeamName);
      } else {
        console.log("GAMES NOT PLAYED YET");
      }
    }
    console.log("Played Games ------------------", playedGames);
    displayLastFive = [];
    for (var i = playedGames.length; i >= playedGames.length - 5; i--) {
      console.log(playedGames[i]);
      displayLastFive.push(playedGames[i]);
    }
    testFunc();
    renderLastFive();

    //this rendering needs to be triggered upon the search this way we can took a reset of the content/innerHTML init aswell/
    // render it as a function and took it in the function thats on submit
  });
  // console.log("Played Games ------------------", reversePlayed);
};

var pastGamesList = document.getElementById("pastGamesList");
var listChild = pastGamesList.getElementsByTagName("li")[0];
var renderLastFive = function () {
  $("#pastGamesList").empty();
  // need to reset the innerHtml of the ul but cant figure it out yet - DONE!
  // Create appends for Last 5 played games array
  for (var i = 1; i < displayLastFive.length; i++) {
    var listItem = document.createElement("li");

    listItem.innerHTML = displayLastFive[i];
    pastGamesList.appendChild(listItem);
  }
};
//Eh-

var renderPlayers = function (squadList) {
  $("#squadListDisplay").empty();
  for (var i = 0; i < squadList.length; i++) {
    console.log(squadList[i]);
    var listItem = document.createElement("li");
    listItem.innerHTML = squadList[i];
    squadListDisplay.appendChild(listItem);
    
  }
};

function removeElementsByTag(tagName) {
  mapDisplay.innerHTML = "";
  const elements = document.getElementsByTagName(tagName);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

var testFunc = function () {
  console.log(
    "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTESTING"
  );
};

////this function gets the players and stores the key data we need in the "squadlist" array for rendering later
var getPlayers = function (teamId) {
  $.ajax({
    headers: { "X-Auth-Token": "148ea564e1a248f5a8bb2001c2cb5650" },
    url: `https://api.football-data.org/v2/teams/${teamId}`,
    dataType: "json",
    type: "GET",
  }).done(function (response) {
    var squadList = [];
    // do something with the response, e.g. isolate the id of a linked resource#
    for (var i = 0; i < response.squad.length; i++) {
      squadList.push(
        response.squad[i].name +
          " " +
          response.squad[i].nationality +
          " " +
          response.squad[i].position
      );
    }
    console.log(squadList);
    renderPlayers(squadList);
  });
};

var canvasTag = document.getElementsByTagName("canvas");
//map render

var mapRender = function (teamLat, teamLong) {
  //first thing here is to remove the canvas
  removeElementsByTag("canvas");

  var platform = new H.service.Platform({
    apikey: myMapAPI,
  });
  // Obtain the default map types from the platform object:
  var defaultLayers = platform.createDefaultLayers();

  // Instantiate (and display) a map object:
  var map = new H.Map(
    document.getElementById("mapContainer"),
    defaultLayers.vector.normal.map,
    {
      zoom: 13,
      center: { lat: teamLat, lng: teamLong },
    }
  );

  // VB 03/12/21 Tried to add custom marker to map but couldn't get the filepath to work. Saved a custom football pin to a new Img folder.
  // HERE documentation on map icons: https://developer.here.com/documentation/maps/3.1.30.3/dev_guide/topics/marker-objects.html

  // SVG markup that define icon image
  var svgMarkup =
    '<svg width="24" height="24" ' +
    'xmlns="https://www.w3.org/2000/svg">' +
    '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
    'height="22" /><text x="12" y="18" font-size="12pt" ' +
    'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
    'fill="white">!</text></svg>';

  // Creating icon, object for coordinates and marker
  var icon = new H.map.Icon(svgMarkup);
  var coords = { lat: teamLat, lng: teamLong };
  var marker = new H.map.Marker(coords, { icon: icon });

  //add marker to map
  map.addObject(marker);
};
