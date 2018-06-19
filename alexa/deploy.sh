#!/bin/bash
echo 0
nodejs generate.js > models/en-US.json
echo 1
cp models/en-US.json  models/en-AU.json
echo 2
cp models/en-US.json models/en-CA.json
echo 3
cp models/en-US.json  models/en-GB.json

echo "gen done"
ask deploy
echo "deployed"
