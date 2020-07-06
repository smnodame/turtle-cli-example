#!/bin/bash

trap 'catch' ERR

catch() {
    curl -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" --request POST --data "{\"build_id\":\"$BUILD_ID\", \"status\":\"FAILED\"}" $SET_BUILD_STATUS_URL
}

echo $EXPO_ANDROID_KEYSTORE_BASE64 > expo-project.jks.base64
base64 --decode expo-project.jks.base64 > expo-project.jks
turtle build:android \
    --keystore-path ./expo-project.jks \
    --keystore-alias $EXPO_ANDROID_KEYSTORE_ALIAS \
    --type apk \
    -o ~/expo-project.apk
