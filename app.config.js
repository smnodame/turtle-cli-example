import 'dotenv/config'

const fs = require('fs')
const dotenv = require('dotenv')

const env = process.env.ENV || 'production' 

console.info(env)

const envConfig = dotenv.parse(fs.readFileSync(`.env.${env}`))
for (const k in envConfig) {
  process.env[k] = envConfig[k]
}

export default {
    name: process.env.NAME,
    slug: process.env.SLUG,
    platforms: [
        'ios',
        'android',
        'web'
    ],
    version: process.env.VERSION,
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor:  process.env.SPLASH_COLOR || '#FFFFFF',
    },
    updates: {
        fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
        '**/*'
    ],
    ios: {
        bundleIdentifier: process.env.IOS_BUNDLE_IDENTIFIER || 'com.yourcompany.yourappname',
        buildNumber: '1.0.0'
    },
    android: {
        package: process.env.ANDROID_PACKAGE || 'com.yourcompany.yourappname',
        versionCode: 1
    },
    extra: {
        version: process.env.VERSION,
        env: process.env.ENV,
        apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
        appHost: process.env.REACT_APP_HOST,
        appProtocal: process.env.REACT_APP_PROTOCAL,
        token: process.env.TOKEN
    },
}
  