import AgreementApproval from '../../../messages/agreementApproval'
import AmountInputList from '../../../messages/amountInputList'
import AudioRecording from '../../../messages/audioRecording'
import AutoComplete from '../../../messages/autoComplete'
import Button from '../../../messages/button'
import Calendar from '../../../messages/calendar'
import Checkbox from '../../../messages/checkbox'
import File from '../../../messages/file'
import HumanTakeOver from '../../../messages/humanTakeOver'
import ItemLists from '../../../messages/itemList'
import LogIn from '../../../messages/login'
import Map from '../../../messages/map'
import MapDirection from '../../../messages/mapDirection'
import MultiInput from '../../../messages/multiInput'
import Omise from '../../../messages/omise'
import PhotoCamera from '../../../messages/photoCamera'
import QRCode from '../../../messages/qrCode'
import React from 'react'
import RetryErrorMessage from '../../retryErrorMessage'
import Scale from '../../../messages/scale'
import Signature from '../../../messages/signature'
import TextInput from '../../../messages/textinput'
import VideoRecording from '../../../messages/videoRecording'
import { View } from 'react-native'
import YesNo from '../../../messages/yesno'

/**
 * @param {currentQuestion} props
 * @param {onSend} props
 * @param {storeAnswers} props
 * @param {answers} props
 * @param {currentAnswer} props
 * @param {storeCurrentAnswer} props
 */

const CustomActions = (props) => {
	const { currentQuestion, failedMessages, retryErrorMessage, isRetryingErrorMessage } = props

	if (Object.keys(failedMessages).length > 0) {
		return <RetryErrorMessage onRetry={retryErrorMessage} isRetrying={isRetryingErrorMessage} />
	}

	const mode = currentQuestion.mode ? currentQuestion.mode.split('/')[0] : null
	switch (mode) {
		case 'HUMAN-TAKEOVER':
			return <HumanTakeOver {...props} question={currentQuestion} />
		case 'SINGLE-INPUT':
			return <TextInput {...props} question={currentQuestion} />
		case 'APPROVE':
			return <AgreementApproval {...props} question={currentQuestion} />
		case 'BUTTON':
			return <Button {...props} question={currentQuestion} />
		case 'CHECKBOX':
			return <Checkbox {...props} question={currentQuestion} />
		case 'AUDIO-RECORDING':
			return <AudioRecording {...props} question={currentQuestion} />
		case 'SIGNATURE':
			return <Signature {...props} question={currentQuestion} />
		case 'PHOTO-CAMERA':
			return <PhotoCamera {...props} question={currentQuestion} />
		case 'VIDEO-RECORDING':
			return <VideoRecording {...props} question={currentQuestion} />
		case 'ITEM-LISTS':
			return <ItemLists {...props} question={currentQuestion} />
		case 'AUTO-COMPLETE':
			return <AutoComplete {...props} question={currentQuestion} />
		case 'MULTI-INPUT':
			return <MultiInput {...props} question={currentQuestion} />
		case 'MAP':
			return <Map {...props} question={currentQuestion} />
		case 'AMOUNT-INPUT-LISTS':
			return <AmountInputList {...props} question={currentQuestion} />
		case 'CALENDAR':
			return <Calendar {...props} question={currentQuestion} />
		case 'QR-CODE':
			return <QRCode {...props} question={currentQuestion} />
		case 'MAP-DIRECTION':
			return <MapDirection {...props} question={currentQuestion} />
		case 'LOGIN':
			return <LogIn {...props} question={currentQuestion} />
		case 'YESNO':
			return <YesNo {...props} question={currentQuestion} />
		case 'FILE':
			return <File {...props} question={currentQuestion} />
		case 'SCALE':
			return <Scale {...props} question={currentQuestion} />
		case 'OMISE':
			return <Omise {...props} question={currentQuestion} />
		default:
			return <View />
	}
}

export default CustomActions
