import * as Permissions from 'expo-permissions'

import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'

import { BarCodeScanner } from 'expo-barcode-scanner'
import Constants from 'expo-constants'

export default class QRCode extends Component {
	state = {
		hasCameraPermission: null,
	}

	componentDidMount() {
		this.isTrigger = false
		this._requestCameraPermission()
	}

	_requestCameraPermission = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA)
		this.setState({
			hasCameraPermission: status === 'granted',
		})
	}

	_handleBarCodeRead = (data) => {
		if (this.isTrigger === false) {
			this.props.handleBarCodeScanned(data.data)
			this.isTrigger = true
		}
	}

	render() {
		return (
			<View style={styles.container}>
				{this.state.hasCameraPermission === null ? (
					<Text>Requesting for camera permission</Text>
				) : this.state.hasCameraPermission === false ? (
					<Text>Camera permission is not granted</Text>
				) : (
					<BarCodeScanner
						onBarCodeScanned={this._handleBarCodeRead}
						style={StyleSheet.absoluteFill}
					/>
				)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: Constants.statusBarHeight,
		backgroundColor: '#ecf0f1',
	},
})
