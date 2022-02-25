#!/bin/bash -e

if [ ! `which sass` ] || [ `sass -v | grep 3.4 -q` ]; then
    echo "Installing SASS...";
    gem install sass || { echo 'Run manually `sudo gem install sass` and try again.' && exit 1; }
else
    sass -v
fi
