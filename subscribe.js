var PubNub = require('pubnub')

function publish() {

	 pubnub = new PubNub({
	 publishKey : 'demo',
	 subscribeKey : 'demo'
	 })

	function publishSampleMessage() {
		console
				.log("Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish.");
		var publishConfig = {
			channel : "hello_world",
			message : "Hello from PubNub Docs!"
		}
		pubnub.publish(publishConfig, function(status, response) {
			console.log(status, response);
		})
	}

	pubnub.addListener({
		status : function(statusEvent) {
			if (statusEvent.category === "PNConnectedCategory") {
				publishSampleMessage();
			}
		},
		message : function(message) {
			console.log("New Message!!", message);
		},
		presence : function(presenceEvent) {
			// handle presence
		}
	})

	console.log("Subscribing..");
	pubnub.subscribe({
		channels : [ 'hello_world' ]
	});
};

if (require.main === module) {
	publish();
} else {
	console.log('please start via node subscribe.js');
}
