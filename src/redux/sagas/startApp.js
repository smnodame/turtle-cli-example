import * as apis from '../apis'
import * as selectors from '../selectors'

import { call, put, select, take } from 'redux-saga/effects'

import EventLog from '../../modules/eventlog'
import actions from '../actions'
import changeBrowserTitle from './changeBrowserTitle'
import conf from '../../conf'
import splashscreen from 'react-native-splash-screen'
import subscribeChat from './subscribeChat'
import types from '../types'
import generateDeviceId from './generateDeviceId'

function* startApp() {
	while (true) {
		yield take(types.START_APP)
		try {
			yield call(generateDeviceId)
			
			const isDirtyResponse = yield select(selectors.getIsDirtyResponse)
			if (
				isDirtyResponse &&
				(conf.MODE === 'MOBILE' || conf.MODE === 'FULL-CHATBOT') &&
				conf.ENV !== 'development'
			) {
				EventLog.info('start with dirty response')
				console.info('[startApp] is dirty response')

				const app = yield select(selectors.getApp)
				const token = yield select(selectors.getAccessToken)

				conf.set('APP_SLUG', app.slug)
				conf.set('ACCESS_TOKEN', token)

				changeBrowserTitle(app)
				const { room_id: roomId, user_id: userId } = yield select(selectors.getResponse)
				const oldMessages = yield select(selectors.getMessages)

				yield put(actions.isLoadingRequireData(true))

				yield call(subscribeChat, userId, roomId)

				const newMessages = yield call(
					apis.fetchNewerMessages,
					roomId,
					Object.keys(oldMessages).sort().reverse()[0]
				)
				const failedMessages = yield select(selectors.getFailedMessages)
				if (Object.keys(failedMessages).length > 0) {
					const firstKey = Object.keys(failedMessages)[0]
					const failedMessage = failedMessages[firstKey]
					yield call(apis.sendMessage, failedMessage, roomId)

					// clear failed message after success
					yield put(actions.failedMessages({}))
				}

				const bot = yield select(selectors.getBot)
				if (newMessages) {
					const newLoadedMessages = Object.values(newMessages).reduce((o, n) => {
						return {
							...o,
							[n.id]: {
								...n,
								loaded: true,
								user: { ...bot, id: 2, _id: 2 },
							},
						}
					}, {})

					yield put(
						actions.messages({
							...newLoadedMessages,
							...oldMessages,
						})
					)
				}

				// clear error
				yield put(actions.startAppError())
				yield call(splashscreen.hideAsync)
				yield put(actions.isLoadingRequireData(false))

				// continue to next message after back from offline
				const nextMessage = yield select(selectors.getNextMessage)
				if (nextMessage) {
					yield put(actions.runMessage(nextMessage.trigger, nextMessage.index))
				}
				continue
			}

			console.log('start app')
			yield put(actions.onClearState())
			yield put(actions.isLoadingRequireData(true))
			yield put(actions.fetchRequireData())
		} catch (err) {
			console.error('[startApp] ', err)
			yield put(actions.startAppError(err))
			yield put(actions.isLoadingRequireData(false))
			yield call(splashscreen.hideAsync)
			EventLog.error('start app', {
				message: err.message
			})
		}
	}
}

export default startApp
