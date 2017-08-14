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
	subscribers.push(subscribe);
	//test two connections
	subscribers.push(subscribe);
	async.parallel(subscribers, function(err, result){
		console.log(result)
	})
} else {
	console.log('please start via node subscribe.js');
}
