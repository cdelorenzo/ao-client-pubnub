var PubNub = require('pubnub')
var async = require('async')

//array stack for async parallel
var subscribers = [];

var subscribe = function(callback) {

  pubnub = new PubNub({
    publishKey : 'demo',
    subscribeKey : 'demo'
  })
  
  pubnub.addListener({
    message : function(message) {
      console.log("New Message!!", message);
    }
  })

  console.log("Subscribing..");
  pubnub.subscribe({
    channels : [ 'test' ]
  });

  callback(null,"Array of parallel connections");

};

if (require.main === module) {
  // Number of connections to run on server.
  var connections = 10;
  // Number of seconds to ramp up over.
  var ramp = 5;
  // Concurrent connections attempted per second.
  var rate = Math.ceil(connections / ramp);

  var subscribers = [];

  for (i=0; i < connections; i++) {
	  subscribers.push(subscribe);
  }
  async.parallel(subscribers, function(err, result){
    console.log(result)
  });
} else {
  console.log('please start via node subscribe.js');
}
