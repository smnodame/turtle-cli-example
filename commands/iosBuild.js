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
        const { stdout, stderr } = await execAsync(`turtle build:ios  --team-id ${config.EXPO_APPLE_TEAM_ID} --dist-p12-path ${p12FilePath} --provisioning-profile-path ${mobileprovisionFilePath} -o ${ipaFilePath}`, {
            env: {
                ...process.env,
                ...config
            }
        })

        console.info('Turtle build output')
        console.info(stdout)

        if (stderr) {
            console.error('Turtle build error')
            console.error(stderr)
            throw new Error(stderr)
        }

        // workaround to check the error from turtle build
        if (stdout.includes('Failed to build standalone app')) {
            const errMessage = stdout.split('\n')[1].trim().split(':').splice(1).join('')
            throw new Error(errMessage)
        }
    } catch(err) {
        await us.updateStatus('FAILED', err.message)
        process.exitCode = 1
    }
}

if (require.main === module) {
    iosBuild()
} 