import './style.css'
import 'react-html5-camera-photo/build/css/index.css'

import React, { Component } from 'react'

import Camera from 'react-html5-camera-photo'
import DeviceDetector from 'device-detector-js'
import b64toBlob from '../../../utils/b64toBlob'

class CameraPhoto extends Component {
	constructor(props) {
		super(props)

		const deviceDetector = new DeviceDetector()
		const device = deviceDetector.parse(window.navigator.userAgent)
		this.device = device.device.type
	}

	componentDidMount = () => {
		if (this.device !== 'desktop') {
			this.inputElement.onchange = (event) => {
				const output = event.target.files[0]
				const recordedBlob = new Blob([output], { type: output.type })
				const url = URL.createObjectURL(recordedBlob)
				this.props.onTakePhoto(url)
			}
		}
	}

	onCaptureFromDesktop = (dataUri) => {
		const blobUrl = b64toBlob(dataUri, 'image/png')
		this.props.onTakePhoto(blobUrl)
	}

	render() {
		if (this.device === 'desktop') {
			return (
				<div className='camera'>
					<Camera onTakePhoto={this.onCaptureFromDesktop} />
				</div>
			)
		}

		return (
			<div style={styles.content}>
				<input
					ref={(input) => (this.inputElement = input)}
					style={{ display: 'none' }}
					type='file'
					accept='image/*'
					id='photo-input'
					capture
				></input>
				<div style={{ flex: 1 }} />
				<div style={styles.buttonContainer}>
					<button onClick={() => this.inputElement.click()} style={styles.button}>
						Turn my camera ON
					</button>
				</div>
			</div>
		)
	}
}

export default CameraPhoto

const styles = {
	content: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
	},
	buttonContainer: {
		display: 'flex',
		justifyContent: 'center',
		marginBottom: '18px',
	},
	button: {
		borderRadius: '4px',
		padding: '12px',
		border: 'none',
		margin: '5px',
		outline: 'none',
		cursor: 'pointer',
		backgroundColor: 'white',
	},
}
