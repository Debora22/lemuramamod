#!/bin/sh -x

# set -e    # (un) comment this line to enable / disable the tests
./node_modules/.bin/webdriver-manager update
./node_modules/.bin/webdriver-manager start
