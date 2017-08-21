var PubNub = require('pubnub')
var async = require('async')
var os = require("os");
var config = require('./config.json');

var hostname = process.argv[2].split(".", 2);

workerID=hostname[0];
region=hostname[1];

var subscribe = function(subID) {

  return function (callback) {

    var subscriber = workerID + '_' + subID;
    pubnub = new PubNub({
       subscribeKey: config.subscribeKey,
       ssl: true
       // Add for debugging purposes only.  Do not enable during load test
       //logVerbosity: "true"
    })

    // Ensure this is set to 0.  Will not perform a heartbeat
    pubnub._config.setHeartbeatInterval(0);

    pubnub.addListener({
      message: function(message) {
        // Calculate Latency from time published to time received on client
        var now = new Date();
        var sent = new Date(message.message.Date);
        var diff = now - sent;

        console.log(message.message.Date + ' ' + subscriber +
          ' ' + message.message['E-Tag'] + ' ' + message.message.Status +
          ' ' + diff);
      },

      // https://www.pubnub.com/docs/nodejs-javascript/pubnub-javascript-sdk#listeners
      status: function(s) {
      var now = (new Date()).toISOString();
        if(s.errorData) {console.log(now + ' ' + region + ' ' + subscriber + ' ' + s.category + ' ' + s.operation + ' ' + s.errorData);}
      else {
        console.log(now + ' ' + region + ' ' + subscriber + ' ' + s.category + ' ' + s.operation);
      }
    }

      // Example payloads

      // connect occurred { category: 'PNConnectedCategory',
      //   operation: 'PNSubscribeOperation',
      //   affectedChannels: [ 'test' ],
      //   subscribedChannels: [ 'test' ],
      //   affectedChannelGroups: [],
      //   lastTimetoken: 0,
      //   currentTimetoken: '15032999507074655' }

      // connect occurred { error: true,
      //   operation: 'PNHeartbeatOperation',
      //   errorData:
      //    { Error: timeout of 15000ms exceeded
      //        at Timeout.<anonymous> (/Users/chrisdelorenzo/repos/ao-client-pubnub/node_modules/superagent/lib/node/index.js:693:17)
      //        at tryOnTimeout (timers.js:224:11)
      //        at Timer.listOnTimeout (timers.js:198:5) timeout: 15000, code: 'ECONNABORTED', response: undefined },
      //   category: 'PNTimeoutCategory' }

    })

    pubnub.subscribe({
      channels: ['test']
    });

    callback(null, subscriber + ' subscribed');
  }
};

if (require.main === module) {
  // Number of connections to run on server.
  var connections = config.connections;
  // Number of seconds to ramp up over.
  var ramp = config.ramp;
  // Concurrent connections attempted per second.
  var rate = Math.ceil((connections / ramp) * 100)/100;;

  var count = 1;

  intervalPerConnection = (1/rate)*1000;

  console.log((new Date()).toISOString() + ' ' + region + ' ' + "Ramping up " + connections +
    " connection/s Rate " + rate +
    " per second over a period of " + ramp + " second/s");

  var subscribers = [];

  setTimeout(function request() {
    subscribers.length = 0
    subscribers.push(subscribe(count));
    async.parallel(subscribers, function(err, result){
      console.log((new Date()).toISOString() + ' ' + region + ' ' + result )
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
