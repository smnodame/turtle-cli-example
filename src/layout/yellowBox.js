import { Text, TouchableOpacity, View } from 'react-native'

import React from 'react'

const YellowBox = ({ addErrorMsgToYellowBox, errorMsg, isExpandYellowBox, toggleYellowBox }) => {
	if (isExpandYellowBox) {
		return (
			<View
				style={{ ...styles.header, ...{ top: 1, height: '100%', justifyContent: 'unset' } }}
			>
				<Text>{errorMsg}</Text>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.button}
						onPress={() => toggleYellowBox(!isExpandYellowBox)}
					>
						<Text numberOfLines={1}>Minimize</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.button}
						onPress={() => addErrorMsgToYellowBox(null)}
					>
						<Text numberOfLines={1}>Dismiss</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
	return (
		<TouchableOpacity
			style={{ ...styles.header }}
			onPress={() => toggleYellowBox(!isExpandYellowBox)}
		>
			<Text numberOfLines={1}>{errorMsg}</Text>
		</TouchableOpacity>
	)
}

export default YellowBox

const styles = {
	button: {
		flex: 1,
		padding: 12,
		textAlign: 'center',
	},
	buttonContainer: {
		bottom: 0,
		display: 'flex',
		flexDirection: 'row',
		left: 0,
		position: 'absolute',
		right: 0,
	},
	header: {
		backgroundColor: 'rgba(255,193,7, 0.95)',
		borderBottomColor: '#E7E7E7',
		borderBottomWidth: 0.5,
		bottom: 0,
		color: 'white',
		cursor: 'pointer',
		height: 60,
		justifyContent: 'center',
		left: 0,
		padding: 18,
		position: 'fixed',
		right: 0,
		zIndex: 1000,
	},
}
