import * as apis from '../apis'
import * as selectors from '../selectors'

import { call, put, select, take } from 'redux-saga/effects'

import EventLog from '../../modules/eventlog'
import actions from '../actions'
import conf from '../../conf'
import types from '../types'

function* uploadAnswerSaga() {
	while (true) {
		const {
			payload: { newAnswer },
		} = yield take(types.ANSWERS)
		try {
			if (conf.MODE === 'MOBILE' || conf.MODE === 'FULL-CHATBOT') {
				const { slug } = yield select(selectors.getResponse)
				yield call(apis.updateResponseAnswer, slug, newAnswer)
				yield put(actions.setDirtyResponse())
			}
		} catch (err) {
			console.error('[uploadAnswerSaga] ', err)
			EventLog.error('upload answer', {
				message: err.message
			})
		}
	}
}

export default uploadAnswerSaga
