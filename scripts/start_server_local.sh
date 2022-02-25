#!/bin/bash -ex

# run the server on port 9000 by default
PORT=${PORT:-9000}
# use the env var RUN_DEVTOOL to run devtool app
RUNDEVTOOL=${RUN_DEVTOOL}
DEVTOOLSCMD="devtool "
# Grunt task to mock the templates
GRUNTTASK="grunt serve:local; "
# NodeJS Server environment vars
ENV=${ENV:-local}
ENVVARS="PORT=${PORT} NODE_ENV=${ENV} "
# NodeJS Server command
CMD="middleware/bin/start.local"

# should this server use devtool for local debugging ?
if [[ $RUNDEVTOOL = '1' ]]; then
    eval $GRUTNTASK$ENVVARS$DEVTOOLSCMD$CMD
else
    MMCMD=$GRUNTTASK$ENVVARS$CMD
fi
# finally run the command
eval $MMCMD
