import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'

import { Entypo } from 'hybrid-icon'
import { Feather } from 'hybrid-icon'
import React from 'react'

const ErrorHandler = (error, onStartApp, isLoadingRequireData, onClearState) => {
	if (error.name === 'NetworkError') {
		return (
			<View style={styles.errorContainer} className='error-page-container'>
				<Feather name='wifi-off' style={{ ...styles.icon, color: 'red' }} size={85} />
				<Text style={styles.title}>No connection</Text>
				<Text style={styles.description}>We can't connect to the internect. Please check your connection</Text>
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						onStartApp()
					}}
				>
					{!isLoadingRequireData && <Text style={styles.textButton}>Try again</Text>}
					{isLoadingRequireData && <ActivityIndicator size='small' color='#FFF' />}
				</TouchableOpacity>
			</View>
		)
	}

	return (
		<View style={styles.errorContainer} className='error-page-container'>
			<Entypo name='warning' style={styles.icon} size={85} />
			<Text style={styles.title}>ooops!</Text>
			<Text style={styles.description}>Something went wrong please try again</Text>
			<TouchableOpacity
				style={styles.button}
				onPress={() => {
					if (!['NotFoundError', 'UnauthorizedError', 'ClientError', 'ServerError', 'NetworkError'].includes(error.name)) {
						onClearState()
					}
					onStartApp()
				}}
			>
				{!isLoadingRequireData && <Text style={styles.textButton}>Try again</Text>}
				{isLoadingRequireData && <ActivityIndicator size='small' color='#FFF' />}
			</TouchableOpacity>
		</View>
	)
}

export default ErrorHandler

const styles = {
	button: {
		backgroundColor: '#F96693',
		borderRadius: 24,
		height: 40,
		justifyContent: 'center',
		marginTop: 48,
		width: 120,
	},
	description: {
		color: '#24282B',
		fontSize: 16,
		fontWeight: '300',
		paddingLeft: 15,
		paddingRight: 15,
		marginTop: 12,
		textAlign: 'center'
	},
	errorContainer: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		justifyContent: 'center',
		textAlign: 'center',
	},
	icon: {
		color: 'orange',
		padding: 5,
	},
	textButton: {
		color: 'white',
		fontSize: 16,
		textAlign: 'center',
	},
	title: {
		color: '#34393C',
		fontSize: 28,
		fontWeight: '700',
	},
}
