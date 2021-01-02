import * as apis from '../apis'
import * as selectors from '../selectors'

import Pusher from 'react-native-pusher-js'
import actions from '../actions'
import conf from '../../conf'
import { store } from '../index'

async function subscribeChat(userId, roomId) {
	const credentials = selectors.getCredentials(store.getState())
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

	var channel = pusher.subscribe(roomId)
	channel.bind('new-message', function (message) {
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

				// change question to human take over
				store.dispatch(
					actions.currentQuestion({
						mode: 'HUMAN-TAKEOVER',
					})
				)

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

	return Promise.resolve(null)
}

export default subscribeChat
