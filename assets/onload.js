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
//Local Storage function ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//League Fetch function ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var fetchLeague = async function () {
  var leagueArr = ["BL1", "PL", "FL1", "SA", "PD", "PPL", "DED"];
  var teamsData = [];
  //Loop to check and get data from each league
  for (var n = 0; n < leagueArr.length; n++) {
    var response = await $.ajax({
      headers: { "X-Auth-Token": "148ea564e1a248f5a8bb2001c2cb5650" },
      url: `https://api.football-data.org/v2/competitions/${leagueArr[n]}/teams`,
      dataType: "json",
      type: "GET",
    });
    //Loop to store recieved data as desired
    for (var i = 0; i < response.teams.length; i++) {
      var teamObject = {
        name: response.teams[i].name,
        id: response.teams[i].id,
      };
      //Push to empty array
      teamsData.push(teamObject);
    }
  }
  //console.log("final data", teamsData);
  location.reload();
  //Set data to local storage
  myLocalStorage.set(teamsData);
};
//League Fetch function ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get local storage data, run fetchLeague if empty
var init = function () {
var localData = myLocalStorage.get();
//console.log(localData);
if (!localData) {
  fetchLeague();
  console.log("local data was empty");
}
};

