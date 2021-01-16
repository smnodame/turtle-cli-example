import * as apis from '../apis'

import { call, put, take } from 'redux-saga/effects'
import cacheImages from '../../utils/cacheImages'
import EventLog from '../../modules/eventlog'
import _ from 'lodash'
import actions from '../actions'
import changeBrowserTitle from './changeBrowserTitle'
import conf from '../../conf'
import { featureFlags } from '../../constants'
import registerCollectorAccount from './registerCollectorAccount'
import splashscreen from 'react-native-splash-screen'
import subscribeChat from './subscribeChat'
import types from '../types'

function* fetchRequireDataSaga() {
	while (true) {
		yield take(types.FETCH_REQUIRE_DATA)
		try {
			yield* registerCollectorAccount()

			if (conf.MODE === 'FULL-PREVIEW' || conf.MODE === 'TEMPLATE-PREVIEW') {
				yield put(actions.accessToken(conf.ACCESS_TOKEN))
			}

			const config = yield call(apis.fetchMessageConfig)
			const steps = config.steps.reduce((old, obj) => {
				return {
					...old,
					[obj.id]: {
						...obj,
					},
				}
			}, {})
			const {
				app,
				start_over: startOver,
				design,
				typing_emulation: typingEmulation,
				variables
			} = yield call(apis.fetchAppDetail)
			const credentials = yield call(apis.fetchCredentials)
			yield put(actions.design(design))
			yield put(actions.credentials(credentials))
			yield put(actions.typingEmulation(typingEmulation))

			const images = [
				design.splash?.custom?.logo,
				design.colors?.background?.video?.video,
				design.colors?.background?.image?.mobile,
				design.colors?.background?.image?.desktop
			].filter((value) => value)

			const cacheImagesPromise = () => {
				return Promise.all(cacheImages(images))
			}

			yield call(cacheImagesPromise)

			const transformVariables = Object.values(variables).reduce((o, variable) => {
				return {
					...o,
					[variable.nodeId]: [
						...(_.get(o, variable.nodeId, [])),
						variable
					]
				}
			}, {})

			yield put(actions.variables(transformVariables))

			if (conf.MODE === 'MOBILE' || conf.MODE === 'FULL-CHATBOT') {
				const response = yield call(
					apis.createNewResponse,
					conf.APP_SLUG
				)
				const { room_id: roomId, user_id: userId } = response
				yield put(actions.response(response))

				// subscribe chat only when app has enabled this feature
				if (app.feature_flags.includes(featureFlags.chat)) {
					yield call(subscribeChat, userId, roomId)
				}
			}

			yield put(actions.app(app))
			yield put(actions.startOver(startOver))
			yield put(
				actions.updateBot({
					name: app.name,
					avatar: app.icon,
				})
			)
			yield put(actions.storeSteps(steps))
			yield put(actions.isLoadingRequireData(false))
			yield call(splashscreen.hideAsync)

			/** should present intro for first access app */
			if (steps['INTRO']) {
				yield put(actions.appIntro(steps['INTRO']))
				yield put(actions.isShowingIntro(true))
			} else {
				yield put(actions.isShowingIntro(false))
				yield put(actions.runMessage('START'))
			}

			// clear app error
			yield put(actions.startAppError())
			changeBrowserTitle(app)
		} catch (err) {
			console.error('[fetchRequireData]', err)
			EventLog.error('fetch require data', {
				message: err.message
			})
			yield put(actions.startAppError(err))
			yield put(actions.isLoadingRequireData(false))
			yield call(splashscreen.hideAsync)
		}
	}
}

export default fetchRequireDataSaga
