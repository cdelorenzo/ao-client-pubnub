# ao-client-pubnub
PubNub MQTT Client Subscriber

## Dependencies
- Requests git
```sh
  sudo yum install git
```

- Requires Node.js to run if installing

```sh
curl --silent --location https://rpm.nodesource.com/setup_6.x | sudo bash -
sudo yum install -y nodejs
```

- Rename config-default.json to config.json
- update the keys prior to running
- update the number of connections and ramp time in seconds
```javascript
{
  "publishKey": "pub-c-xxxxxxxxxxxxxxxxxxxxx",
  "subscribeKey": "sub-c-xxxxxxxxxxxxxxxxxxxxx",
  "connections":"5",
  "ramp":"5"
}
```


## setup

```sh
    git clone https://github.com/cdelorenzo/ao-client-pubnub.git
    cd ao-client-pubnub
    npm install
```

## Execution

```javascript
    node subscribe.js
```
