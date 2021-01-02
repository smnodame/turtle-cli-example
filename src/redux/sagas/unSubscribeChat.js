import * as selectors from '../selectors'

import { select, take } from 'redux-saga/effects'

import types from '../types'

function* unSubscribeChat() {
	while (true) {
		const {
			payload: { roomId },
		} = yield take(types.UNSUBSCRIBE_CHAT)
		try {
			const pusher = yield select(selectors.getPusherManager)
			pusher.unsubscribe(roomId)
		} catch (err) {
			console.error('[unSubscribeChat] ', err)
		}
	}
}

export default unSubscribeChat
