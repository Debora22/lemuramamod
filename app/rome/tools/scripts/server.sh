#!/bin/bash
if [ -z "${1}" ]; then
open http://localhost:8000/;
else
open http://localhost:8000/${1}/demo;
fi
python -m SimpleHTTPServer
