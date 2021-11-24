export default {
    name: 'test',
    slug: 'test',
    platforms: [
        'ios',
        'android',
        'web'
    ],
    version: '1.0.6',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor:  '#FFFFFF',
    },
    updates: {
        fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
        '**/*'
    ],
    ios: {
        bundleIdentifier: 'com.yourcompany.yourappname',
        buildNumber: '1.0.0'
    },
    android: {
        package: 'com.yourcompany.yourappname',
        versionCode: 1
    },
}
  