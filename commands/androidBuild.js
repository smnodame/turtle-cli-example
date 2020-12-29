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
        if (stderr) {
            console.error('turtle build error')
            console.error(stderr)
            await us.updateStatus('FAILED', stderr)
            throw new Error('Turtle build error')
        }
        console.info('turtle build output')
        console.info(stdout)
    } catch (err) {
        await us.updateStatus('FAILED', err.message)
        throw err
    }
}

if (require.main === module) {
    androidBuild().catch((err) => {
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxx')
        console.log(err)
        process.exit(1)
    })
} 