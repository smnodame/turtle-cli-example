import { Image, Text, TouchableOpacity, View } from 'react-native'

import React from 'react'
import { WebBrowser } from 'hybrid-expo'

const WebCard = ({ image, title, date, description, link }) => {
	const openWeb = (link) => {
		WebBrowser.openBrowserAsync(link)
	}

	return (
		<View style={styles.container}>
			<Image source={{ uri: image }} style={styles.image} />
			<View style={styles.body.style}>
				<Text style={styles.body.title} numberOfLines={2}>
					{title}
				</Text>
				<Text style={styles.body.date} numberOfLines={3}>
					{date}
				</Text>
				<Text style={styles.body.description} numberOfLines={3}>
					{description}
				</Text>
				<Text style={styles.body.link} numberOfLines={1}>
					{link}
				</Text>
			</View>
			<View style={styles.footer.style}>
				<TouchableOpacity onPress={() => openWeb(link)}>
					<Text style={styles.footer.text}>View on Web</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default WebCard

const styles = {
	body: {
		date: {
			color: '#666',
			fontSize: 12,
			marginBottom: 5,
		},
		description: {
			color: '#666',
			fontSize: 12,
			marginBottom: 10,
			maxHeight: 40,
			overflow: 'hidden',
		},
		link: {
			color: '#999',
			fontSize: 10,
			marginBottom: 5,
		},
		style: {
			height: 140,
			padding: 10,
		},
		title: {
			fontSize: 12,
			fontWeight: 'bold',
			marginBottom: 5,
			overflow: 'hidden',
		},
	},
	container: {
		backgroundColor: 'white',
		borderColor: '#EEE',
		borderRadius: 5,
		borderWidth: 1,
		margin: 5,
		overflow: 'hidden',
		width: 220,
	},
	footer: {
		style: {
			color: '#403ADD',
			fontSize: 14,
			padding: 10,
			textAlign: 'center',
		},
		text: {
			color: '#403ADD',
			fontSize: 14,
			padding: 10,
			textAlign: 'center',
		},
	},
	image: {
		borderTopLeftRadius: 5,
		flex: 1,
		height: 120,
		width: '100%',
	},
}
