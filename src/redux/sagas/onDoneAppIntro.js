import { put, take } from 'redux-saga/effects'

import EventLog from '../../modules/eventlog'
import actions from '../actions'
import types from '../types'

function* onDoneAppIntro() {
	while (true) {
		yield take(types.ON_DONE_INTRO)
		try {
			EventLog.info('done app intro')
			yield put(actions.isShowingIntro(false))
			yield put(actions.runMessage('START'))
		} catch (err) {
			console.error('[onDoneAppIntro] ', err)
			EventLog.error('done app intro', {
				message: err.message
			})
		}
	}
}

export default onDoneAppIntro
