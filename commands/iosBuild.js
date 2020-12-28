const config = require('../config.json')
const us = require('./updateStatus')
const util = require('util')
const fs = require('fs')
const child_process = require('child_process')

const execAsync = util.promisify(child_process.exec)
const writeFile = util.promisify(fs.writeFile)

async function iosBuild() {
    try {
        const ipaFilePath = '~/expo-project.ipa'
        const p12FilePath = './/expo-project_dist.p12'
        const mobileprovisionFilePath = './expo-project.mobileprovision'

        await us.updateStatus('BUILDING')
        await writeFile(p12FilePath, config.EXPO_IOS_DIST_P12_BASE64, { encoding: 'base64' })
        await writeFile(mobileprovisionFilePath, config.EXPO_IOS_PROVISIONING_PROFILE_BASE64, { encoding: 'base64' })
        await execAsync(`turtle build:ios  --team-id ${config.EXPO_APPLE_TEAM_ID} --dist-p12-path ${p12FilePath} --provisioning-profile-path ${mobileprovisionFilePath} -o ${ipaFilePath}`)
    } catch {
        await us.updateStatus('FAILED')
    }
}

if (require.main === module) {
    iosBuild()
} 