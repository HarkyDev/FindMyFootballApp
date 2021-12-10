var myLocalStorage = {
    get: function () {
        var leagueDataString = localStorage.getItem("leagueData");
        return JSON.parse(leagueDataString);
    },    
    set: function (data) {
        localStorage.setItem("leagueData", JSON.stringify(data));
    },    
};    



var leagueFetch = async function () {
    var leagueArray = ["BL1", "PL", "FL1", "SA", "PD", "PPL", "DED"];
    var teamsData = [];
    for (var n = 0; n < leagueArray.length; n++) {
        var response = await $.ajax({
            headers: { "X-Auth-Token": "148ea564e1a248f5a8bb2001c2cb5650" },
            url: `https://api.football-data.org/v2/competitions/${leagueArray[n]}/teams`,
            dataType: "json",
            type: "GET",
        });    
        // console.log(response.teams.length);
        
        for (var i = 0; i < response.teams.length; i++) {
            var teamObject = {
                name: response.teams[i].name,
                id: response.teams[i].id,
            };    
            teamsData.push(teamObject);
            
        }    
    }    
    console.log("final data", teamsData);
    location.reload();
    myLocalStorage.set(teamsData);
};    


var localData = myLocalStorage.get()
console.log(localData)
//leagueFetch();
if (!localData){
    leagueFetch();
    console.log("local data was empty")
}


