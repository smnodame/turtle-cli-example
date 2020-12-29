const config = require('../config.json')
const us = require('./updateStatus')
const util = require('util')
const fs = require('fs')
const uf = require('./uploadFile')
const child_process = require('child_process')

const execAsync = util.promisify(child_process.exec)
const writeFile = util.promisify(fs.writeFile)

async function androidBuild() {
    try {
        const apkFilePath = '~/expo-project.apk'
        const jksFilePath = './expo-project.jks'

        await us.updateStatus('BUILDING')
        await writeFile(jksFilePath, config.EXPO_ANDROID_KEYSTORE_BASE64, { encoding: 'base64' })
        const { stdout, stderr } = await execAsync(`turtle build:android --keystore-path ${jksFilePath} --keystore-alias ${config.EXPO_ANDROID_KEYSTORE_ALIAS} --type apk -o ${apkFilePath}`)
        // workaround to check the error from turtle build
        if (stdout.includes('Failed to build standalone app')) {
            const errMessage = stdout.split('\n')[1].trim().split(':').splice(1).join('')
            throw new Error(errMessage)
        }

        if (stderr) {
            console.error('turtle build error')
            console.error(stderr)
            throw new Error(stderr)
        }
        
        console.info('Turtle build output')
        console.info(stdout)
    } catch (err) {
        await us.updateStatus('FAILED', err.message)
        process.exitCode = 1
    }
}

if (require.main === module) {
    androidBuild()
}