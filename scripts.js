//VARS-CONTS-LETS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var apiKey = "148ea564e1a248f5a8bb2001c2cb5650"
var teamId = 346 


var stadiumName = document.querySelector(".stadiumName")
var teamName = document.querySelector(".teamName")


//VARS-CONTS-LETS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FETCH-JQUERY ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// $.ajax({
//     headers: { 'X-Auth-Token': '148ea564e1a248f5a8bb2001c2cb5650' },
//     url: `http://api.football-data.org/v2/teams/${teamId}`,
//     dataType: 'json',
//     type: 'GET',
//   }).done(function(response) {
//     // do something with the response, e.g. isolate the id of a linked resource   
//     console.log(response);
//     console.log(response.venue);
//     console.log(response.name);
//     stadiumName.textContent = "STADIUM:                  " +response.venue
//     teamName.textContent = "TEAM:                  " + response.name

//   });
  
var premierLeagueFetch = function(){
  $.ajax({
      headers: { 'X-Auth-Token': '148ea564e1a248f5a8bb2001c2cb5650' },
      url: `http://api.football-data.org/v2/competitions/PL/teams`,
      dataType: 'json',
      type: 'GET',
    }).done(function(response) {
      // do something with the response, e.g. isolate the id of a linked resource   
      console.log(response.teams);
      var userInput = "united"  
      var userInputLower = userInput.toLocaleLowerCase()

      
    



    

      for (var i = 0; i < 20; i++) {
          var teamName = response.teams[i].name.toLocaleLowerCase()
         console.log("Name:  "  + response.teams[i].name.toLocaleLowerCase() + "  teamID:  " +  response.teams[i].id);
         if (teamName.includes(userInputLower)){
             console.log("---------------------------id was the same")
             var teamId = response.teams[i].id
             console.log(teamId +" " + teamName)
           }
           else 
           console.log("id was not the same")  
      }




    });

}

premierLeagueFetch()
    ///TODO:
    //-- Finish this search function DONE
    //-- go over Git Branches 
    //-- Setup User input
    //-- go over wire frame
    //--