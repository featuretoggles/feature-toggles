#!/bin/bash
yarn build:only
rd="$PWD/lib/tools/transforms"
rf="$rd/__tests__ $rd/__testfixtures__"
while (rm -rf $rf) 2> /dev/null; [ $? -ne 0 ]; do sleep 1; done

