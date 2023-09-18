import 'dotenv/config'

const fs = require('fs')
const dotenv = require('dotenv')

const env = process.env.ENV || 'production' 

const envConfig = dotenv.parse(fs.readFileSync(`.env.${env}`))
for (const k in envConfig) {
  process.env[k] = envConfig[k]
}

export default {
    name: process.env.REACT_APP_NAME,
    slug: process.env.REACT_APP_SLUG,
    platforms: [
        'ios',
        'android',
        'web'
    ],
    version: process.env.REACT_APP_VERSION,
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor:  process.env.REACT_APP_SPLASH_COLOR || '#FFFFFF',
    },
    updates: {
        fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
        '**/*'
    ],
    ios: {
        bundleIdentifier: process.env.REACT_APP_IOS_BUNDLE_IDENTIFIER || 'com.yourcompany.yourappname',
        buildNumber: '1.0.0'
    },
    android: {
        package: process.env.REACT_APP_ANDROID_PACKAGE || 'com.yourcompany.yourappname',
        versionCode: 1
    },
    extra: {
        version: process.env.REACT_APP_VERSION,
        env: process.env.ENV,
        apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
        appHost: process.env.REACT_APP_DOMAIN,
        appProtocal: process.env.REACT_APP_PROTOCAL,
        token: process.env.REACT_APP_TOKEN
    },
}
  