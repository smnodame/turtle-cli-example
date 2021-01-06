import { Image, Text, TouchableOpacity, View } from 'react-native'

import React from 'react'
import { WebBrowser } from 'hybrid-expo'

const Card = ({
	image,
	label,
	link,
	selectLabel = 'SELECT',
	index,
	onSelect,
	currentQuestion,
	question,
}) => {
	const openWeb = (link) => {
		WebBrowser.openBrowserAsync(link)
	}

	return (
		<View style={styles.container}>
			<Image source={{ uri: image }} style={styles.image} />
			<TouchableOpacity style={styles.body.style} onPress={() => openWeb(link)}>
				<Text style={styles.body.title} numberOfLines={2}>
					{label}
				</Text>
			</TouchableOpacity>
			<View style={styles.footer.style}>
				<TouchableOpacity
					onPress={() => onSelect(index)}
					disabled={currentQuestion.id !== question.id}
				>
					<Text
						style={[
							styles.footer.text,
							{
								color: currentQuestion.id === question.id ? '#403ADD' : '#dddddd',
								cursor:
									currentQuestion.id === question.id ? 'pointer' : 'not-allowed',
							},
						]}
					>
						{selectLabel}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default Card

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
		borderRadius: 5,
		margin: 5,
		overflow: 'hidden',
		width: 180,
	},
	footer: {
		style: {
			color: '#403ADD',
			fontSize: 14,
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
