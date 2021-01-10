import { ScrollView, Text, TouchableOpacity } from 'react-native'

import React from 'react'

const Vertical = ({ options, onSelect, trigger }) => {
	return (
		<ScrollView style={styles.scrollview}>
			{options.map((option, index) => (
				<TouchableOpacity
					onPress={() => {
						onSelect(option.label, option.value, trigger[option.id])
					}}
					key={option.value || index}
					style={styles.button}
				>
					<Text numberOfLines={1} style={styles.text}>
						{option.label.toUpperCase()}
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	)
}

export default Vertical

const styles = {
	button: {
		alignItems: 'center',
		backgroundColor: '#F8F8F8',
		borderColor: '#EEE',
		borderTopWidth: 1,
		borderWidth: 0.5,
		height: 60,
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 10,
	},
	scrollview: {
		maxHeight: 240,
	},
	text: {
		color: '#4B4B4B',
		fontSize: 14,
	},
}
