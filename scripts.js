//VARS-CONTS-LETS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var apiKey = "148ea564e1a248f5a8bb2001c2cb5650"
var TeamId = 300

var stadiumName = document.querySelector(".stadiumName")
var teamName = document.querySelector(".teamName")


//VARS-CONTS-LETS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FETCH-JQUERY ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$.ajax({
    headers: { 'X-Auth-Token': '148ea564e1a248f5a8bb2001c2cb5650' },
    url: `http://api.football-data.org/v2/teams/${TeamId}`,
    dataType: 'json',
    type: 'GET',
  }).done(function(response) {
    // do something with the response, e.g. isolate the id of a linked resource   
    console.log(response);
    console.log(response.venue);
    console.log(response.name);
    stadiumName.textContent = "STADIUM:                  " +response.venue
    teamName.textContent = "TEAM:                  " + response.name
    
  });

  //FETCH-JQUERY ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////