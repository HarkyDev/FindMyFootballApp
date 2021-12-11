//VARS-CONSTS-LETS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var apiKey = "148ea564e1a248f5a8bb2001c2cb5650";
var myGoogleAPI = "AIzaSyAd_1DIyVxvCXV7xLWOBeLPS1Na3GK1aJ0";
var teamId = null;
var playedGamesArr = []; 
var getLastFiveScoresArr = [];
var stadiumNameEl = document.querySelector(".stadium-Name");
var teamNameEl = document.querySelector(".team-Name");
var foundedEl = document.querySelector(".founded");
var nationEl = document.querySelector(".nation");
var leagueNameEl = document.querySelector(".league-Name");
var shortNameEl = document.querySelector(".short-Name");
var teamCrestEl = document.getElementById("team-Crest");
var gamesDisplayEl = document.querySelector(".LastGame1");
var submitBtlEl = document.getElementById("submit-Btn");
var userInputEl = document.getElementById("user-Input-Form");
var mapDisplayEl = document.querySelector(".map-Display");
var squadDisplayEl = document.getElementById("squad-List-Display");
var canvasTag = document.getElementsByTagName("canvas");
var userInput = null;
var localData = myLocalStorage.get();
var directionsButtonEl = document.createElement("button");
//VARS-CONSTS-LETS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Init() function to get local data from all leagues from onload.js
init();
//Search button Event Listener ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var getUserInput = function (e) {
  e.preventDefault();
  userInput = userInputEl.value;
  console.log("userInput:  " + userInput);
  validateUser(userInput);
};

submitBtlEl.addEventListener("click", getUserInput);

//Search button Event Listener ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FETCH-JQUERY Team Info ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var fetchActiveTeamData = function (teamId) {
  $.ajax({
    headers: { "X-Auth-Token": "148ea564e1a248f5a8bb2001c2cb5650" },
    url: `https://api.football-data.org/v2/teams/${teamId}`,
    dataType: "json",
    type: "GET",
  }).done(function (response) {
    
    console.log(response);
    console.log(response.venue);
    console.log(response.name);
    stadiumNameEl.textContent = "STADIUM:                  " + response.venue;
    teamNameEl.textContent = "TEAM:                  " + response.name;
    foundedEl.textContent = "FOUNDED:                  " + response.foundedEl;
    nationEl.textContent = "NATION:                  " + response.area.name;
    leagueNameEl.textContent =
      "LEAGUE:                  " + response.activeCompetitions[0].name;
    shortNameEl.textContent =
      "ALSO KNOWN AS:                  " + response.shortName;

    teamCrestEl.setAttribute("src", response.crestUrl);
  });
};
//FETCH-JQUERY Team Info ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// MAP API fetch ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var myMapAPI = "GfV_5iSYTmVscV8gV9aBKUMNPyhvn6XNRYUhKui3CQc";


var fetchTeamAddress = function (teamId) {
  $.ajax({
    headers: { "X-Auth-Token": "148ea564e1a248f5a8bb2001c2cb5650" },
    url: `https://api.football-data.org/v2/teams/${teamId}`,
    dataType: "json",
    type: "GET",
  }).done(function (response) {
    console.log("STADIUM ADDRESS:", response.address);

    
    var teamAddress = response.address;
    teamAddress.toString();
    var webTeamAddress = teamAddress.replaceAll(" ", "+");

    console.log(webTeamAddress);

    
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
 
    });
  });
};
// MAP API fetch ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SCORES Fetch ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var fetchMatchHistory = function (teamId) {
  $.ajax({
    headers: { "X-Auth-Token": "148ea564e1a248f5a8bb2001c2cb5650" },
    url: `https://api.football-data.org/v2/teams/${teamId}/matches/`,
    dataType: "json",
    type: "GET",
  }).done(function (response) {
    
    console.log(
      "LAST MATCHES.....................LAST MATCHES.............",
      response
    );

    for (var i = 0; i < response.matches.length; i++) {

      if (response.matches[i].status == "FINISHED") {
        var homeTeamName = response.matches[i].homeTeam.name;
        var homeScore = response.matches[i].score.fullTime.homeTeam;
        var awayScore = response.matches[i].score.fullTime.awayTeam;
        var awayTeamName = response.matches[i].awayTeam.name;
        var comp = response.matches[i].competition.name;
        playedGamesArr.push(
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
    console.log("Played Games ------------------", playedGamesArr);
  
    getLastFiveScoresArr = [];
    
    for (var i = playedGamesArr.length; i >= playedGamesArr.length - 5; i--) {
      console.log(playedGamesArr[i]);
      getLastFiveScoresArr.push(playedGamesArr[i]);
    }
    renderLastFive();

  });
};


var pastGamesList = document.getElementById("past-Games-List");
var listChild = pastGamesList.getElementsByTagName("li")[0];

var renderLastFive = function () {
  $("#past-Games-List").empty();

  for (var i = 1; i < getLastFiveScoresArr.length; i++) {
    var gamesListItem = document.createElement("li");

    gamesListItem.innerHTML = getLastFiveScoresArr[i];
    pastGamesList.appendChild(gamesListItem);
    gamesListItem.setAttribute(
      "class",
      "pastGamesJS text-gray-50 rounded p-2 m-1 shrink-1  "
    );
  }
};

// PLAYER LIST render ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var renderPlayers = function (squadList) {
  $("#squadDisplayEl").empty();
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
    squadDisplayEl.appendChild(playerListItem);
 
    playerListItem.setAttribute(
      "class",
      "player-Card text-xl bg-gray-800 text-black rounded-lg m-2 p-2 flex-shrink"
    );
  }
};


