import * as apis from '../apis'
import * as selectors from '../selectors'

import { call, put, select, take } from 'redux-saga/effects'

import EventLog from '../../modules/eventlog'
import actions from '../actions'
import types from '../types'

function* onSendMsgToHuman() {
	while (true) {
		const {
			payload: { data },
		} = yield take(types.ON_SEND_MSG_TO_HUMAN)
		const id = new Date().getTime()
		const message = {
			_id: id,
			id: id,
			createdAt: new Date(),
			user: {
				_id: 1,
				id: 1,
			},
			question: {},
			loaded: true,
			...data,
		}

		try {
			EventLog.info('send message to human')
			yield put(actions.setDirtyResponse())
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
				[message.id]: {
					...message,
				},
				...loadedMessages,
			}
			yield put(actions.messages(newMessages))
			const { room_id: roomId } = yield select(selectors.getResponse)
			yield call(apis.sendMessage, message, roomId)
		} catch (err) {
			const failedMessages = yield select(selectors.getFailedMessages)
			EventLog.error('send message to human', {
				message: err.message
			})
			yield put(
				actions.failedMessages({
					...failedMessages,
					[id]: {
						...message,
					},
				})
			)
		}
	}
}

export default onSendMsgToHuman
