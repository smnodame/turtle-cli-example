import DeviceDetector from 'device-detector-js'
import QrReader from 'react-qr-scanner'
import React from 'react'
import { View } from 'react-native'
import qrcodeParser from 'qrcode-parser'

export default class BarcodeScanner extends React.Component {
	constructor(props) {
		super(props)
		const deviceDetector = new DeviceDetector()
		const device = deviceDetector.parse(window.navigator.userAgent)
		this.device = device.device.type
	}

	componentDidMount = () => {
		const { handleBarCodeScanned } = this.props
		this.inputElement.onchange = (e) => {
			var image = new Image()
			image.onload = function () {
				var canvas = document.createElement('canvas')
				var context = canvas.getContext('2d')

				var devideWith = 4
				if (image.width > 1000) {
					devideWith = 6
				}

				canvas.width = image.width / devideWith
				canvas.height = image.height / devideWith
				context.drawImage(
					image,
					0,
					0,
					image.width,
					image.height,
					0,
					0,
					canvas.width,
					canvas.height
				)
				
				qrcodeParser(canvas.toDataURL('image/png')).then(
					(res) => {
						if (!res) {
							alert(
								'No QR code found. Please make sure the QR code is in the picture and try again.'
							)
							return
						}

						handleBarCodeScanned(res)
					},
					() => {
						alert(
							'No QR code found. Please make sure the QR code is in the picture and try again.'
						)
					}
				)
			}

			var imageUrl = URL.createObjectURL(e.target.files[0])
			image.src = imageUrl
		}
	}

	handleScanOnDesktop = (data) => {
		const { handleBarCodeScanned } = this.props
		if (data) {
			handleBarCodeScanned(data)
		}
	}

	handleErrorOnDesktop = (err) => {
		console.error(err)
	}

	render() {
		if (this.device !== 'desktop') {
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

		return (
			<View
				style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}
			>
				<input
					ref={(input) => (this.inputElement = input)}
					style={{ display: 'none' }}
					type='file'
					accept='image/*'
					id='photo-input'
					capture
				></input>
				<QrReader
					delay={100}
					style={{
						height: '100%',
						width: '100%',
					}}
					onError={this.handleErrorOnDesktop}
					onScan={this.handleScanOnDesktop}
				/>

				<div style={{ ...styles.buttonContainer, ...{ position: 'absolute', bottom: 0 } }}>
					<button onClick={() => this.inputElement.click()} style={styles.button}>
						BROWSE
					</button>
				</div>
			</View>
		)
	}
}

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
