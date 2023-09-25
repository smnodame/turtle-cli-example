import { Text, TouchableOpacity, View } from 'react-native'

import BarcodeScanner from 'react-native-barcode'
import { ContentHeader } from '../../layout/header'
import Modal from 'react-native-full-modal'
import React from 'react'
import _ from 'lodash'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import generateMessage from '../../utils/generateMessage'
import { setVariables } from '../../modules/setVariables'
import settings from '../../settings'

class QRCode extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			hasCameraPermission: false,
			isShowingPopup: true,
		}
	}

	componentDidMount() {
		this.askForPermission()
	}

	hideModel = () => {
		this.setState(
			{
				isShowingPopup: false,
			},
			this.closeBrowserDevice
		)
	}

	closeBrowserDevice = () => {
		try {
			this.stream.getTracks().forEach((track) => track.stop())
		} catch (err) {
			console.error('[closeBrowserDevice] ', err)
		}
	}

	showModal = () => {
		this.setState({
			isShowingPopup: true,
		})
	}

	askForPermission = () => {
		const { addMessageToChat } = this.props
		if (navigator.getUserMedia) {
			navigator.getUserMedia(
				{ video: true },
				(stream) => {
					this.stream = stream
					if (stream.getVideoTracks().length > 0) {
						this.setState({ hasCameraPermission: true })
					} else {
						this.setState({ hasCameraPermission: false })
						addMessageToChat(
							{},
							settings.permissions[settings.language.selected].NO_CAMERA_PERMISSION
						)
					}
				},
				() => {
					this.setState({ hasCameraPermission: false })
					addMessageToChat(
						{},
						settings.permissions[settings.language.selected].NO_CAMERA_PERMISSION
					)
				}
			)
		} else {
			// if navigator.getUserMedia doesn't exist mean it is running on mobile that not support getUserMedia
			this.setState({ hasCameraPermission: true })
		}
	}

	handleBarCodeScanned = (data) => {
		const { question, answers, storeAnswers, onSend, variables } = this.props

		this.setState(
			{
				show: false,
			},
			() => {
				const answer = {
					[question.id]: {
						answer: {
							data: {
								value: data,
							},
							created_at: {
								value: new Date(),
							},
						},
						mode: question.mode,
					},
				}

				setVariables(question.id, variables, answer)
				
				// store answers in store
				storeAnswers(
					{
						...answers,
						...answer,
					},
					answer
				)

				// generate answer and replace expression
				const message = generateMessage(question.answer || data, answers, answer)

				onSend(
					{
						text: message,
					},
					_.get(question, 'trigger.right')
				)
			}
		)
	}

	render() {
		const { hasCameraPermission, isShowingPopup } = this.state
		if (!hasCameraPermission) {
			return (
				<TouchableOpacity onPress={this.askForPermission} style={styles.button}>
					<Text numberOfLines={1} style={styles.text}>
						Continue
					</Text>
				</TouchableOpacity>
			)
		}

		if (!isShowingPopup) {
			return (
				<TouchableOpacity onPress={this.showModal} style={styles.button}>
					<Text numberOfLines={1} style={styles.text}>
						Continue
					</Text>
				</TouchableOpacity>
			)
		}

		return (
			<Modal animationType='slide' transparent={false} visible={true}>
				<View style={styles.container}>
					<ContentHeader onBackClick={this.hideModel} />
					<BarcodeScanner handleBarCodeScanned={this.handleBarCodeScanned} />
				</View>
			</Modal>
		)
	}
}

const mapStateToProps = (state) => ({
	variables: state.chat.variables,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	addMessageToChat: (question, message) => {
		dispatch(
			actions.addMessageToChat({
				text: message,
				question,
			})
		)
	},
})

const Container = connect(mapStateToProps, mapDispatchToProps)(QRCode)

export default Container

const styles = {
	button: {
		alignItems: 'center',
		backgroundColor: '#F8F8F8',
		borderColor: '#EEE',
		borderTopWidth: 1,
		borderWidth: 0.5,
		height: 60,
		justifyContent: 'center',
	},
	container: {
		backgroundColor: 'black',
		flex: 1,
		height: '100%',
		justifyContent: 'center',
	},
	text: {
		color: '#4B4B4B',
		fontSize: 14,
	},
}
