import * as FileSystem from 'expo-file-system'
import * as Permissions from 'expo-permissions'

import {
  DatePickerIOS,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native'

import { Audio } from 'expo-av'
import React from 'react'
import _ from 'lodash'

export default class AudioRecording extends React.Component {
    constructor(props) {
      super(props)
      this.recording = null
      this.state = {
          isRecording: false
      }

      this.recordingSettings = JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY))
    }

    componentDidMount() {
        this._askForPermissions()
    }

    _askForPermissions = async () => {
        const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
        console.log(response.status)
        this.setState({
            haveRecordingPermissions: response.status === 'granted',
        })
    }

    _updateScreenForRecordingStatus = status => {
        if (status.canRecord) {
            this.setState({
                isRecording: status.isRecording,
                recordingDuration: status.durationMillis,
            }, () => {
                this.props.timer(status.durationMillis)
            })
        } else if (status.isDoneRecording) {
            this.setState({
                isRecording: false,
                recordingDuration: status.durationMillis,
            }, () => {
                this.props.timer(status.durationMillis)
            })

            if (!this.state.isLoading) {
                this._stopRecordingAndEnablePlayback()
            }
        }
    }

    _stopPlaybackAndBeginRecording =  async () => {
        this.setState({
            isLoading: true,
        })

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: false,
        })

        if (this.recording !== null) {
            this.recording.setOnRecordingStatusUpdate(null)
            this.recording = null
        }

        const recording = new Audio.Recording()
        await recording.prepareToRecordAsync(this.recordingSettings)
        recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus)

        this.recording = recording
        await this.recording.startAsync() // Will call this._updateScreenForRecordingStatus to update the screen.
        this.setState({
            isLoading: false,
        })
    }

    _stopRecordingAndEnablePlayback = async () => {
        this.setState({
            isLoading: true,
        })
        try {
            await this.recording.stopAndUnloadAsync()
        } catch (error) {
        // Do nothing -- we are already unloaded.
            console.log('[_stopRecordingAndEnablePlayback] : ')
            console.log(error)
        }
        const info = await FileSystem.getInfoAsync(this.recording.getURI())
        console.log(`FILE INFO: ${JSON.stringify(info)}`)

        this.setState({
            isLoading: false,
        }, () => {
            this.props.onStopRecording(info.uri)
        })
    }

    start = () => {
		this._stopPlaybackAndBeginRecording()
	}

	stop = () => {
		this._stopRecordingAndEnablePlayback()
    }
    
    componentDidUpdate = (prevProps) => {
		if (this.props.status && this.props.status !== 'none' && prevProps.status !== this.props.status) {
			this[this.props.status]()
		}
	}

    render = () => null
}