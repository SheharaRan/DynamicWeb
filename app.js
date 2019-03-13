console.log("The Bot is starting!")

//Twit NPM package -- uses twitter API
var Twit = require('twit')
var config = require('./config.js')
var T = new Twit(config);

//Spotify-web-api-node NPM package -- uses spotify API
var SpotifyWebApi = require('spotify-web-api-node');
var config2 = require('./config2.js')
var spotifyApi = new SpotifyWebApi(config2);

//aztro-js NPM package
var aztroJs = require("aztro-js")

//An array with the signs and their emojis that go at the beginning of the tweet
var signs = ["Aries ♈: ", "Taurus ♉: ", "Gemini ♊:", "Cancer ♋: ", "Leo ♌: ", "Virgo ♍: ", "Libra ♎: ", "Scorpio ♏: ", "Sagittarius ♐: ", "Capricorn ♑: ", "Aquarius ♒: ", "Pisces ♓: "]

//initialize sign w a random sign -- doesn't matter
var sign = 'cancer';

//initialize tweet and arrays
var tweet;
var wordsAsArray = ["", ''];
var tweetAsArray = ['', ''];

//Start twitter stream and track any tweet that mentions the account
var stream = T.stream('statuses/filter', {
    track: '@musichoroscopes'
})
console.log('streaming')

stream.on('tweet', function (tweet) {

    //set name as the user who tweeted the account
    name = tweet.user.screen_name;

    //set tweet to the text of the tweet 
    tweet = tweet.text

    //split the tweet into an array to seperate the username and the bday
    tweetAsArray = tweet.split(" ");

    //make a new array with just the bday
    var tarray = tweetAsArray[1];

    //split the tweet w the bday into just the month, day, year
    tweetAsArray = tarray.split("/");
    console.log(tweetAsArray);

    //checks the month and day and determines which sign the user is
    if ((tweetAsArray[0] == 3 && tweetAsArray[1] >= 21) || (tweetAsArray[0] == 4 && tweetAsArray[1] <= 19)) {
        sign = 'aries'
        num = 0;
    } else if ((tweetAsArray[0] == 4 && tweetAsArray[1] >= 20) || (tweetAsArray[0] == 5 && tweetAsArray[1] <= 20)) {
        sign = 'taurus'
        num = 1;
    } else if ((tweetAsArray[0] == 5 && tweetAsArray[1] >= 21) || (tweetAsArray[0] == 6 && tweetAsArray[1] <= 20)) {
        sign = 'gemini'
        num = 2;
    } else if ((tweetAsArray[0] == 6 && tweetAsArray[1] >= 21) || (tweetAsArray[0] == 7 && tweetAsArray[1] <= 22)) {
        sign = 'cancer'
        num = 3;
    } else if ((tweetAsArray[0] == 7 && tweetAsArray[1] >= 23) || (tweetAsArray[0] == 8 && tweetAsArray[1] <= 22)) {
        sign = 'leo'
        num = 4;
    } else if ((tweetAsArray[0] == 8 && tweetAsArray[1] >= 23) || (tweetAsArray[0] == 9 && tweetAsArray[1] <= 22)) {
        sign = 'virgo'
        num = 5;
    } else if ((tweetAsArray[0] == 9 && tweetAsArray[1] >= 23) || (tweetAsArray[0] == 10 && tweetAsArray[1] <= 22)) {
        sign = 'libra'
        num = 6;
    } else if ((tweetAsArray[0] == 10 && tweetAsArray[1] >= 23) || (tweetAsArray[0] == 11 && tweetAsArray[1] <= 21)) {
        sign = 'scorpio'
        num = 7;
    } else if ((tweetAsArray[0] == 11 && tweetAsArray[1] >= 22) || (tweetAsArray[0] == 12 && tweetAsArray[1] <= 21)) {
        sign = 'sagittarius'
        num = 8;
    } else if ((tweetAsArray[0] == 12 && tweetAsArray[1] >= 22) || (tweetAsArray[0] == 1 && tweetAsArray[1] <= 19)) {
        sign = 'capricorn'
        num = 9;
    } else if ((tweetAsArray[0] == 1 && tweetAsArray[1] >= 20) || (tweetAsArray[0] == 2 && tweetAsArray[1] <= 18)) {
        sign = 'aquarius'
        num = 10;
    } else if ((tweetAsArray[0] == 2 && tweetAsArray[1] >= 19) || (tweetAsArray[0] == 3 && tweetAsArray[1] <= 20)) {
        sign = 'pisces'
        num = 11;
    }

    aztroJs.getTodaysHoroscope(sign, function (res) {

        //sets words to the horoscope for the certain sign
        var words = res.description;

        //splits the horoscope into an array w each word in an index
        var wordsAsArray = words.split(" ");

        //finds a random number
        var index = Math.floor(Math.random() * wordsAsArray.length);

        //calls the spotify API
        spotifyApi
            .clientCredentialsGrant()
            .then(function (data) {

                //gets your access token so you can actually get into the API
                spotifyApi.setAccessToken(data.body['access_token']);

                
                //searches for a track in the spotify database w a keyword from the horoscope
                return spotifyApi.searchTracks(wordsAsArray[index]);
            })
            .then(function (data) {

                console.log(data.body.tracks.items[0].external_urls.spotify);

                console.log(sign)




                //post on twitter w the user, the sign and emoji, the horoscope, and a song
                T.post('statuses/update', {
                    status: "@" + name + " " + signs[num] + res.description + data.body.tracks.items[0].external_urls.spotify
                }, function (err, data, response) {
                    console.log('posted!');
                })

            })
    })
});
