#!/bin/bash

(UI=accounts-ui ./run-tests-for-a-ui-in-console.sh) && \
(UI=iron-routing ./run-tests-for-a-ui-in-console.sh) && \
(UI=flow-routing ./run-tests-for-a-ui-in-console.sh)
