//VARS-CONTS-LETS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var apiKey = "148ea564e1a248f5a8bb2001c2cb5650";
var teamId = null;
var stadiumName = document.querySelector(".stadiumName");
var teamName = document.querySelector(".teamName");
var founded = document.querySelector(".founded");
var nation = document.querySelector(".nation");
var leagueName = document.querySelector(".leagueName");
var shortName = document.querySelector(".shortName");
var teamCrest = document.getElementById("teamCrest");


var submitBtn = document.getElementById("submitBtn");
var userInputForm = document.getElementById("userInputForm");
//VARS-CONTS-LETS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    // var userInput = "chelsea"
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
      var playedGames = [] //think we should push to an array and cut off the last 5 and just display that info
      if (response.matches[i].status == "FINISHED") {
        // console.log(i)
        ///THIS IS THE LOG THAT SHOWS ALL THE GAMES THAT HAVE BEEN PLAYED THIS SEASON
        // JUST NEED TO GET THEM RENDERED ON TO THE INDEX
         console.log(
          response.matches[i].homeTeam.name + " " +
          response.matches[i].score.fullTime.homeTeam +
          " : " +
          response.matches[i].score.fullTime.awayTeam + " " +
          response.matches[i].awayTeam.name + 
          " Competition: " + response.matches[i].competition.name );
         
        
        }
      else {
        console.log("GAMES NOT PLAYED YET")
      }
    }
    
    });
  }
 


//Eh-