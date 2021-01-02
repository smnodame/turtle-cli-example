import * as apis from '../apis'
import * as selectors from '../selectors'

import { call, put, select, take } from 'redux-saga/effects'

import EventLog from '../../modules/eventlog'
import actions from '../actions'
import types from '../types'

function* retryErrorMessage() {
	while (true) {
		yield take(types.RETRY_ERROR_MESSAGE)
		try {
			EventLog.info('retry the error message')
			yield put(actions.retryingErrorMessage(true))
			const failedMessages = yield select(selectors.getFailedMessages)

			const firstKey = Object.keys(failedMessages)[0]
			const failedMessage = failedMessages[firstKey]

			const { room_id: roomId } = yield select(selectors.getResponse)
			yield call(apis.sendMessage, failedMessage, roomId)

			delete failedMessages[firstKey]
			yield put(
				actions.failedMessages({
					...failedMessages,
				})
			)

			yield put(actions.retryingErrorMessage(false))
			const nextMessage = yield select(selectors.getNextMessage)
			if (nextMessage) {
				yield put(actions.runMessage(nextMessage.trigger, nextMessage.index))
			}
		} catch (err) {
			console.error('[retryErrorMessage] ', err)
			yield put(actions.retryingErrorMessage(false))
			EventLog.error('retry error message', {
				message: err.message
			})
		}
	}
}

export default retryErrorMessage
