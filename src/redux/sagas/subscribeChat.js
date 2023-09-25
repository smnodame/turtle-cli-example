import * as apis from '../apis'
import * as selectors from '../selectors'

import CryptoJS from 'crypto-js'
import Pusher from 'react-native-pusher-js'
import actions from '../actions'
import bindWithChunking from '../../utils/pusher'
import conf from '../../conf'
import { store } from '../index'

async function subscribeChat(userId, roomId) {
	const credentials = selectors.getCredentials(store.getState())
	const response = selectors.getResponse(store.getState())
	var pusher = new Pusher(credentials.pusher.key, {
		cluster: credentials.pusher.cluster,
		forceTLS: true,
		authEndpoint: apis.pusherAuth(),
		auth: {
			headers: {
				Authorization: `Bearer ${conf.ACCESS_TOKEN}`,
			},
			params: {
				id: `${roomId}`,
			},
		},
	})

	var presence = pusher.subscribe(`presence-${roomId}`)

	presence.bind('pusher:subscription_succeeded', function (members) {
		console.info('subscribe presence successfully')
	})

	store.dispatch(actions.pusherManager(pusher))

	var appChannel = pusher.subscribe(response.app_id)
	bindWithChunking(appChannel, 'human-takeover-queues', function (responseData) {
		var data = CryptoJS.AES.decrypt(responseData, response.app_id).toString()
		data = JSON.parse(CryptoJS.enc.Hex.parse(data).toString(CryptoJS.enc.Utf8))

		store.dispatch(actions.humantakeover(data))
	})

	var channel = pusher.subscribe(roomId)
	bindWithChunking(channel, 'new-message', function (responseData) {
		var message = CryptoJS.AES.decrypt(responseData, roomId).toString()
		message = JSON.parse(CryptoJS.enc.Hex.parse(message).toString(CryptoJS.enc.Utf8))

		if (message.user.id !== 1) {
			const oldMessages = selectors.getMessages(store.getState())

			const loadedMessages = Object.values(oldMessages).reduce((o, n) => {
				return {
					...o,
					[n.id]: {
						...n,
						loaded: true,
					},
				}
			}, {})

			const bot = selectors.getBot(store.getState())
			if (!loadedMessages[message.id]) {
				store.dispatch(actions.onClearTimeouts())
				const currentQuestion = selectors.getCurrentQuestion(store.getState())
				if (currentQuestion.mode !== 'HUMAN-TAKEOVER') {
					// change question to human take over
					store.dispatch(
						actions.currentQuestion({
							mode: 'HUMAN-TAKEOVER',
						})
					)
				}

				const newMessages = {
					[message.id]: {
						...message,
						loaded: false,
						user: { ...bot, id: 2, _id: 2 },
					},
					...loadedMessages,
				}

				store.dispatch(actions.messages(newMessages))
			}
		}
	})

	bindWithChunking(channel, 'human-takeover-start', function (responseData) {
		var data = CryptoJS.AES.decrypt(responseData, roomId).toString()
		data = JSON.parse(CryptoJS.enc.Hex.parse(data).toString(CryptoJS.enc.Utf8))

		store.dispatch(actions.humantakeover(data))
	})

	bindWithChunking(channel, 'human-takeover-ignore', function (responseData) {
		var data = CryptoJS.AES.decrypt(responseData, roomId).toString()
		data = JSON.parse(CryptoJS.enc.Hex.parse(data).toString(CryptoJS.enc.Utf8))

		store.dispatch(actions.humantakeover(data))
	})

	/**
	 * data is the object that contain roomId and status of human takeover
	 */
	bindWithChunking(channel, 'human-takeover', function (responseData) {
		var data = CryptoJS.AES.decrypt(responseData, roomId).toString()
		data = JSON.parse(CryptoJS.enc.Hex.parse(data).toString(CryptoJS.enc.Utf8))

		const currentQuestion = selectors.getCurrentQuestion(store.getState())
		store.dispatch(actions.currentQuestion({}))
		store.dispatch(actions.runMessage(currentQuestion?.trigger?.right))
	})

	return Promise.resolve(null)
}

export default subscribeChat
