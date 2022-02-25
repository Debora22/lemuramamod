#!/bin/sh -ex

if [ "$NODE_ENV" != "production" ]; then
  bower --config.interactive=false install

  find app/components/jquery-ui/themes -type d \( -not -path "*themes/base*" -and -not -path "*themes/smoothness*" \) -maxdepth 1 -mindepth 1 -exec rm -rf {} \;

  ./node_modules/.bin/webdriver-manager update
fi
