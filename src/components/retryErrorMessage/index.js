import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'

import { Entypo } from 'hybrid-icon'
import React from 'react'

class RetryErrorMessage extends React.Component {
	render = () => {
		const { onRetry, isRetrying } = this.props

		return (
			<View style={styles.container}>
				<View style={styles.errorTitle}>
					<Entypo name='warning' style={{ color: '#dc3545', fontSize: 18 }} />
				</View>
				<Text style={styles.errorMessage}>
					<Text style={{ fontWeight: '700' }}>ooops! </Text>
					something went wrong.
				</Text>
				<View style={{ flex: 1 }}></View>
				{isRetrying && <ActivityIndicator size='small' />}
				{!isRetrying && (
					<TouchableOpacity onPress={onRetry}>
						<Text style={styles.retryMessage}>Retry</Text>
					</TouchableOpacity>
				)}
			</View>
		)
	}
}

export default RetryErrorMessage

const styles = {
	container: {
		display: 'flex',
		backgroundColor: 'white',
		borderColor: '#EEE',
		height: 60,
		borderWidth: 0.5,
		borderTopWidth: 1,
		alignItems: 'center',
		flexDirection: 'row',
		padding: 20,
	},
	errorTitle: {
		marginRight: 12,
		fontWeight: '700',
		color: '#dc3545!important',
	},
	errorMessage: {
		color: '#222222',
	},
	retryMessage: {
		fontWeight: '700',
		color: '#28a745!important',
	},
}
