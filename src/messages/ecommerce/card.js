import { Image, Text, TouchableOpacity, View } from 'react-native'
import priceChar from '../../utils/priceChar'
import React from 'react'

const Card = ({ image, name, price, description, config, selectProduct, product, currentMessage }) => {
	return (
		<TouchableOpacity style={styles.container} onPress={() => selectProduct({
			...config,
			...product,
			currentMessage: currentMessage
		})}>
			<Image source={{ uri: image }} style={styles.image} />
			<View style={styles.body.style}>
				<Text style={styles.body.title} numberOfLines={2}>
					{name}
				</Text>
				<Text style={styles.body.title} numberOfLines={1}>
					{priceChar[config.unit_price]}{price}
				</Text>
				<Text style={styles.body.description} numberOfLines={2}>
					{description}
				</Text>
			</View>
		</TouchableOpacity>
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
			maxHeight: 26,
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
			fontSize: 22,
			fontWeight: 'bold',
			marginBottom: 5,
			overflow: 'hidden',
			color: '#444444'
		},
	},
	container: {
		backgroundColor: 'white',
		borderColor: '#EEE',
		borderRadius: 20,
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
			color: '#42659a',
			fontSize: 14,
			padding: 10,
			textAlign: 'center',
		},
		addToCard: {
			backgroundColor: '#17c950',
			color: '#ffffff',
			borderRadius: 8,
			fontSize: 14
		}
	},
	image: {
		borderTopLeftRadius: 20,
		borderTopRightRaduis: 20,
		flex: 1,
		height: 120,
		width: '100%',
	},
}
