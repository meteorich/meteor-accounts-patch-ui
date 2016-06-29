#!/bin/bash

export URL='http://localhost:4096/'
coproc meteor test-packages ./ --driver-package test-in-console -p 4096

meteor_line=""
until [ "$meteor_line" == "=> App running at: http://localhost:4096/" ]; do
  read -u ${COPROC[0]} meteor_line
  echo "meteor says: $meteor_line"
done

phantomjs phantom-test-runner.js
STATUS=$?

kill $COPROC_PID
exit $STATUS
