const config = require('../config.json')
const us = require('./updateStatus')
const util = require('util')
const fs = require('fs')
const child_process = require('child_process')

const execAsync = util.promisify(child_process.exec)
const writeFile = util.promisify(fs.writeFile)

async function iosBuild() {
    try {
        await us.updateStatus('BUILDING')
        
        const setENVScriptPath = '/home/circleci/expo-project/setEnv.sh'
        await appendFileAsync(setENVScriptPath, `echo 'export EXPO_APPLE_TEAM_ID=${config.EXPO_APPLE_TEAM_ID}' >> $BASH_ENV`+ os.EOL)
        await appendFileAsync(setENVScriptPath, `echo 'export EXPO_IOS_DIST_P12_BASE64=${config.EXPO_IOS_DIST_P12_BASE64}' >> $BASH_ENV`+ os.EOL)
        await appendFileAsync(setENVScriptPath, `echo 'export EXPO_IOS_DIST_P12_PASSWORD=${config.EXPO_IOS_DIST_P12_PASSWORD}' >> $BASH_ENV`+ os.EOL)
        await appendFileAsync(setENVScriptPath, `echo 'export EXPO_IOS_PROVISIONING_PROFILE_BASE64=${config.EXPO_IOS_PROVISIONING_PROFILE_BASE64}' >> $BASH_ENV`+ os.EOL)
        await appendFileAsync(setENVScriptPath, `echo 'export EXPO_ENV_FROM=${config.EXPO_ENV_FROM}' >> $BASH_ENV`+ os.EOL)
        await appendFileAsync(setENVScriptPath, `source $BASH_ENV`+ os.EOL)
    } catch(err) {
        await us.updateStatus('FAILED', err.message)
        process.exitCode = 1
    }
}

if (require.main === module) {
    iosBuild()
} 