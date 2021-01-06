import { Image, View } from 'react-native'

import { Bubbles } from 'react-native-loader'
import LinearGradient from 'react-native-linear-gradient'
import React from 'react'

const Splash = (props) => {
	const config = props.config || {}
	if (config.selected === 'custom') {
		return (
			<LinearGradient
				style={[styles.background]}
				colors={[
					config.custom.background.gredient.from,
					config.custom.background.gredient.to,
				]}
				start={{ x: 0, y: 0.1 }}
				end={{ x: 0.1, y: 1 }}
			>
				<Image source={{ uri: config.custom.logo }} style={{ width: 260, height: 260 }} />
			</LinearGradient>
		)
	} else {
		return (
			<View style={styles.background}>
				<Bubbles size={12} color={'#2b2e50'} height={40} width={80} />
			</View>
		)
	}
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
