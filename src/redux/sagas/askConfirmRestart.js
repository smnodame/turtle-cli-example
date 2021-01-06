import * as selectors from '../selectors'

import { select, take } from 'redux-saga/effects'

import Alert from 'react-native-alert'
import EventLog from '../../modules/eventlog'
import actions from '../actions'
import { store } from '../index'
import types from '../types'

function* askConfirmRestart() {
	while (true) {
		yield take(types.ASK_CONFIRM_RESTART)
		try {
			const startOver = yield select(selectors.getStartOver)
			Alert.alert(
				startOver.title,
				startOver.description,
				[
					{
						text: startOver.cancel,
						onPress: () => {
							EventLog.info('cancel restart over')
						},
					},
					{
						text: startOver.confirm,
						onPress: () => {
							store.dispatch(actions.onRestart())
						},
					},
				],
				{ cancelable: false }
			)
		} catch (err) {
			console.error('[askConfirmRestart] ', err)
			EventLog.error('ask confirm restart', {
				message: err.message
			})
		}
	}
}

export default askConfirmRestart
