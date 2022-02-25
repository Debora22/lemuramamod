#!/bin/bash
bower install --config.interactive=false

# bower update: this update forces the expansion of bower / johnny versions.
# for example: ~1.0.49 -> 1.0.55 even if package is already installed
# otherwise, it's you have to delete the directories to force bower to update
bower update --force --config.interactive=false johnny