// PLAYER LIST render ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var fetchTeamPlayers = function (teamId) {
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
// PLAYER LIST render ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//Function to remove elements ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function removeElementsByTag(tagName) {
  mapDisplayEl.innerHTML = "";
  var elements = document.getElementsByTagName(tagName);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}
//Function to remove elements ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//MAP render ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var mapRender = function (teamLat, teamLong) {
 
  removeElementsByTag("canvas");

 
  var platform = new H.service.Platform({
    apikey: myMapAPI,
  });
 
  var defaultLayers = platform.createDefaultLayers();

 
  var map = new H.Map(
    document.getElementById("mapContainer"),
    defaultLayers.vector.normal.map,
    {
      zoom: 13,
      center: { lat: teamLat, lng: teamLong },
    }
  );
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

  
  var icon = new H.map.DomIcon(animatedSvg),
    coords = { lat: teamLat, lng: teamLong },
    marker = new H.map.DomMarker(coords, { icon: icon });

 
  map.setCenter(coords);
  map.setZoom(14);
  map.addObject(marker);

 
  directionsButtonEl.innerHTML = "Get Directions";
  directionsButtonEl.setAttribute(
    "class",
    "directionButton bg-white text-yellow-600  font-medium hover:bg-gray-300 p-2 rounded-bl-2xl rounded-br-2xl "
  );
  mapDisplayEl.append(directionsButtonEl);
 
  directionsButtonEl.onclick = function () {
    window.open(
      `https://www.google.com/maps/dir//${teamLat},${teamLong}/@${teamLat},${teamLong},17z`
    );
  };
};
//MAP render ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Local Storage function ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var myLocalStorage = {
  get: function () {
    var leagueDataString = localStorage.getItem("leagueData");
    return JSON.parse(leagueDataString);
  },
  set: function (data) {
    localStorage.setItem("leagueData", JSON.stringify(data));
  },
};

var validateUser = function (userText) {
  
  var userInputLower = userText.toLocaleLowerCase();
  //Loop to check over local data
  for (var i = 0; i < localData.length; i++) {
    var teamNameEl = localData[i].name.toLocaleLowerCase();
    console.log(
      "Name:  " +
        localData[i].name.toLocaleLowerCase() +
        "  teamID:  " +
        localData[i].id
    );
    
    if (teamNameEl.includes(userInputLower)) {
      console.log("---------------------------id was the same");
      var teamId = localData[i].id;
      console.log(teamId + " " + teamNameEl);
      fetchMatchHistory(teamId);
      fetchActiveTeamData(teamId);
      fetchTeamAddress(teamId);
      fetchTeamPlayers(teamId);
      getDirections(teamId);
    } else console.log("id was not the same");
  }
};

//Local Storage function ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Event listener to resize map when screen size is changed - temp workaround
window.addEventListener("resize", getUserInput);

// EH & VB 2021