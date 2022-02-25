#!/bin/bash -ex

# Run the server on port 9003
export PORT=9003
export ENV=test

# Start the local server's script
# we lunch this command in background to continue with the tests;
./scripts/start_server_local.sh &

# Run the e2e test
grunt test:e2e:local --tags "$1" || pkill -lf 'middleware/bin/start.local'

# kill the NodeJS server
pkill -lf 'middleware/bin/start.local'
