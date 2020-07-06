echo $EXPO_IOS_DIST_P12_BASE64 > expo-project_dist.p12.base64
base64 --decode expo-project_dist.p12.base64 > expo-project_dist.p12
echo $EXPO_IOS_PROVISIONING_PROFILE_BASE64 > expo-project.mobileprovision.base64
base64 --decode expo-project.mobileprovision.base64 > expo-project.mobileprovision
turtle build:ios \
    --team-id $EXPO_APPLE_TEAM_ID \
    --dist-p12-path ./expo-project_dist.p12 \
    --provisioning-profile-path ./expo-project.mobileprovision \
    -o ~/expo-project.ipa