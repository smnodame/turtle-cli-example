import * as FileSystem from 'expo-file-system'

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

    }

    componentDidMount() {
        this._askForPermissions()
    }

    _askForPermissions = async () => {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });
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

    _start =  async () => {
        this.setState({
            isLoading: true,
        })
        
        if (this.recording !== null) {
            this.recording.setOnRecordingStatusUpdate(null)
            this.recording = null
        }

        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
        recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus)

        this.recording = recording
        this.setState({
            isLoading: false,
        })
    }

    _stop = async () => {
        this.setState({
            isLoading: true,
        })
        try {
            await this.recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });
            const uri = this.recording.getURI();

            const info = await FileSystem.getInfoAsync(uri)
            console.log(`FILE INFO: ${JSON.stringify(info)}`)

            this.setState({
                isLoading: false,
            }, () => {
                this.props.onStopRecording(info.uri)
            })
        } catch (error) {
        // Do nothing -- we are already unloaded.
            console.log('[_stopRecordingAndEnablePlayback] : ')
            console.log(error)
        }
    }

    start = () => {
		this._start()
	}

	stop = () => {
		this._stop()
    }
    
    componentDidUpdate = (prevProps) => {
		if (this.props.status && this.props.status !== 'none' && prevProps.status !== this.props.status) {
            this[this.props.status]()
		}
	}

    render = () => null
}