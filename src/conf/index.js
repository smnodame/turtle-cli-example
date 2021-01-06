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
			this.API_BASE_URL = process.env.REACT_APP_API_BASE_URL
			this.DISTRIBUTE_TOKEN = params.token
			this.ACCESS_TOKEN = params.token
			this.APP_SLUG = params.app_slug // in case of preview and template, need to get app slug from query params
		} else {
			this.MODE = 'MOBILE'
			this.API_BASE_URL = Constants.manifest.extra.apiBaseUrl
			this.DISTRIBUTE_TOKEN = Constants.manifest.extra.token
			this.ACCESS_TOKEN = ''
			this.ENV = Constants.manifest.extra.env
			this.VERSION = Constants.manifest.extra.version
			this.APP_SLUG = '<fetch from backend>'
		}
	}

	set(key, value) {
		this[key] = value
	}

	get(key) {
		return this[key]
	}
}

var config = new Config()

export default config
