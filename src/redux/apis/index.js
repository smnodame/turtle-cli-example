import * as mime from 'react-native-mime-types'
import Constants from 'react-native-constants'
import { catchHandler, responseHandler } from './handler'
import { Platform } from 'react-native'
import CryptoJS from 'react-native-crypto-js'
import conf from '../../conf'
import futch from '../../utils/futch'
import uniqid from '../../utils/uniqid'

export const createNewResponse = async (appId, answers) => {
	return fetch(`${conf.API_BASE_URL}/api/apps/${appId}/responses`, {
		headers: {
			'Content-Type': 'text/plain',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION,
			...(Platform.OS !== 'web' ? { 
				'User-Agent': await Constants.getWebViewUserAgentAsync(),
				'X-NativeBuildVersion': await Constants.nativeBuildVersion,
				'X-DeviceId': await Constants.installationId,
			} : {
				'X-DeviceId': conf.DEVICE_ID
			})
		},
		method: 'POST',
		body: CryptoJS.AES.encrypt(
			JSON.stringify({
				answers
			}),
			conf.ACCESS_TOKEN
		).toString(),
	})
		.then(responseHandler)
		.catch(catchHandler)
}

export const submitChargeOmise = (amount, currency, token, keyHash) => {
	return fetch(`${conf.API_BASE_URL}/api/apps/${conf.APP_SLUG}/omise`, {
		headers: {
			'Content-Type': 'text/plain',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
		method: 'POST',
		body: CryptoJS.AES.encrypt(
			JSON.stringify({
				amount: amount,
				currency: currency,
				token: token,
				keyHash: keyHash,
			}),
			conf.ACCESS_TOKEN
		).toString(),
	})
		.then(responseHandler)
		.catch(catchHandler)
}

export const requestProducts = (products) => {
	return fetch(`${conf.API_BASE_URL}/api/apps/${conf.APP_SLUG}/request-products`, {
		headers: {
			'Content-Type': 'text/plain',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
		method: 'POST',
		body: CryptoJS.AES.encrypt(
			JSON.stringify(products),
			conf.ACCESS_TOKEN
		).toString(),
	})
		.then(responseHandler)
		.catch(catchHandler)
}

export const updateResponseAnswer = (slug, answer) => {
	return fetch(`${conf.API_BASE_URL}/api/apps/${conf.APP_SLUG}/responses/${slug}/answer`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
		method: 'POST',
		body: CryptoJS.AES.encrypt(JSON.stringify(answer), conf.ACCESS_TOKEN).toString(),
	}).then((response) => response.json())
}

export const addToCart = (slug, productId) => {
	return fetch(`${conf.API_BASE_URL}/api/apps/${conf.APP_SLUG}/responses/${slug}/products/${productId}`, {
		headers: {
			'Content-Type': 'text/plain',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
		method: 'POST',
		body: CryptoJS.AES.encrypt(JSON.stringify({}), conf.ACCESS_TOKEN).toString(),
	}).then((response) => response.json())
}

export const removeFromCart = (slug, productId) => {
	return fetch(`${conf.API_BASE_URL}/api/apps/${conf.APP_SLUG}/responses/${slug}/products/${productId}`, {
		headers: {
			'Content-Type': 'text/plain',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
		method: 'DELETE',
		body: CryptoJS.AES.encrypt(JSON.stringify({}), conf.ACCESS_TOKEN).toString(),
	}).then((response) => response.json())
}

export const updateResponseStatus = (slug, status) => {
	return fetch(`${conf.API_BASE_URL}/api/apps/${conf.APP_SLUG}/responses/${slug}/status`, {
		headers: {
			'Content-Type': 'text/plain',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
		method: 'PUT',
		body: CryptoJS.AES.encrypt(
			JSON.stringify({
				status,
			}),
			conf.ACCESS_TOKEN
		).toString(),
	}).then((response) => response.json())
}

export const fetchDesign = () => {
	return fetch(`${conf.API_BASE_URL}/api/apps/${conf.APP_SLUG}/design`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
	})
		.then(responseHandler)
		.catch(catchHandler)
}

export const fetchApp = () => {
	return fetch(`${conf.API_BASE_URL}/api/apps/${conf.APP_SLUG}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
	})
		.then(responseHandler)
		.catch(catchHandler)
}

export const eCommerceConfig = () => {
	return fetch(`${conf.API_BASE_URL}/api/apps/${conf.APP_SLUG}/ecommerce-config`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
	})
		.then(responseHandler)
		.catch(catchHandler)
}

export const fetchAppDetail = () => {
	return fetch(`${conf.API_BASE_URL}/api/apps/${conf.APP_SLUG}/detail`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
	})
		.then(responseHandler)
		.catch(catchHandler)
}

export const fetchConfig = (appId) => {
	return fetch(`${conf.API_BASE_URL}/api/apps/${appId}/message`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
	}).then((response) => response.json())
}

export const fetchStartOver = () => {
	return fetch(`${conf.API_BASE_URL}/api/apps/${conf.APP_SLUG}/start-over`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
	}).then(
		(response) => {
			return response.json()
		},
		(err) => {
			return {
				title: 'WANT TO START OVER?',
				description: 'This will clear your answers and start again from the beginning.',
				cancel: 'CANCEL',
				confirm: 'START OVER',
			}
		}
	)
}

export const directions = (origin, destination, apiKey) => {
	return webhook({
		url: `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&key=${apiKey}`,
		method: 'POST',
	})
}

export const nearbysearch = (coords, redius, placeTypes, apiKey) => {
	return webhook({
		url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords.latitude},${coords.longitude}&radius=${redius}&type=${placeTypes}&key=${apiKey}`,
		method: 'POST',
	})
}

export const findplacefromtext = (filter, redius, coords, apiKey) => {
	return webhook({
		url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${filter}&inputtype=textquery&fields=photos,formatted_address,name,place_id,icon,geometry&locationbias=circle:${
			redius * 2
		}@${coords.latitude},${coords.longitude}&key=${apiKey}`,
		method: 'POST',
	})
}

export const fetchCredentials = async () => {
	return fetch(`${conf.API_BASE_URL}/api/credentials`, {
		headers: {
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
	})
		.then(responseHandler)
		.catch(catchHandler)
}

export const webhook = (payload) => {
	return fetch(`${conf.API_BASE_URL}/api/webhook`, {
		headers: {
			'Content-Type': 'text/plain',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
		method: 'POST',
		body: CryptoJS.AES.encrypt(
			JSON.stringify({
				method: payload.method,
				url: payload.url,
				headers: payload.headers,
				data: payload.data,
				auth: payload.auth,
			}),
			conf.ACCESS_TOKEN
		).toString(),
	}).then((response) => {
		const contentType = response.headers.get('content-type')
		if (response.ok) {
			const clonedResponse = response.clone()
			if (contentType.indexOf('application/json') !== -1) {
				return response
					.json()
					.then((json) => {
						try {
							return typeof json === 'object' ? json : JSON.parse(json)
						} catch (error) {
							throw error
						}
					})
					.catch(function (error) {
						return clonedResponse.text()
					})
			} else {
				return response.text()
			}
		}
		return response.text().then((error) => Promise.reject(error))
	})
}

export const uploadBlob = async (url, progressCallback = () => {}) => {
	const blob = await fetch(url).then((res) => res.blob())
	const bodyFormData = new FormData()
	bodyFormData.append('file', blob, `${uniqid()}`)
	return futch(
		`${conf.API_BASE_URL}/api/upload-file`,
		{
			method: 'POST',
			body: bodyFormData,
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
				'X-Version': conf.VERSION
			},
		},
		(progressEvent) => {
			const progress = progressEvent.loaded / progressEvent.total
			progressCallback(progress)
		}
	).then((res) => {
		return JSON.parse(res.response)
	})
}

export const uploadFile = async (file, progressCallback = () => {}) => {
	const bodyFormData = new FormData()
	bodyFormData.append('file', {
		uri: file,
		type: mime.lookup(file),
		name: file.substring(file.lastIndexOf('/') + 1),
	})
	return futch(
		`${conf.API_BASE_URL}/api/upload-file`,
		{
			method: 'POST',
			body: bodyFormData,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
				'X-Version': conf.VERSION
			},
		},
		(progressEvent) => {
			const progress = progressEvent.loaded / progressEvent.total
			progressCallback(progress)
		}
	).then((res) => {
		return JSON.parse(res.response)
	})
}

export const sendRequestSMTP = (payload) => {
	return fetch(`${conf.API_BASE_URL}/api/send-smtp`, {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
		body: CryptoJS.AES.encrypt(JSON.stringify(payload), conf.ACCESS_TOKEN).toString(),
	})
		.then((response) => response.json())
		.catch((err) => err)
}

export const humanTakeover = (roomId) => {
	return fetch(`${conf.API_BASE_URL}/chat/apps/${conf.APP_SLUG}/rooms/${roomId}/human-takeover`, {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
		body: CryptoJS.AES.encrypt(JSON.stringify({}), conf.ACCESS_TOKEN).toString(),
	})
		.then((response) => response.json())
		.catch((err) => err)
}

export const createMessengerRoom = (payload) => {
	return fetch(`${conf.API_BASE_URL}/chat/apps/${conf.APP_SLUG}/rooms`, {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
		body: CryptoJS.AES.encrypt(JSON.stringify(payload), conf.ACCESS_TOKEN).toString(),
	})
		.then((response) => response.json())
		.catch((err) => err)
		.catch(catchHandler)
}

export const sendMessage = (message, roomId) => {
	return fetch(`${conf.API_BASE_URL}/chat/apps/${conf.APP_SLUG}/rooms/${roomId}/send`, {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
		body: CryptoJS.AES.encrypt(JSON.stringify(message), conf.ACCESS_TOKEN).toString(),
	})
		.then(responseHandler)
		.catch(catchHandler)
}

export const pusherAuth = () => `${conf.API_BASE_URL}/chat/apps/${conf.APP_SLUG}/auth`

export const fetchNewerMessages = (roomId, fromId) => {
	return fetch(
		`${conf.API_BASE_URL}/chat/apps/${conf.APP_SLUG}/rooms/${roomId}/messages?direction=newer&from_id=${fromId}&limit=999999`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
				'X-Version': conf.VERSION
			},
		}
	)
		.then(responseHandler)
		.catch(catchHandler)
}

export const fetchHumantakeoverQueues = (roomId) => {
	return fetch(
		`${conf.API_BASE_URL}/chat/apps/${conf.APP_SLUG}/rooms/${roomId}/queues`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
				'X-Version': conf.VERSION
			},
		}
	)
		.then(responseHandler)
		.catch((e) => {
			return {}
		})
}


export const validateDistributeToken = () => {
	return fetch(
		`${conf.API_BASE_URL}/api/token`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${conf.DISTRIBUTE_TOKEN}`,
				'X-Version': conf.VERSION
			},
		}
	)
		.then(responseHandler)
		.catch(catchHandler)
}

export const registerCollectorAccount = () => {
	return fetch(`${conf.API_BASE_URL}/api/collector-registration?token=${conf.DISTRIBUTE_TOKEN}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-Version': conf.VERSION
		},
	})
		.then(responseHandler)
		.catch(catchHandler)
}

export const fetchSpreadsheetData = (spreadsheetId, sheetId) => {
	if (!spreadsheetId) {
		return new Promise((resolve) => resolve([]))
	}

	if (sheetId) {
		return fetch(
			`${conf.API_BASE_URL}/api/apps/${conf.APP_SLUG}/spreadsheets/${spreadsheetId}/sheets/${sheetId}/data`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
					'X-Version': conf.VERSION
				},
			}
		).then((response) => response.json())
	}

	return fetch(`${conf.API_BASE_URL}/api/apps/${conf.APP_SLUG}/spreadsheets/${spreadsheetId}/data`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
	})
		.then(responseHandler)
		.catch(catchHandler)
}

export const fetchMessageConfig = () => {
	return fetch(`${conf.API_BASE_URL}/api/apps/${conf.APP_SLUG}/${conf.MODE === 'FULL-PREVIEW' ? 'preview-message' : 'message'}`, {
		headers: {
			Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			'X-Version': conf.VERSION
		},
	})
		.then(responseHandler)
		.then((data) => {
			return {
				steps: [...data.messages],
			}
		})
		.catch(catchHandler)
}
