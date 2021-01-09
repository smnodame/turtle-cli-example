import * as apis from '../apis'
import * as selectors from '../selectors'

import { call, select, take } from 'redux-saga/effects'

import EventLog from '../../modules/eventlog'
import conf from '../../conf'
import types from '../types'

function* doneCollectData() {
	while (true) {
		yield take(types.DONE)
		try {
			if (conf.MODE === 'MOBILE' || conf.MODE === 'FULL-CHATBOT') {
				EventLog.info('done collecting data')
				const { slug } = yield select(selectors.getResponse)
				yield call(apis.updateResponseStatus, slug, 'FINISHED')
			}
		} catch (err) {
			console.error('[doneCollectData] ', err)
			EventLog.error('done collecting data', {
				message: err.message
			})
		}
	}
}

export default doneCollectData
