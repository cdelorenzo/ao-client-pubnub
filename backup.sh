#!/bin/bash

DATE=`date +%Y-%m-%d-%H`
HOST=`hostname`
FILENAME=$HOST-$DATE

pushd /var/log/ausopen/
tar -cvzf $FILENAME.tar.gz /var/log/ausopen/*.log
aws s3 cp $FILENAME.tar.gz s3://$1
popd
