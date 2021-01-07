import * as apis from '../apis'
import * as selectors from '../selectors'

import { call, put, select, take } from 'redux-saga/effects'

import EventLog from '../../modules/eventlog'
import actions from '../actions'
import conf from '../../conf'
import subscribeChat from './subscribeChat'
import types from '../types'

function* onRestart() {
	while (true) {
		yield take(types.RESTART)
		try {
			EventLog.info('restart the app')
			yield put(actions.isRestarting(true))
			yield put(actions.onClearTimeouts())
			yield put(actions.onClearStateWithOutRefresh())

			const appFromBrowser = yield select(selectors.getApp)
			const appFromServer = yield call(apis.fetchApp)
			if (appFromBrowser.updated_at !== appFromServer.updated_at) {
				yield put(actions.isRestarting(false))
				yield put(actions.isLoadingRequireData(true))
				yield put(actions.onClearState())
				yield put(actions.fetchRequireData())
				continue
			}

			if (conf.MODE === 'MOBILE' || conf.MODE === 'FULL-CHATBOT') {
				// unsubscribe the old chat channel
				const roomId = yield select(selectors.getRoomId)
				yield put(actions.unSubscribeChat(roomId))

				const response = yield call(
					apis.createNewResponse,
					conf.APP_SLUG
				)
				const { room_id: newRoomId, user_id: userId } = response
				yield put(actions.response(response))
				yield call(subscribeChat, userId, newRoomId)
			}

			yield put(actions.isRestarting(false))
			yield put(actions.runMessage('START'))
		} catch (err) {
			console.error('[onRestart] ', err)
			yield put(actions.isRestarting(false))
			yield put(actions.startAppError(err))
			EventLog.error('restart app', {
				message: err.message
			})
		}
	}
}

export default onRestart
