var Ably = require('ably')
var async = require('async')
var os = require("os");
var config = require('./config.json');

var hostname = process.argv[2].split(".", 2);

workerID=hostname[0];
region=hostname[1];

var subscribe = function(subID) {
  return function (callback) {
    const subscriber = workerID + '_' + subID;
    const logStatus = (msg) => {
      const now = (new Date()).toISOString();
      console.log(now + ' ' + region + ' ' + subscriber + ' ' + msg);
    }

    const ably = new Ably.Realtime({
      key: config.key,
      environment: config.environment,
      useTokenAuth: true,
      // defaults to 1. Can increase for debugging purposes
      //{ log: { level: 4 } }
    });

    ably.connection.on((stateChange) => {
      logStatus("connection state: " + stateChange.current);
    });

    const channel = ably.channels.get("test");
    channel.attach((err) => {
      if(err) {
        logStatus('Attach error: ' + err.toString());
      } else {
        logStatus('Channel attached');
        channel.subscribe((message) => {
          const now = new Date();
          const sent = new Date(message.data.Date);
          const diff = now - sent;

          console.log(message.data.Date + ' ' + subscriber +
            ' ' + message.data['E-Tag'] + ' ' + message.data.Status +
            ' ' + diff);
        });
        callback(null, subscriber + ' subscribed');
      }
    });

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
      //console.log((new Date()).toISOString() + ' ' + region + ' ' + result )
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
