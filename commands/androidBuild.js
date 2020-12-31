const config = require('../config.json')
const us = require('./updateStatus')
const util = require('util')
const fs = require('fs')
const os = require('os')

const writeFileAsync = util.promisify(fs.writeFile)
const appendFileAsync = util.promisify(fs.appendFile)

async function androidBuild() {
    try {
        const jksFilePath = '/home/circleci/expo-project.jks'
        const setENVScriptPath = '/home/circleci/expo-project/setEnv.sh'

        await us.updateStatus('BUILDING')
        await writeFileAsync(jksFilePath, config.EXPO_ANDROID_KEYSTORE_BASE64, { encoding: 'base64' })
        
        await appendFileAsync(setENVScriptPath, `echo 'export EXPO_ANDROID_KEYSTORE_ALIAS=${config.EXPO_ANDROID_KEYSTORE_ALIAS}' >> $BASH_ENV`+ os.EOL)
        await appendFileAsync(setENVScriptPath, `echo 'export EXPO_ENV_FROM=${config.EXPO_ENV_FROM}' >> $BASH_ENV`+ os.EOL)
        await appendFileAsync(setENVScriptPath, `echo 'export EXPO_ANDROID_KEYSTORE_PASSWORD=${config.EXPO_ANDROID_KEYSTORE_PASSWORD}' >> $BASH_ENV`+ os.EOL)
        await appendFileAsync(setENVScriptPath, `echo 'export EXPO_ANDROID_KEY_PASSWORD=${config.EXPO_ANDROID_KEY_PASSWORD}' >> $BASH_ENV`+ os.EOL)
        await appendFileAsync(setENVScriptPath, `source $BASH_ENV`+ os.EOL)
    } catch (err) {
        await us.updateStatus('FAILED', err.message)
        process.exitCode = 1
    }
}

if (require.main === module) {
    androidBuild()
}