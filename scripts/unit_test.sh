#!/bin/bash -ex

if [[ $1 = "watch" ]]; then
    ./node_modules/.bin/karma start test/karma.conf.js
elif [[ $1 = "coverage" ]]; then
    rm -rf test/coverage/
    grunt test:coverage
    open test/coverage/PhantomJS\ 2.1.1\ \(Mac\ OS\ X\ 0.0.0\)/index.html
else
    grunt test
fi
