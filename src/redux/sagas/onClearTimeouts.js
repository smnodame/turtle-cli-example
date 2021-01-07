import * as selectors from '../selectors'

import { select, take } from 'redux-saga/effects'

import EventLog from '../../modules/eventlog'
import types from '../types'

function* onClearTimeouts() {
	while (true) {
		yield take(types.ON_CLEAR_TIMEOUTS)
		try {
			const timeouts = yield select(selectors.getTimeouts)
			timeouts.forEach((timeout) => {
				clearTimeout(timeout)
			})
		} catch (err) {
			console.error('[onClearTimeouts] ', err)
			EventLog.error('clear timeouts', {
				message: err.message
			})
		}
	}
}

export default onClearTimeouts
