#!/bin/bash

trap 'catch' ERR

catch() {
    curl -H "Authorization: token" --data "param1=failed" https://webhook.site/cdec8429-eae3-4ca5-93f1-ba2690de2a16
}

echo $EXPO_ANDROID_KEYSTORE_BASE64 > expo-project.jks.base64
base64 --decode expo-project.jks.base64 > expo-project.jks
turtle build:android \
    --keystore-path ./expo-project.jks \
    --keystore-alias $EXPO_ANDROID_KEYSTORE_ALIAS \
    --type apk \
    -o ~/expo-project.apk
