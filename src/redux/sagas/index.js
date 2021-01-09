import { addMessageToChatSaga } from './addMessageToChat'
import { all } from 'redux-saga/effects'
import askConfirmRestart from './askConfirmRestart'
import doneCollectData from './doneCollectData'
import fetchRequireData from './fetchRequireData'
import networkDown from './networkDown'
import onClearTimeouts from './onClearTimeouts'
import onDoneAppIntro from './onDoneAppIntro'
import onRestart from './onRestart'
import onSend from './onSend'
import onSendMsgToHuman from './onSendMsgToHuman'
import retryErrorMessage from './retryErrorMessage'
import runMessage from './runMessage'
import startApp from './startApp'
import unSubscribeChat from './unSubscribeChat'
import uploadAnswer from './uploadAnswer'

// single entry point to start all Sagas at once
export default function* rootSaga() {
	yield all([
		addMessageToChatSaga(),
		askConfirmRestart(),
		doneCollectData(),
		fetchRequireData(),
		networkDown(),
		onClearTimeouts(),
		onDoneAppIntro(),
		onRestart(),
		onSend(),
		onSendMsgToHuman(),
		retryErrorMessage(),
		runMessage(),
		startApp(),
		unSubscribeChat(),
		uploadAnswer(),
	])
}
