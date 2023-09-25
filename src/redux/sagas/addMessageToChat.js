import * as apis from '../apis'
import * as selectors from '../selectors'

import { call, put, select, take } from 'redux-saga/effects'

import EventLog from '../../modules/eventlog'
import actions from '../actions'
import conf from '../../conf'
import types from '../types'
import generateMessageId from '../../utils/generateMessageId'

export function* addMessageToChat(message) {
	const bot = yield select(selectors.getBot)
	const id = generateMessageId()
	const user = message.system
		? { name: 'SYSTEM BOT', _id: 999, id: 999 }
		: { ...bot, id: 2, _id: 2 }
	const newMessage = {
		_id: id,
		id: id,
		createdAt: new Date(),
		user: user,
		loaded: false,
		...message,
	}
	
	try {
		const oldMessages = yield select(selectors.getMessages)
		const loadedMessages = Object.values(oldMessages).reduce((o, n) => {
			return {
				...o,
				[n.id]: {
					...n,
					loaded: true,
				},
			}
		}, {})

		const newMessages = {
			[newMessage.id]: {
				...newMessage,
			},
			...loadedMessages,
		}

		yield put(actions.messages(newMessages))

		// add message to admin (pusher server)
		if (conf.MODE === 'MOBILE' || conf.MODE === 'FULL-CHATBOT') {
			const { room_id: roomId } = yield select(selectors.getResponse)
			yield call(apis.sendMessage, newMessage, roomId)
		}
		return
	} catch (err) {
		console.error('[addMessage]', err)
		const failedMessages = yield select(selectors.getFailedMessages)
		yield put(
			actions.failedMessages({
				...failedMessages,
				[id]: {
					...newMessage,
				},
			})
		)
		return
	}
}

export function* addMessageToChatSaga() {
	while (true) {
		const {
			payload: { message },
		} = yield take(types.ADD_MESSAGE_TO_CHAT)
		try {
			yield* addMessageToChat(message)
		} catch (err) {
			console.error('[addMessageToChatSaga]', err)
			EventLog.error('add message to chat', {
				message: err.message
			})
		}
	}
}
