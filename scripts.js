//VARS-CONSTS-LETS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var apiKey = "148ea564e1a248f5a8bb2001c2cb5650";
var myGoogleAPI = "AIzaSyAd_1DIyVxvCXV7xLWOBeLPS1Na3GK1aJ0";
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
var userInput = null;
var localData = myLocalStorage.get();
var directionsButton = document.createElement("button");
//VARS-CONSTS-LETS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Event Lis ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var getUserInput = function (e) {
  e.preventDefault();
  localStorage.clear();
  userInput = userInputForm.value;
  console.log("userInput:  " + userInput);
  userValidation(userInput);
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

    console.log(webTeamAddress);

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
      console.log("------------------xxxxxxxxxxxxxxxx MAP IS RENDERED xxxxxxxxxxxxxxxx---------------- ")
    });
  });
};
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
            " - " +
            awayScore +
            " " +
            awayTeamName +
            " " +
            comp
        );
        
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
};


// match history fetch

var pastGamesList = document.getElementById("pastGamesList");
var listChild = pastGamesList.getElementsByTagName("li")[0];
var renderLastFive = function () {
  $("#pastGamesList").empty();
  // need to reset the innerHtml of the ul but cant figure it out yet - DONE!
  // Create appends for Last 5 played games array
  for (var i = 1; i < displayLastFive.length; i++) {
    var gamesListItem = document.createElement("li");

    gamesListItem.innerHTML = displayLastFive[i];
    pastGamesList.appendChild(gamesListItem);
    gamesListItem.setAttribute(
      "class",
      "pastGamesJS text-gray-50 rounded p-2 m-1 shrink-1  "
    );
  }
};
//Eh-

var renderPlayers = function (squadList) {
  $("#squadListDisplay").empty();
  for (var i = 0; i < squadList.length; i++) {
    console.log(squadList[i]);

    var playerListItem = document.createElement("li");
    var nameLine = document.createElement("p");
    var nationalityLine = document.createElement("p");
    var positionLine = document.createElement("p");

    nameLine.innerHTML = "Name: " + squadList[i].name;
    nationalityLine.innerHTML = "Home Country: " + squadList[i].nationality;
    positionLine.innerHTML = "Position: " + squadList[i].position;

    playerListItem.append(nameLine, nationalityLine, positionLine);
    squadListDisplay.appendChild(playerListItem);
    playerListItem.setAttribute(
      "class",
      "player-Card text-xl bg-gray-800 text-black rounded-lg m-2 p-2 flex-shrink"
    );
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
      var playerName = response.squad[i].name;
      var playerNat = response.squad[i].nationality;
      var playerPos = response.squad[i].position;
      squadList.push({
        name: playerName,
        nationality: playerNat,
        position: playerPos,
      });
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
  // Create a map object:

  // Define a variable holding SVG mark-up that defines an animated icon image:
  var animatedSvg =
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" ' +
    'y="0px" style="margin:-112px 0 0 -32px" width="136px"' +
    'height="150px" viewBox="0 0 136 150"><ellipse fill="#000" ' +
    'cx="32" cy="128" rx="36" ry="4"><animate attributeName="cx" ' +
    'from="32" to="32" begin="0s" dur="1.5s" values="96;32;96" ' +
    'keySplines=".6 .1 .8 .1; .1 .8 .1 1" keyTimes="0;0.4;1"' +
    'calcMode="spline" repeatCount="indefinite"/>' +
    '<animate attributeName="rx" from="36" to="36" begin="0s"' +
    'dur="1.5s" values="36;10;36" keySplines=".6 .0 .8 .0; .0 .8 .0 1"' +
    'keyTimes="0;0.4;1" calcMode="spline" repeatCount="indefinite"/>' +
    '<animate attributeName="opacity" from=".2" to=".2"  begin="0s" ' +
    ' dur="1.5s" values=".1;.7;.1" keySplines=" .6.0 .8 .0; .0 .8 .0 1" ' +
    'keyTimes=" 0;0.4;1" calcMode="spline" ' +
    'repeatCount="indefinite"/></ellipse><ellipse fill="#F19D00" ' +
    'cx="26" cy="20" rx="16" ry="12"><animate attributeName="cy" ' +
    'from="20" to="20" begin="0s" dur="1.5s" values="20;112;20" ' +
    'keySplines=".6 .1 .8 .1; .1 .8 .1 1" keyTimes=" 0;0.4;1" ' +
    'calcMode="spline" repeatCount="indefinite"/> ' +
    '<animate attributeName="ry" from="16" to="16" begin="0s" ' +
    'dur="1.5s" values="16;12;16" keySplines=".6 .0 .8 .0; .0 .8 .0 1" ' +
    'keyTimes="0;0.4;1" calcMode="spline" ' +
    'repeatCount="indefinite"/></ellipse></svg>';

  // Create an icon object, an object with geographic coordinates and a marker:
  var icon = new H.map.DomIcon(animatedSvg),
    coords = { lat: teamLat, lng: teamLong },
    marker = new H.map.DomMarker(coords, { icon: icon });

  // Set map center and zoom, add the marker to the map:
  map.setCenter(coords);
  map.setZoom(14);
  map.addObject(marker);

  //Add get directions function to map using google maps
  // var mapBox = document.getElementById("mapContainer");
  mapDisplay.append(directionsButton);

  directionsButton.innerHTML = "Get Directions";
  directionsButton.setAttribute(
    "class",
    "directionButton bg-white text-yellow-600  font-medium hover:bg-gray-300 p-2 rounded-bl-2xl rounded-br-2xl "
  );

  directionsButton.onclick = function () {
    window.open(
      `https://www.google.com/maps/dir//${teamLat},${teamLong}/@${teamLat},${teamLong},17z`
    );
  };
};

var myLocalStorage = {
  get: function () {
    var leagueDataString = localStorage.getItem("leagueData");
    return JSON.parse(leagueDataString);
  },
  set: function (data) {
    localStorage.setItem("leagueData", JSON.stringify(data));
  },
};

console.log("THIS LOCAL DATA WAS LOADED ON SCRIPT.js", localData);
var userValidation = function (userText) {
  //manually setting ID for design ease-should be removed in final build vvvvvvvvvvvvvvvv
  //var userInput = "Manchester United";
  //Coment this in and out to turn off the search function ^^^^^^^^^^^
  var userInputLower = userText.toLocaleLowerCase();

  for (var i = 0; i < localData.length; i++) {
    var teamName = localData[i].name.toLocaleLowerCase();
    console.log(
      "Name:  " +
        localData[i].name.toLocaleLowerCase() +
        "  teamID:  " +
        localData[i].id
    );
    if (teamName.includes(userInputLower)) {
      console.log("---------------------------id was the same");
      var teamId = localData[i].id;
      console.log(teamId + " " + teamName);
      matchHistory(teamId);
      activeTeam(teamId);
      getAddress(teamId);
      getPlayers(teamId);
      getDirections(teamId);
    } else console.log("id was not the same");
  }
};


//on change size event we should be re rendering the map
// const widthOutput = document.querySelector("#width");
// console.log(widthOutput);

var testFunc = () => {
console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
}

window.addEventListener('resize', getUserInput)
