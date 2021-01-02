import * as apis from '../../redux/apis'

import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native'

import { ContentHeader } from '../../layout/header'
import Modal from 'react-native-full-modal'
import React from 'react'
import VideoRecording from 'react-native-video-recording'
import _ from 'lodash'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import generateMessage from '../../utils/generateMessage'
import settings from '../../settings'

class PhotoCamera extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			progress: 0,
			isUploading: false,
			hasCameraPermission: false,
			isShowingPopup: true,
		}
	}

	componentDidMount() {
		this.askForPermission()
	}

	setPreviewStream = (stream) => {
		this.previewStream = stream
	}

	askForPermission = () => {
		const { addMessageToChat } = this.props
		if (navigator.getUserMedia) {
			navigator.getUserMedia(
				{ audio: true, video: true },
				(stream) => {
					this.stream = stream
					if (stream.getVideoTracks().length > 0 && stream.getAudioTracks().length > 0) {
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
			this.previewStream.getTracks().forEach((track) => track.stop())
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

	onRecordedVideo = (file, uri) => {
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

		apis[uploadData.func](uploadData.data, this.progressCallback).then(
			({ link }) => {
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
						vdo: link,
					},
					_.get(question, 'trigger.right')
				)
			},
			(err) => {
				console.log('============errr=r')
				console.log(err)
			}
		)
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
			<View>
				<Modal animationType='slide' transparent={false} visible={true}>
					<View style={styles.container}>
						{!isUploading && <ContentHeader onBackClick={this.hideModel} />}
						{!isUploading && (
							<VideoRecording
								onRecordedVideo={this.onRecordedVideo}
								setPreviewStream={this.setPreviewStream}
							/>
						)}
						{isUploading && <ActivityIndicator size='large' color='white' />}
					</View>
				</Modal>
			</View>
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
