//VARS-CONSTS-LETS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var apiKey = "148ea564e1a248f5a8bb2001c2cb5650";
var teamId = null;
var playedGames = [] //think we should push to an array and cut off the last 5 and just display that info
var stadiumName = document.querySelector(".stadiumName");
var teamName = document.querySelector(".teamName");
var founded = document.querySelector(".founded");
var nation = document.querySelector(".nation");
var leagueName = document.querySelector(".leagueName");
var shortName = document.querySelector(".shortName");
var teamCrest = document.getElementById("teamCrest");
var mapImg = document.querySelector(".mapImg");

var submitBtn = document.getElementById("submitBtn");
var userInputForm = document.getElementById("userInputForm");
//VARS-CONSTS-LETS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Event Lis ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var getUserInput = function (e) {
  e.preventDefault();
  var userInput = userInputForm.value;
  console.log(userInput);
  premierLeagueFetch(userInput);
};

submitBtn.addEventListener("click", getUserInput);

//Event Lis ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FETCH-JQUERY ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var activeTeam = function (teamId) {
  $.ajax({
    headers: { "X-Auth-Token": "148ea564e1a248f5a8bb2001c2cb5650" },
    url: `http://api.football-data.org/v2/teams/${teamId}`,
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
    nation.textContent = "NATION:                  " + response.area.name
    leagueName.textContent = "LEAGUE:                  " + response.activeCompetitions[0].name;
    shortName.textContent = "ALSO KNOWN AS:                  " + response.shortName;


    teamCrest.setAttribute("src", response.crestUrl )
   //crest url works but the apis selection is poor, night worth selecting white background to lessen the contrast
  });
};

// VB 1&2/12/2021
// MAP API fetch - looking at HERE API & Google Geocoding to get co-ordinates for map
// HERE API key
var myMapAPI = "GfV_5iSYTmVscV8gV9aBKUMNPyhvn6XNRYUhKui3CQc"

// Team address data fetch request
var getAddress = function (teamId) {
  $.ajax({
    headers: { "X-Auth-Token": "148ea564e1a248f5a8bb2001c2cb5650" },
    url: `http://api.football-data.org/v2/teams/${teamId}`,
    dataType: "json",
    type: "GET",
  }).done(function (response) {
    console.log("STADIUM ADDRESS:", response.address);

    // Change string to be added to Map API call
    var teamAddress = response.address;
    teamAddress.toString();
    var webTeamAddress = teamAddress.replaceAll(" ", "+");
    console.log(webTeamAddress);

    // HERE API call for stadium on map
  //   fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${webTeamAddress}&apiKey=GfV_5iSYTmVscV8gV9aBKUMNPyhvn6XNRYUhKui3CQc`)
  // .then( function (response) 
  //   console.log("Address -----------------------",response)
  
  // );
  
  });

};

var premierLeagueFetch = function (userInput) {
  $.ajax({
    headers: { "X-Auth-Token": "148ea564e1a248f5a8bb2001c2cb5650" },
    url: `http://api.football-data.org/v2/competitions/PL/teams`,
    dataType: "json",
    type: "GET",
  }).done(function (response) {
    // do something with the response, e.g. isolate the id of a linked resource
    console.log(response.teams);
    
    //manually setting ID for design ease-should be removed in final build vvvvvvvvvvvvvvvv
    var userInput = "Chelsea"
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
      console.log(response.teams[i].venue)
      if (teamName.includes(userInputLower)) {
        console.log("---------------------------id was the same");
        var teamId = response.teams[i].id;
        console.log(teamId + " " + teamName);
      } else console.log("id was not the same");
    }
    matchHistory(teamId)
    activeTeam(teamId);
    getAddress(teamId);
  });
};



//manually calling button all the time REMOVE IN FINAL BUILD - ONLY HEAR FOR EASE OF DESIGN
premierLeagueFetch()

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
    headers: { 'X-Auth-Token': '148ea564e1a248f5a8bb2001c2cb5650' },
      url: `http://api.football-data.org/v2/teams/${teamId}/matches/`,
      dataType: 'json',
      type: 'GET',
    }).done(function(response) {
    // do something with the response, e.g. isolate the id of a linked resource
    console.log("LAST MATCHES.....................LAST MATCHES............." , response);
    for (var i = 0 ; i < 44 ; i++){
      if (response.matches[i].status == "FINISHED") {
        // console.log(i)
        ///THIS IS THE LOG THAT SHOWS ALL THE GAMES THAT HAVE BEEN PLAYED THIS SEASON
        // JUST NEED TO GET THEM RENDERED ON TO THE INDEX
        var homeTeamName = response.matches[i].homeTeam.name;
        var homeScore = response.matches[i].score.fullTime.homeTeam;
        var awayScore = response.matches[i].score.fullTime.awayTeam;
        var awayTeamName = response.matches[i].awayTeam.name;
        var comp = response.matches[i].competition.name;
        playedGames.push(homeTeamName + " " + homeScore + ":" +  awayScore + " " + awayTeamName + " " + comp);
        // console.log(homeTeamName);
        
      }

    else {
      console.log("GAMES NOT PLAYED YET")
    }
  }
  console.log("Played Games ------------------", playedGames);  
  
  for (var i = playedGames.length ; i >= playedGames.length -5; i--) {
    console.log(playedGames[i])
  }
  // Create append for played games array
});






// console.log("Played Games ------------------", reversePlayed); 


};


//Eh-