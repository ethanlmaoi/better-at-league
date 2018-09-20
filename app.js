var express = require("express");
var app = express();
var request = require("request");
app.set("view engine", "ejs");
var dataPlayer = "";
var dataOpponent = "";

app.get("/search", function(req, res) {
   res.render("search"); 
});

app.get("/results", function(req, res) {
    
    var queryPlayer = req.query.searchPlayer;
    var queryOpponent = req.query.searchOpponent;
    
    // sends request to receive PLAYER summoner ID, name, profileIconId, summonerLevel
    request("https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + queryPlayer + "?api_key=RGAPI-5a515c06-93d3-4592-b32b-edffd9304d63", function(error, response, body) {
       if (!error && response.statusCode == 200) {
           dataPlayer = JSON.parse(body);
       }
    });
    
    // sends request to receive OPPONENT summoner ID, name, profileIconId, summonerLevel
    request("https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + queryOpponent + "?api_key=RGAPI-5a515c06-93d3-4592-b32b-edffd9304d63", function(error, response, body) {
       if (!error && response.statusCode == 200) {
           dataOpponent = JSON.parse(body);
           res.render("results", {dataPlayer: dataPlayer, dataOpponent: dataOpponent});
       }
    });
    
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Who is the Better Summoner?"); 
});