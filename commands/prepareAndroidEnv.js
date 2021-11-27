const config = require('../config.json')
const us = require('./updateStatus')
const util = require('util')
const fs = require('fs')
const os = require('os')

const appendFileAsync = util.promisify(fs.appendFile)

async function androidBuild() {
    try {
        await us.updateStatus('BUILDING')

        const setENVScriptPath = './setEnv.sh'
        await appendFileAsync(setENVScriptPath, `echo 'export EXPO_ANDROID_KEYSTORE_ALIAS=${config.EXPO_ANDROID_KEYSTORE_ALIAS}' >> $BASH_ENV`+ os.EOL)
        await appendFileAsync(setENVScriptPath, `echo 'export EXPO_ENV_FROM=${config.EXPO_ENV_FROM}' >> $BASH_ENV`+ os.EOL)
        await appendFileAsync(setENVScriptPath, `echo 'export EXPO_ANDROID_KEYSTORE_PASSWORD=${config.EXPO_ANDROID_KEYSTORE_PASSWORD}' >> $BASH_ENV`+ os.EOL)
        await appendFileAsync(setENVScriptPath, `echo 'export EXPO_ANDROID_KEY_PASSWORD=${config.EXPO_ANDROID_KEY_PASSWORD}' >> $BASH_ENV`+ os.EOL)
        await appendFileAsync(setENVScriptPath, `echo 'export EXPO_ANDROID_KEYSTORE_BASE64=${config.EXPO_ANDROID_KEYSTORE_BASE64}' >> $BASH_ENV`+ os.EOL)
        await appendFileAsync(setENVScriptPath, `source $BASH_ENV`+ os.EOL)
    } catch (err) {
        await us.updateStatus('FAILED', err.message)
        process.exitCode = 1
    }
}

if (require.main === module) {
    androidBuild()
}