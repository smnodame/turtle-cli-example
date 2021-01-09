import * as apis from '../apis'

import { call, put } from 'redux-saga/effects'

import EventLog from '../../modules/eventlog'
import actions from '../actions'
import conf from '../../conf'

export default function* registerCollectorAccount() {
	try {
		if (conf.MODE === 'MOBILE' || conf.MODE === 'FULL-CHATBOT') {
			const { 
				token: collectorToken, 
				user_id: userId,
				app: {
					slug: appSlug
				}
			} = yield call(apis.registerCollectorAccount)
			
			conf.set('USER_ID', userId)
			conf.set('ACCESS_TOKEN', collectorToken)
			conf.set('APP_SLUG', appSlug)

			EventLog.addContext('userId', userId)
			EventLog.info('register collector account')
			yield put(actions.accessToken(collectorToken))
		}
	} catch (err) {
		console.error('[registerCollectorAccount]', err)
		EventLog.error('register collector account', {
			message: err.message
		})
	}
}
