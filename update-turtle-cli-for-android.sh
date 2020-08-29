#!/bin/bash

TAG=${1:-latest}

export TURTLE_VERSION_NEW=`npm show turtle-cli@$TAG version`
export APP_EXPO_SDK_VERSION="37.0.0"
envsubst '${TURTLE_VERSION_NEW} ${APP_EXPO_SDK_VERSION}' < .circleci/android.template.yml > .circleci/config.yml

git add .
git commit -m "update to turtle-cli@$TURTLE_VERSION_NEW"
