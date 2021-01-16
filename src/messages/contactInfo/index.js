import { Animated, Image, Linking, Platform, Text, TouchableHighlight, View } from 'react-native'
import { Entypo, Foundation, Ionicons, MaterialIcons } from 'hybrid-icon'

import React from 'react'
import { WebBrowser } from 'hybrid-expo'
import _ from 'lodash'

export default class ContactInfo extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			fadeAnim: new Animated.Value(0),
		}
	}

	componentDidMount = () => {
		Animated.timing(
			// Animate over time
			this.state.fadeAnim, // The animated value to drive
			{
				toValue: 1, // Animate to opacity: 1 (opaque)
				duration: 1500, // Make it take a while
			}
		).start() // Starts the animation
	}

	onLink = (link) => {
		Linking.openURL(link)
	}

	onWeb = (link) => {
		WebBrowser.openBrowserAsync(link)
	}

	render() {
		const web = _.get(this.props.question, 'input.web')
		const email = _.get(this.props.question, 'input.email')
		const tel = _.get(this.props.question, 'input.tel')
		const location = _.get(this.props.question, 'input.location', {})
		const title = _.get(this.props.question, 'input.title')
		const name = _.get(this.props.question, 'input.name')
		const description = _.get(this.props.question, 'input.description')
		const avatar = _.get(this.props.question, 'input.avatar')
		const { fadeAnim } = this.state

		return (
			<Animated.View
				style={{
					opacity: fadeAnim,
					paddingTop: 10,
					paddingBottom: 10,
				}}
			>
				{!!title && <Text style={styles.title}>{title}</Text>}
				<View style={styles.card}>
					<View style={styles.cardContent}>
						<View style={{ flex: 1 }}>
							<View style={{ marginBottom: 10, alignItems: 'center' }}>
								<Image source={{ uri: avatar }} style={styles.avatar} />
								<Text style={styles.name}>{name}</Text>
								<Text style={styles.description}>{description}</Text>
							</View>
						</View>
						{!!location.name && (
							<View style={{ marginBottom: 10 }}>
								<TouchableHighlight
									underlayColor='rgba(0, 0, 0, 0)'
									onPress={() => {
										const url = Platform.select({
											ios: `http://maps.apple.com/?ll=${location.lat},${location.lng}`,
											android: `http://maps.google.com/?q=${location.lat},${location.lng}`,
											web: `http://maps.google.com/?q=${location.lat},${location.lng}`,
										})
										if (Platform.OS === 'web') {
											this.onWeb(url)
										} else {
											this.onLink(url)
										}
									}}
								>
									<View style={{ flexDirection: 'row' }}>
										<View style={styles.iconContainer}>
											<Entypo
												active
												name='location-pin'
												size={20}
												style={{
													marginTop: 2,
													marginLeft: 1,
													color: '#6e6f8f',
												}}
											/>
										</View>
										<View style={styles.detail}>
											<Text style={styles.titleField}>ADDRESS</Text>
											<Text style={styles.valueField} numberOfLines={2}>
												{location.name}
											</Text>
										</View>
									</View>
								</TouchableHighlight>
							</View>
						)}
						{!!email && (
							<View style={{ marginBottom: 10 }}>
								<TouchableHighlight
									underlayColor='rgba(0, 0, 0, 0)'
									onPress={() => {
										this.onLink(`mailto: ${email}`)
									}}
								>
									<View style={{ flexDirection: 'row' }}>
										<View style={styles.iconContainer}>
											<MaterialIcons
												active
												name='email'
												size={20}
												style={{
													marginTop: 2,
													marginLeft: 1,
													color: '#6e6f8f',
												}}
											/>
										</View>
										<View style={styles.detail}>
											<Text style={styles.titleField}>EMAIL</Text>
											<Text style={styles.valueField} numberOfLines={1}>
												{email}
											</Text>
										</View>
									</View>
								</TouchableHighlight>
							</View>
						)}
						{!!tel && (
							<View style={{ marginBottom: 10 }}>
								<TouchableHighlight
									underlayColor='rgba(0, 0, 0, 0)'
									onPress={() => {
										this.onLink(`tel:${tel}`)
									}}
								>
									<View style={{ flexDirection: 'row' }}>
										<View style={styles.iconContainer}>
											<Ionicons
												active
												name='md-call'
												size={20}
												style={{
													marginTop: 2,
													marginLeft: 1,
													color: '#6e6f8f',
												}}
											/>
										</View>
										<View style={styles.detail}>
											<Text style={styles.titleField}>PHONE</Text>
											<Text style={styles.valueField} numberOfLines={1}>
												{tel}
											</Text>
										</View>
									</View>
								</TouchableHighlight>
							</View>
						)}

						{!!web && (
							<View style={{ marginBottom: 10 }}>
								<TouchableHighlight
									underlayColor='rgba(0, 0, 0, 0)'
									onPress={() => {
										this.onWeb(web)
									}}
								>
									<View style={{ flexDirection: 'row' }}>
										<View style={styles.iconContainer}>
											<Foundation
												active
												name='web'
												size={20}
												style={{
													marginTop: 2,
													marginLeft: 1,
													color: '#6e6f8f',
												}}
											/>
										</View>
										<View style={styles.detail}>
											<Text style={styles.titleField}>WEB SITE</Text>
											<Text style={styles.valueField} numberOfLines={1}>
												{web}{' '}
											</Text>
										</View>
									</View>
								</TouchableHighlight>
							</View>
						)}
					</View>
				</View>
			</Animated.View>
		)
	}
}

const styles = {
	avatar: {
		borderRadius: 40,
		height: 80,
		marginTop: 5,
		width: 80,
	},
	card: {
		backgroundColor: '#fff',
		borderBottomWidth: 0,
		borderColor: '#ddd',
		borderRadius: 16,
		borderWidth: 1,
		elevation: 1,
		margin: 5,
		marginBottom: 10,
		padding: 15,
		shadowColor: '#222',
		shadowOffset: {
			height: 2,
			width: 0,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	cardContent: {},
	description: {
		color: '#989898',
		fontSize: 13,
		marginTop: 6,
		textAlign: 'center',
	},
	detail: {
		flex: 1,
		overflow: 'hidden',
	},
	iconContainer: {
		paddingTop: 5,
		width: 40,
	},
	name: {
		color: '#616161',
		fontSize: 16,
		fontWeight: '500',
		marginTop: 15,
		textAlign: 'center',
	},
	title: {
		color: '#4B4B4B',
		fontSize: 16,
		fontWeight: 'bold',
		padding: 10,
		textAlign: 'center',
	},
	titleField: {
		color: '#868e96',
		fontSize: 12,
		fontWeight: '500',
		marginTop: 6,
	},
	valueField: {
		color: '#989898',
		fontSize: 13,
		fontWeight: '300',
		marginTop: 5,
	},
}
