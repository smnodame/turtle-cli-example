import storage from 'react-native-storage'
import { v4 as uuidv4, validate as uuidValidate } from 'uuid'
import conf from '../../conf'
import CryptoJS from 'react-native-crypto-js'
import { Platform } from 'react-native'

const hashkey = '<change this>'

async function generateDeviceId() {
    try {
        // no need to generate for mobile because it will use from Constants.installationId
        if (Platform.OS !== 'web') return

        const devicehash = await storage.getItem('device_id')
        let deviceId = ''
        if (!devicehash) {
            deviceId = uuidv4()
            const newDeviceHash = CryptoJS.AES.encrypt(deviceId, hashkey).toString()
            await storage.setItem('device_id', newDeviceHash)
        } else {
            deviceId = CryptoJS.AES.decrypt(devicehash, hashkey).toString(CryptoJS.enc.Utf8)
            if (!uuidValidate(deviceId)) {
                throw new Error('invalid device id format')
            }
        }
        conf.set('DEVICE_ID', deviceId)
        return
    } catch (err) {
        console.error('[generateDeviceId] ', err)
        throw err
    }
}

export default generateDeviceId