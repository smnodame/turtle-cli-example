import { ImageBackground, Platform, View } from 'react-native'

import LinearGradient from 'react-native-linear-gradient'
import React from 'react'
import VideoBackground from 'react-native-video-background'

const Background = ({ option, background }) => {
	if (option === 'gradient') {
		return (
			<LinearGradient
				style={[styles.background]}
				colors={[background.gradient.from, background.gradient.to]}
				start={{ x: 0, y: 0.1 }}
				end={{ x: 0.1, y: 1 }}
			></LinearGradient>
		)
	} else if (option === 'color') {
		return <View style={[styles.background, { backgroundColor: background.color.color }]} />
	} else if (option === 'image') {
		return (
			<ImageBackground
				style={[styles.background]}
				source={{
					uri:
						Platform.OS === 'web'
							? background.image.desktop
							: background.image.mobile || background.image.desktop,
				}}
			></ImageBackground>
		)
	} else if (option === 'video') {
		return (
			<View style={[styles.background]}>
				<VideoBackground src={background.video.video} />
			</View>
		)
	} else {
		return <View />
	}
}

export default Background

const styles = {
	background: {
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
	},
	backgroundImage: {
		flex: 1,
		resizeMode: 'stretch', // or 'stretch'
	},
}
