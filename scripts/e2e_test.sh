#/bin/sh -ex
#test e2e against live prod

grunt test:build
grunt test:build:e2e --baseUrl "$1" --tags "$2" --seleniumAddress "$3"