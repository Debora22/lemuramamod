#!/bin/bash -ex

if [[ $1 = "coverage" ]]; then
    grunt karma:coverage
    open coverage/PhantomJS\ 2.1.1\ \(Mac\ OS\ X\ 0.0.0\)/index.html
elif [[ $1 = "watch" ]]; then
    grunt karma:watch
elif [[ $1 = "precommit" ]]; then
    grunt karma:precommit
else
    grunt karma:default
fi
