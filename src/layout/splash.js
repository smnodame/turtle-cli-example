import { Bubbles } from 'react-native-loader'
import React from 'react'
import { View } from 'react-native'

const Splash = (props) => {
	return (
		<View style={styles.background}>
			<Bubbles size={12} color={'#2b2e50'} height={40} width={80} />
		</View>
	)
}

export default Splash

const styles = {
	background: {
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	backgroundImage: {
		flex: 1,
		resizeMode: 'stretch', // or 'stretch'
	},
}
