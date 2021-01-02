import AudioRecorder from 'audio-recorder-polyfill'
import React from 'react'
window.MediaRecorder = AudioRecorder

class Recorder extends React.Component {

	start = () => {
		const { onStop, onStart } = this.props
		navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
			this.recorder = new MediaRecorder(stream)
		
			this.recorder.addEventListener('dataavailable', e => {
				onStop(URL.createObjectURL(e.data))
			})
		
			this.recorder.start()
			onStart()
		})
	}

	stop = () => {
		this.recorder.stop()
		this.recorder.stream.getTracks().forEach(i => i.stop())
	}

	componentDidUpdate = (prevProps) => {
		if (this.props.command && this.props.command !== 'none' && prevProps.command !== this.props.command) {
			this[this.props.command]()
		}
	}

	componentWillUnmount = () => {
		if (this.props.onUnmount) this.props.onUnmount(this.stream)
	}

	render () {
		return false
	}
}

export default Recorder