import * as Permissions from 'expo-permissions'

import { Text, View } from 'react-native'

import { Audio } from 'expo-av'
import { Entypo } from '@expo/vector-icons'
import React from 'react'
import _ from 'lodash'

export default class AudioPlayer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isPlaying: false,
			position: 0,
			timeLeft: '',
		}
		this.loadAudio = this.loadAudio.bind(this)
		this.toggleAudioPlayback = this.toggleAudioPlayback.bind(this)
	}

	componentDidMount() {
		this._askForPermissions()
		this.loadAudio()
	}

	_askForPermissions = async () => {
		const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
		this.setState({
			haveRecordingPermissions: response.status === 'granted',
		})
	}

	componentWillUnmount() {
		this.soundObject.stopAsync()
	}

	async loadAudio() {
		this.soundObject = new Audio.Sound()
		try {
			await this.soundObject.loadAsync({ uri: this.props.source })
			this.soundObject.setOnPlaybackStatusUpdate(this._updateScreenForSoundStatus)
		} catch (e) {
			console.log('ERROR Loading Audio', e)
		}
	}

	_updateScreenForSoundStatus = (status) => {
		if (status.isLoaded) {
			if (status.didJustFinish) {
				this.soundObject.stopAsync()
				this.setState({
					isPlaying: false,
				})
			}
			this.setState({
				soundDuration: status.durationMillis,
				soundPosition: status.positionMillis,
				shouldPlay: status.shouldPlay,
				rate: status.rate,
				muted: status.muted,
				volume: status.volume,
				shouldCorrectPitch: true,
				isPlaybackAllowed: true,
			})
		} else {
			this.setState({
				soundDuration: null,
				soundPosition: null,
				isPlaybackAllowed: false,
			})
			if (status.error) {
				console.log(`FATAL PLAYER ERROR: ${status.error}`)
			}
		}
	}

	toggleAudioPlayback = async () => {
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: true,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
			playThroughEarpieceAndroid: false,
			staysActiveInBackground: false,
		})
		this.setState(
			{
				isPlaying: !this.state.isPlaying,
			},
			() =>
				this.state.isPlaying ? this.soundObject.playAsync() : this.soundObject.stopAsync()
		)
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

	_getPlaybackTimestamp = () => {
		if (
			this.soundObject !== null &&
			this.state.soundPosition !== null &&
			this.state.soundDuration !== null
		) {
			return `${this._getMMSSFromMillis(
				this.state.soundPosition
			)} / ${this._getMMSSFromMillis(this.state.soundDuration)}`
		}
		return `--:-- / --:--`
	}

	_getSeekSliderPosition() {
		if (
			this.soundObject !== null &&
			this.state.soundPosition !== null &&
			this.state.soundDuration !== null
		) {
			return this.state.soundPosition / this.state.soundDuration
		}
		return 0
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.body}>
					<Entypo
						name={this.state.isPlaying ? 'controller-stop' : 'controller-play'}
						color='#dedede'
						size={25}
						onPress={this.toggleAudioPlayback}
					/>
					<View style={styles.track}>
						<View
							style={{
								position: 'absolute',
								width: `${this._getSeekSliderPosition() * 100}%`,
								left: 0,
								height: 4,
								backgroundColor: 'orange',
							}}
						/>
						<View
							style={{
								position: 'absolute',
								left: `${this._getSeekSliderPosition() * 100}%`,
								borderRadius: 100 / 2,
								width: 10,
								height: 10,
								backgroundColor: 'orange',
							}}
						/>
					</View>
					<View style={styles.hr} />
					<Text style={styles.text}>{this._getPlaybackTimestamp()}</Text>
				</View>
			</View>
		)
	}
}

const styles = {
	container: {
		width: 220,
		marginTop: 5,
		marginBottom: 5,
	},
	body: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		borderRadius: 5,
		padding: 5,
		paddingRight: 12,
		paddingLeft: 10,
	},
	hr: {
		width: 5,
	},
	text: {
		color: 'white',
		width: 95,
		textAlign: 'right',
	},
	track: {
		flex: 1,
		height: 4,
		backgroundColor: '#d6d6d6',
		alignItems: 'center',
		flexDirection: 'row',
	},
}