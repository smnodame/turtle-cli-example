import * as apis from '../../redux/apis'

import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native'

import Camera from 'react-native-take-photo'
import { ContentHeader } from '../../layout/header'
import Modal from 'react-native-full-modal'
import React from 'react'
import _ from 'lodash'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import generateMessage from '../../utils/generateMessage'
import { setVariables } from '../../modules/setVariables'
import settings from '../../settings'

class PhotoCamera extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			hasCameraPermission: false,
			isShowingPopup: true,
		}
	}

	componentDidMount = () => {
		this.askForPermission()
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
							settings.permissions[settings.language.selected].NO_VIDEO_PERMISSION
						)
					}
				},
				() => {
					this.setState({ hasCameraPermission: false })
					addMessageToChat(
						{},
						settings.permissions[settings.language.selected].NO_VIDEO_PERMISSION
					)
				}
			)
		} else {
			// if navigator.getUserMedia doesn't exist mean it is running on mobile that not support getUserMedia
			this.setState({ hasCameraPermission: true })
		}
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
		} catch (e) {
			console.log(e)
		}
	}

	showModal = () => {
		this.setState({
			isShowingPopup: true,
		})
	}

	onTakePhoto = (uri) => {
		this.setState({
			isUploading: true,
		})

		const uploadData =
			Platform.OS === 'web'
				? {
						data: uri,
						func: 'uploadBlob',
				  }
				: {
						data: uri,
						func: 'uploadFile',
				  }

		apis[uploadData.func](uploadData.data, this.progressCallback).then(({ link }) => {
			const { question, answers, storeAnswers, onSend } = this.props

			const answer = {
				[question.id]: {
					answer: {
						url: {
							value: link,
						},
						created_at: {
							value: new Date(),
						},
					},
					mode: question.mode,
				},
			}

			setVariables(question.id, variables, answer)
			
			this.setState({
				show: false,
				isUploading: false,
			})

			// store answers in store
			storeAnswers(
				{
					...answers,
					...answer,
				},
				answer
			)

			// generate answer and replace expression
			const message = generateMessage(question.answer, answers, answer)

			onSend(
				{
					text: message,
					image: link,
				},
				_.get(question, 'trigger.right')
			)
		})
	}

	progressCallback = (percent) => {
		this.setState({
			progress: percent * 100,
		})
	}

	render() {
		const { hasCameraPermission, isUploading, isShowingPopup } = this.state
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
					{!isUploading && <ContentHeader onBackClick={this.hideModel} />}
					{!isUploading && <Camera onTakePhoto={this.onTakePhoto} />}
					{isUploading && <ActivityIndicator size='large' color='white' />}
				</View>
			</Modal>
		)
	}
}

const mapStateToProps = (state) => ({})

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

const Container = connect(mapStateToProps, mapDispatchToProps)(PhotoCamera)

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
