#!/bin/bash

for pid in `ps -ef | grep subscribe.js | grep -v grep | awk '{print $2}'`; do
  echo "killing $pid"
  kill -9 $pid &
done
