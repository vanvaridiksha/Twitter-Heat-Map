//Setup web server and socket
var twitter = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

//MongoDb Client
var MongoClient = require('mongodb').MongoClient;

var flag = false;

//Setup twitter stream api
var twit = new twitter({
 consumer_key: 'qEjJn7pKNMIZY0saE0XyQ6gYu',
  consumer_secret: 'WxgN54Z7Be7NSN8lKLQp0ShFKkOvTTIQCams1efOcMNld721IH',
  access_token_key: '17987942-uC6EsZRxX3jVoUvhfXu68Gn1R726RXMm2bT0UeEZD',
  access_token_secret: 'YmStU5YSq1M1l56i18ItwGZuI4Sa3m1VzzHoFYCFFIDAr'
}),
stream = null;


var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
//var url = 'mongodb://localhost:27017/twitter_data';


var url = 'mongodb://52.91.223.252:27017/twitter_data';


//Use the default port (for beanstalk) or default to 8081 locally
server.listen(process.env.PORT || 8081);

//Setup rotuing for app
app.use(express.static(__dirname + '/public'));






MongoClient.connect(url, function(err, db) {
  //assert.equal(null, err);
              

              //Create web sockets connection.
io.sockets.on('connection', function (socket) {

  socket.on("start tweets", function() {
    
   console.log("Reached DB");


   var cursor =db.collection('tweets').find( ).limit(2000);
   cursor.each(function(err, tweets) {
      assert.equal(err, null);
      if (tweets != null) {

        console.log(tweets);
         var outputPoint = {"lat": tweets.coordinate.coordinates[0],"lng": tweets.coordinate.coordinates[1],"tweet":tweets.tweet_text};

          socket.broadcast.emit("twitter-stream", outputPoint);

          //Send out to web sockets channel.
          socket.emit('twitter-stream', outputPoint);


      } else {
         //callback();
      }
   });





/////////// TEST ///////////



//if(stream === null) {
 if(!flag) { 
      //Connect to twitter stream passing in filter for entire world.
     // twit.stream('statuses/filter', {'locations':'-180,-90,180,90'}, function(stream) {
      flag = true;
      console.log("$$$$$ GETTING TWITTER STREAM $$$$$")
      twit.stream('statuses/filter', {track: 'love,news,jokes,travel'},   function(stream) {
          stream.on('data', function(tweet) {
              // Does the JSON result have coordinates
              if(!tweet.geo)
              {
                //console.log(tweet);
              }
  else{
    console.log("Adding new tweet");

    var outputPoint = {"lat": tweet.coordinates.coordinates[0],"lng": tweet.coordinates.coordinates[1],"tweet":tweet.text};

    socket.broadcast.emit("new-twitter-stream", outputPoint);

    //Send out to web sockets channel.
    socket.emit('new-twitter-stream', outputPoint);


   db.collection('tweets').insertOne( {
    //"username":tweet.user.screen_name,
    "tweet_id" : tweet.id,
    "tweet_id_str" : tweet.id_str,
    "tweet_created_at" : tweet.created_at,
    "tweet_timestamp" : tweet.timestamp_ms,
    "tweet_lang" : tweet.lang,
    "tweet_text" : tweet.text,
    "geo":tweet.geo,
    "retweet_count" : tweet.retweet_count,
    "favourite_count" : tweet.favorite_count,
    "coordinate":tweet.coordinates,
    "possibly_sensitive":tweet.possibly_sensitive
   }, function(err, result) {
    if(err) throw err;
    //console.log("Inserted a document with id : " + result[0]._id);
  });
}




});

              
              stream.on('limit', function(limitMessage) {
                return console.log(limitMessage);
              });

              stream.on('warning', function(warning) {
                return console.log(warning);
              });

              stream.on('disconnect', function(disconnectMessage) {
                return console.log(disconnectMessage);
              });


          });




      }











    
    });

socket.emit("connected");
  });

    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
    
});




//}








/*

if(stream === null) {
      //Connect to twitter stream passing in filter for entire world.
     // twit.stream('statuses/filter', {'locations':'-180,-90,180,90'}, function(stream) {
      twit.stream('statuses/filter', {track: 'love,news,jokes,travel'},   function(stream) {
          stream.on('data', function(tweet) {
              // Does the JSON result have coordinates
              /*if (data.coordinates){
                if (data.coordinates !== null){
                  //If so then build up some nice json and send out to web sockets
                  var outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]};

                  socket.broadcast.emit("twitter-stream", outputPoint);

                  //Send out to web sockets channel.
                  socket.emit('twitter-stream', outputPoint);
                }
                else if(data.place){
                  if(data.place.bounding_box === 'Polygon'){
                    // Calculate the center of the bounding box for the tweet
                    var coord, _i, _len;
                    var centerLat = 0;
                    var centerLng = 0;

                    for (_i = 0, _len = coords.length; _i < _len; _i++) {
                      coord = coords[_i];
                      centerLat += coord[0];
                      centerLng += coord[1];
                    }
                    centerLat = centerLat / coords.length;
                    centerLng = centerLng / coords.length;

                    // Build json object and broadcast it
                    var outputPoint = {"lat": centerLat,"lng": centerLng};
                    socket.broadcast.emit("twitter-stream", outputPoint);

                  }
                }
              }*/


/*
              if(!tweet.geo)
              {
                //console.log(tweet);
              }
  else{
    console.log(tweet);
   db.collection('tweets').insertOne( {
    //"username":tweet.user.screen_name,
    "tweet_id" : tweet.id,
    "tweet_id_str" : tweet.id_str,
    "tweet_created_at" : tweet.created_at,
    "tweet_timestamp" : tweet.timestamp_ms,
    "tweet_lang" : tweet.lang,
    "tweet_text" : tweet.text,
    "geo":tweet.geo,
    "retweet_count" : tweet.retweet_count,
    "favourite_count" : tweet.favorite_count,
    "coordinate":tweet.coordinates,
    "possibly_sensitive":tweet.possibly_sensitive
   }, function(err, result) {
    if(err) throw err;
    //console.log("Inserted a document with id : " + result[0]._id);
  });
}


});

              
              stream.on('limit', function(limitMessage) {
                return console.log(limitMessage);
              });

              stream.on('warning', function(warning) {
                return console.log(warning);
              });

              stream.on('disconnect', function(disconnectMessage) {
                return console.log(disconnectMessage);
              });


          });




      }




*/













