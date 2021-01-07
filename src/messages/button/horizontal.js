import { Text, TouchableOpacity, View } from 'react-native'

import React from 'react'

const Horizontal = ({ options, onSelect, trigger }) => {
	return (
		<View style={styles.container}>
			{options.map((option, index) => (
				<TouchableOpacity
					key={option.value || index}
					onPress={() => {
						onSelect(option.label, option.value, trigger[option.id])
					}}
					style={styles.button}
				>
					<Text numberOfLines={1} style={styles.text}>
						{option.label.toUpperCase()}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	)
}

export default Horizontal

const styles = {
	button: {
		alignItems: 'center',
		backgroundColor: '#F8F8F8',
		borderColor: '#EEE',
		borderTopWidth: 1,
		borderWidth: 0.5,
		flex: 1,
		height: 60,
		justifyContent: 'center',
	},
	container: {
		flexDirection: 'row',
	},
	text: {
		color: '#4B4B4B',
		fontSize: 14,
	},
}
