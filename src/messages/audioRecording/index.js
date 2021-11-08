import * as apis from '../../redux/apis'

import { Platform, Text, TouchableHighlight, TouchableOpacity, View, Animated } from 'react-native'

import { FontAwesome } from 'hybrid-icon'
import React from 'react'
import ReactRecorder from 'react-native-audio-recording'
import _ from 'lodash'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import generateMessage from '../../utils/generateMessage'
import { setVariables } from '../../modules/setVariables'
import settings from '../../settings'
import { animeInterval } from '../../constants'

class AudioRecording extends React.Component {
	constructor(props) {
		super(props)
		this.recording = null
		this.state = {
			status: 'stop',
			progress: 0,
			hasCameraPermission: null,
			fadeAnim: new Animated.Value(0),
		}
	}

	componentDidMount() {
		this.inAnime()
		this.askForPermission()
	}

	inAnime = () => {
		Animated.timing(
			this.state.fadeAnim,
			{
				toValue: styles.container.height,
				duration: animeInterval,
			}
		).start()
	}

	outAnime = () => {
		Animated.timing(
			this.state.fadeAnim,
			{
				toValue: 0,
				duration: animeInterval,
			}
		).start()
	}

	askForPermission = () => {
		const { addMessageToChat } = this.props
		if (navigator.getUserMedia) {
			navigator.getUserMedia(
				{ audio: true },
				(stream) => {
					if (stream.getAudioTracks().length > 0) {
						this.setState({ hasCameraPermission: true })
					} else {
						this.setState({ hasCameraPermission: false })
						addMessageToChat(
							{},
							settings.permissions[settings.language.selected].NO_AUDIO_PERMISSION
						)
					}
				},
				() => {
					this.setState({ hasCameraPermission: false })
					addMessageToChat(
						{},
						settings.permissions[settings.language.selected].NO_AUDIO_PERMISSION
					)
				}
			)
		} else {
			// if navigator.getUserMedia doesn't exist mean it is running on mobile that not support getUserMedia
			this.setState({ hasCameraPermission: true })
		}
	}

	_getRecordingTimestamp = () => {
		if (this.state.recordingDuration !== null) {
			return `${this._getMMSSFromMillis(this.state.recordingDuration)}`
		}
		return `${this._getMMSSFromMillis(0)}`
	}

	_getMMSSFromMillis = (millis) => {
		const totalSeconds = millis / 1000
		const seconds = Math.floor(totalSeconds % 60)
		const minutes = Math.floor(totalSeconds / 60)

		const padWithZero = (number) => {
			const string = number.toString()
			if (number < 10) {
				return '0' + string
			}
			return string
		}
		return padWithZero(minutes) + ':' + padWithZero(seconds)
	}

	timer = (duration) => {
		this.setState({
			recordingDuration: duration,
		})
	}

	startRecording = () => {
		this.setState({
			status: 'start',
		})
	}

	stopRecording = () => {
		this.setState({
			status: 'stop',
		})
	}

	onStopRecording = (uri) => {
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
			const { question, answers, storeAnswers, onSend, variables } = this.props

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
				isUploading: false,
				progress: 0,
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
					audio: link,
				},
				_.get(question, 'trigger.right')
			)

			this.outAnime()
		})
	}

	onRecordPressed = () => {
		if (this.state.status === 'start') this.stopRecording()
		else this.startRecording()
	}

	progressCallback = (percent) => {
		this.setState({
			progress: percent * 100,
		})
	}

	render = () => {
		const { progress, isUploading } = this.state
		const { hasCameraPermission } = this.state
		if (!hasCameraPermission) {
			return (
				<TouchableOpacity onPress={this.askForPermission} style={styles.button}>
					<Text numberOfLines={1} style={styles.text}>
						Continue
					</Text>
				</TouchableOpacity>
			)
		} else {
			return (
				<Animated.View
					style={{
						height: this.state.fadeAnim,
					}}
				>
					{isUploading && (
						<View style={styles.progressContainer}>
							<View style={[styles.progressBar, { width: `${progress}%` }]}></View>
						</View>
					)}
					<ReactRecorder
						timer={this.timer}
						status={this.state.status}
						onStopRecording={this.onStopRecording}
					/>
					<View style={styles.container}>
						<Text style={styles.timer}>{this._getRecordingTimestamp()}</Text>
						<TouchableHighlight
							underlayColor='rgba(0, 0, 0, 0)'
							onPress={this.onRecordPressed}
							disabled={this.state.isLoading}
						>
							<View style={styles.buttonBody}>
								{
									<FontAwesome
										name={this.state.status === 'start' ? 'stop' : 'microphone'}
										style={{ fontSize: 30, color: 'white' }}
									/>
								}
							</View>
						</TouchableHighlight>
					</View>
				</Animated.View>
			)
		}
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

const Container = connect(mapStateToProps, mapDispatchToProps)(AudioRecording)

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
	buttonBody: {
		alignItems: 'center',
		backgroundColor: '#FF006F',
		borderRadius: 50,
		height: 100,
		justifyContent: 'center',
		width: 100,
	},
	container: {
		alignItems: 'center',
		backgroundColor: '#F8F8F8',
		borderColor: '#EEE',
		borderTopWidth: 1,
		borderWidth: 0.5,
		height: 180,
		justifyContent: 'center',
	},
	progressBar: {
		backgroundColor: '#007bff',
		borderRadius: 5,
		height: 5,
		transition: 'width .6s ease',
		width: '0%',
	},
	progressContainer: {
		margin: 1,
	},
	recordButton: {
		text: {
			color: 'white',
		},
	},
	text: {
		color: '#4B4B4B',
		fontSize: 14,
	},
	timer: {
		color: '#999',
		position: 'absolute',
		textAlign: 'center',
		top: 5,
	},
}
