#!/bin/bash
nodejs generate.js > models/en-US.json
nodejs generate.js > models/en-AU.json
nodejs generate.js > models/en-CA.json
nodejs generate.js > models/en-GB.json
ask deploy
