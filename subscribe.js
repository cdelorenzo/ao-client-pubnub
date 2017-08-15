var PubNub = require('pubnub')
var async = require('async')
var os = require("os");
var config = require('./config.json');

var hostname = os.hostname();

var subscribe = function(callback) {

pubnub = new PubNub({
   publishKey : config.publishKey,
   subscribeKey : config.subscribeKey
})

pubnub.addListener({
  message : function(message) {
    var now = new Date();
    //TODO Awating information into "dirty" json responses
    console.log(message)

  //   message returned is not valid
  //
  //   { channel: 'test',
  // subscription: undefined,
  // actualChannel: null,
  // subscribedChannel: 'test',
  // timetoken: '15028059476527030',
  // publisher: '9B4FD80D-574C-4AB1-9968-FD02F25C0816',
  // message:
  //  { Date: '2017-08-15T14:05:47:000+00:00',
  //    'Content-Length': 3926,
  //    'Cache-Control': 'max-age=6.223095',
  //    'E-Tag': 0,
  //    Status: 404,
  //    Message: 'f8

    console.log("date=" + now +
        ",hostname=" + hostname +
        ",workerid=" + "" +
        ",etag=" + "" +
        ",status=" + "" +
        ",elapsed_time_ms=" + "" )
   }

  })

  pubnub.subscribe({
    channels : [ 'test' ]
  });

  callback(null,"Connecting and Subscribing");

};

if (require.main === module) {
  // Number of connections to run on server.
  var connections = 750;
  // Number of seconds to ramp up over.
  var ramp = 600;
  // Concurrent connections attempted per second.
  var rate = Math.ceil((connections / ramp) * 100)/100;;

  var count = 0

  intervalPerConnection = (1/rate)*1000;

  console.log("Rampup commenced " + connections +
   "Connections over " + ramp + " seconds");

  var subscribers = [];

  setTimeout(function request() {
    subscribers.length = 0
    subscribers.push(subscribe);
    async.parallel(subscribers, function(err, result){
      console.log(result)
    });

    if(count == connections){
      console.log("Reached connection count: ", connections);
    }
    else {
      interval = setTimeout(request,intervalPerConnection);
      console.log(count);
      count++;
    }
  }, intervalPerConnection);


} else {
  console.log('please start via node subscribe.js');
}
