import Alert from 'react-native-alert'
import EventLog from '../../modules/eventlog'
import actions from '../actions'
import { store } from '../index'
import { take } from 'redux-saga/effects'
import types from '../types'

function* networkDown() {
	while (true) {
		yield take(types.NETWORK_DOWN)
		try {
			Alert.alert(
				'Please check your network connection.',
				'',
				[
					{
						text: 'CANCEL',
						onPress: () => {},
					},
					{
						text: 'RETRY',
						onPress: () => {
							store.dispatch(actions.onRestart())
						},
					},
				],
				{ cancelable: false }
			)
			EventLog.info('network down')
		} catch (err) {
			console.error('[networkDown] ', err)
			EventLog.error('network down', {
				message: err.message
			})
		}
	}
}

export default networkDown
