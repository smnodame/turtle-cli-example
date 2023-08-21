import { Bubbles } from 'react-native-loader'
import React from 'react'
import { View, Image } from 'react-native'

const Splash = (props) => {
	const config = props.config || {}
	if (props.design?.mode === 'SPLASH-TESTING') {
		return (
			<View style={{ ...styles.background, backgroundColor: config.custom.background }}>
				<Image source={{ uri: config.custom?.logo || props.app?.icon }} style={{ width: 260, height: 260 }} />
			</View>
		)
	}

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
