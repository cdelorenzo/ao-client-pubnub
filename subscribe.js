var PubNub = require('pubnub')
var async = require('async')
var os = require("os");
var config = require('./config.json');

var workerID = process.argv[2];

var subscribe = function(subID) {

  return function (callback) {

    var subscriber = workerID + '_' + subID;
    pubnub = new PubNub({
       publishKey : config.publishKey,
       subscribeKey : config.subscribeKey,
       ssl: true
    })

    pubnub._config.setHeartbeatInterval(0);
    
    pubnub.addListener({
      message : function(message) {
        // Calculate Latency
        var now = new Date();
        var sent = new Date(message.message.Date);
        var diff = now - sent;
        // Reduce size of hostname to save on log line size

        console.log(message.message.Date + ' ' + subscriber +
          ' ' + message.message['E-Tag'] + ' ' + message.message.Status +
          ' ' + diff);
      }

    })

    pubnub.subscribe({
      channels : [ 'test' ]
    });

    callback(null, 'subscriber ' + subscriber + ' initialised');
  }
};

if (require.main === module) {
  // Number of connections to run on server.
  var connections = config.connections;
  // Number of seconds to ramp up over.
  var ramp = config.ramp;
  // Concurrent connections attempted per second.
  var rate = Math.ceil((connections / ramp) * 100)/100;;

  var count = 0

  intervalPerConnection = (1/rate)*1000;

  console.log("Ramping up " + connections +
    " connections at a rate of " + rate +
    " per second over a period of " + ramp + " seconds");

  var subscribers = [];

  setTimeout(function request() {
    subscribers.length = 0
    subscribers.push(subscribe(count));
    async.parallel(subscribers, function(err, result){
      console.log((new Date()).toISOString() + " connection: " + count + ' ' + result )
    });

    if(count == connections){
    }
    else {
      interval = setTimeout(request,intervalPerConnection);
      count++;
    }
  }, intervalPerConnection);

} else {
  console.log('please start via node subscribe.js');
}
