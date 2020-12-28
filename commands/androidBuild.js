const config = require('../config.json')
const us = require('./updateStatus')
const util = require('util')
const fs = require('fs')
const uf = require('./uploadFile')
const child_process = 'child_process'

const execAsync = util.promisify(child_process.exec)
const writeFile = util.promisify(fs.writeFile)

async function androidBuild() {
    try {
        const apkFilePath = '~/expo-project.apk'
        const jksFilePath = './expo-project.jks'

        await us.updateStatus('BUILDING')
        await writeFile(jksFilePath, config.EXPO_ANDROID_KEYSTORE_BASE64, { encoding: 'base64' })
        await execAsync(`turtle build:android --keystore-path ${jksFilePath} --keystore-alias ${config.EXPO_ANDROID_KEYSTORE_ALIAS} --type apk -o ${apkFilePath}`)
    } catch {
        await us.updateStatus('FAILED')
    }
}

if (require.main === module) {
    androidBuild()
} 