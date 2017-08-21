#!/bin/bash

# Example ./run.sh 4

DATE=`date +%Y-%m-%d`
HOST=`hostname`

for ((i=0; i<$1; i++))
do
  $(nohup node subscribe.js $HOST-$i >> /var/log/ausopen/pubnub-$HOST-$i-$DATE.log &)
done
