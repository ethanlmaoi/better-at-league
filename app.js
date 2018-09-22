var express = require("express");
var app = express();
var request = require("request");
app.set("view engine", "ejs");
var dataPlayer = "";
var dataOpponent = "";
var dataMatchList = "";
var dataMatch = "";
var matchID = "";

app.get("/search", function(req, res) {
   res.render("search"); 
});

app.get("/results", function(req, res) {
    
    var queryPlayer = req.query.searchPlayer;
    var queryOpponent = req.query.searchOpponent;
    
    // sends request to receive PLAYER summoner ID, name, profileIconId, summonerLevel
    request("https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + queryPlayer + "?api_key=RGAPI-7c362880-dcc3-49df-8ae8-a7b4f470ba54", function(error, response, body) {
       if (!error && response.statusCode == 200) {
           dataPlayer = JSON.parse(body);
           var queryAccountID = dataPlayer["accountId"];
           console.log(queryAccountID); // should print PLAYER'S accountId
           
           // sends request using player's accountId to receive matchId or gameId
           request("https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/" + queryAccountID + "?api_key=RGAPI-7c362880-dcc3-49df-8ae8-a7b4f470ba54", function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    dataMatchList = JSON.parse(body);
                    matchID = dataMatchList["matches"][0]["gameId"];
                    console.log(matchID); // should print PLAYER'S matchId
                    
                    // sends request using matchId to receive matchData
                    request("https://na1.api.riotgames.com/lol/match/v3/matches/" + matchID + "?api_key=RGAPI-7c362880-dcc3-49df-8ae8-a7b4f470ba54", function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            dataMatch = JSON.parse(body);
                            // console.log(dataMatch);
                            }
                        });
                }
           });
       }
    });
    
    // sends request to receive OPPONENT summoner ID, name, profileIconId, summonerLevel
    request("https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + queryOpponent + "?api_key=RGAPI-7c362880-dcc3-49df-8ae8-a7b4f470ba54", function(error, response, body) {
       if (!error && response.statusCode == 200) {
           dataOpponent = JSON.parse(body);
           console.log(dataOpponent);
       }
    });
    
    var delayInMilliseconds = 5000; // renders all of the data
    
    // renders results page with all data
    setTimeout(function() {
        res.render("results", {dataPlayer: dataPlayer, dataOpponent: dataOpponent, dataMatchList: dataMatchList, dataMatch: dataMatch});
        var queryAccountIdPlayer = req.query.accountIdPlayer;
        console.log(queryAccountIdPlayer);
    }, delayInMilliseconds);
    
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Who is the Better Summoner?"); 
});