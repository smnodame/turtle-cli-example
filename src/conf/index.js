import Constants from 'react-native-constants'
import { Platform } from 'react-native'
import getParams from '../utils/getParams'

const getModeForWeb = () => {
	switch (window.location.pathname) {
		case '/template':
			return 'TEMPLATE-PREVIEW'
		case '/preview':
			return 'FULL-PREVIEW'
		default:
			return 'FULL-CHATBOT'
	}
}

class Config {
	constructor() {
		if (Platform.OS === 'web') {
			this.ENV = process.env.ENV
			this.VERSION = process.env.VERSION
			const params = getParams(window.location.search)
			this.MODE = getModeForWeb()
			this.APP_HOST = process.env.REACT_APP_HOST
			this.APP_PROTOCAL = process.env.REACT_APP_PROTOCAL
			this.API_BASE_URL = process.env.REACT_APP_API_BASE_URL
			this.DISTRIBUTE_TOKEN = params.token
			this.ACCESS_TOKEN = params.token
			this.DEVICE_ID = '<set from device id>'
			this.APP_SLUG = params.app_slug // in case of preview and template, need to get app slug from query params
			console.info(process.env)
			window.env = process.env
		} else {
			this.MODE = 'MOBILE'
			this.APP_HOST = Constants.manifest.extra.appHost
			this.APP_PROTOCAL = Constants.manifest.extra.appProtocal
			this.API_BASE_URL = Constants.manifest.extra.apiBaseUrl
			this.DISTRIBUTE_TOKEN = Constants.manifest.extra.token
			this.ACCESS_TOKEN = ''
			this.ENV = Constants.manifest.extra.env
			this.VERSION = Constants.manifest.extra.version
			this.DEVICE_ID = '<set from device id>'
			this.APP_SLUG = '<fetch from backend>'
			console.info(Constants.manifest.extra)
		}
	}

	set(key, value) {
		this[key] = value
	}

	get(key) {
		return this[key]
	}
}

const config = new Config()

export default config
