import * as apis from '../../redux/apis'

import {
	ActivityIndicator,
	Dimensions,
	Image,
	TextInput as Input,
	Platform,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { Entypo, FontAwesome, MaterialIcons } from 'hybrid-icon'

import ChooseOnMap from './chooseOnMap'
import { ContentHeader } from '../../layout/header'
import Modal from 'react-native-full-modal'
import React from 'react'

const { height, width } = Dimensions.get('window')

export default class Search extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			nearPlace: [],
			systemChoice: [
				{
					id: 'your-location',
					name: 'Your location',
					icon: (
						<MaterialIcons
							active
							name='my-location'
							size={25}
							style={{ color: '#7773FD' }}
						/>
					),
					onChoose: () => {
						this.props.onClose()
						this.props.onChoose({
							coords: this.props.currentLocation,
							name: this.props.currentLocationName,
						})
					},
				},
				{
					id: 'choose-on-map',
					name: 'Choose on map',
					icon: (
						<Entypo active name='location-pin' size={25} style={{ color: '#DDDDDD' }} />
					),
					onChoose: () => {
						this.setState({
							chooseOnMapVisible: true,
						})
					},
				},
			],
		}
	}

	onSearch = (filter) => {
		// incase, no query
		if (!filter) return

		clearTimeout(this.timeout)
		const { coords, apiKey, redius, placeTypes } = this.props

		this.setState({
			nearPlaceLoading: true,
		})

		this.timeout = setTimeout(() => {
			apis.findplacefromtext(filter, redius, coords.coords, apiKey, placeTypes).then(
				(data) => {
					this.setState({
						nearPlace: data.candidates,
						nearPlaceLoading: false,
					})
				}
			)
		}, 1500)
	}

	getLocationName = (region) => {
		return fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&sensor=true&key=${this.props.apiKey}`
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.error_message) return

				return data.results[0].formatted_address
			})
	}

	render = () => {
		return (
			<Modal animationType='slide' transparent={false} visible={this.props.visible}>
				<ChooseOnMap
					visible={this.state.chooseOnMapVisible}
					currentLocation={this.props.currentLocation}
					coords={this.props.coords}
					onChoose={(location) => {
						this.setState(
							{
								chooseOnMapVisible: false,
							},
							() => {
								this.getLocationName(location).then((name) => {
									this.props.onChoose({
										coords: {
											...location,
										},
										name: name,
									})
									this.props.onClose()
								})
							}
						)
					}}
				/>
				<ContentHeader
					onBackClick={() => {
						this.setState(
							{
								nearPlace: [],
								query: '',
							},
							() => {
								this.props.onClose()
							}
						)
					}}
				/>
				<View style={styles.searchContent}>
					<View regular style={styles.inputContainer}>
						<FontAwesome active name='search' size={20} style={{ color: '#999' }} />
						<Input
							style={styles.textinput}
							value={this.state.query}
							onChangeText={(query) => {
								clearTimeout(this.searchTimeout)
								this.setState(
									{
										query: query,
										nearPlaceLoading: true,
									},
									() => {
										this.searchTimeout = setTimeout(() => {
											this.onSearch(query)
										}, 800)
									}
								)
							}}
							underlineColorAndroid='transparent'
							placeholderTextColor={'#999'}
							placeholder={'SEARCH'}
						/>
						{!!this.state.query && (
							<TouchableOpacity
								onPress={() => {
									this.setState(
										{
											query: '',
										},
										() => {
											this.onSearch('')
										}
									)
								}}
								style={styles.clear}
							>
								<View ref={(component) => (this._root_clear = component)}>
									<Entypo
										active
										name='cross'
										size={14}
										style={{ marginTop: 0, marginLeft: 0, color: 'white' }}
									/>
								</View>
							</TouchableOpacity>
						)}
					</View>
				</View>
				{this.state.nearPlaceLoading && (
					<View style={styles.nearPlaceLoading}>
						<ActivityIndicator size='small' />
					</View>
				)}
				{!this.state.nearPlaceLoading && (
					<ScrollView>
						<View style={{ marginTop: 15 }} />
						{!this.state.query &&
							this.state.systemChoice.map((place) => {
								return (
									<TouchableOpacity
										onPress={() => {
											this.setState(
												{
													nearPlace: [],
													query: '',
												},
												() => {
													place.onChoose()
												}
											)
										}}
										key={place.id}
									>
										<View style={styles.searchItem.style}>
											<View style={styles.searchItem.icon}>{place.icon}</View>
											<View style={styles.searchItem.textContainer}>
												<Text
													numberOfLines={1}
													style={styles.searchItem.name}
												>
													{place.name}{' '}
												</Text>
											</View>
										</View>
									</TouchableOpacity>
								)
							})}
						{!!this.state.query &&
							this.state.nearPlace.length > 0 &&
							this.state.nearPlace.map((place) => {
								return (
									<TouchableOpacity
										onPress={() => {
											this.setState(
												{
													nearPlace: [],
													query: '',
												},
												() => {
													this.props.onClose()
													this.props.onChoose({
														coords: {
															latitude: place.geometry.location.lat,
															longitude: place.geometry.location.lng,
														},
														name: place.name,
													})
												}
											)
										}}
										key={place.id}
									>
										<View style={styles.searchItem.style}>
											<View style={styles.searchItem.icon}>
												<Image
													source={{ uri: place.icon }}
													style={{ width: 20, height: 20 }}
												/>
											</View>
											<View style={styles.searchItem.textContainer}>
												<Text
													numberOfLines={1}
													style={styles.searchItem.name}
												>
													{place.name}{' '}
												</Text>
												<Text
													numberOfLines={1}
													style={styles.searchItem.description}
												>
													{place.vicinity || place.formatted_address}
												</Text>
											</View>
										</View>
									</TouchableOpacity>
								)
							})}
						{!!this.state.query && this.state.nearPlace.length === 0 && (
							<Text
								style={{
									color: '#BBB',
									padding: 15,
									paddingTop: 5,
									width: '100%',
									textAlign: 'center',
								}}
							>
								No Item found
							</Text>
						)}
					</ScrollView>
				)}
			</Modal>
		)
	}
}

const styles = {
	back: {
		flex: 1,
		paddingLeft: 10,
		paddingRight: 10,
	},
	body: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	boostrap: {
		alignItems: 'center',
		flex: 1,
		height: '100%',
		justifyContent: 'center',
	},
	clear: {
		alignItems: 'center',
		backgroundColor: '#888',
		borderRadius: 10,
		height: 20,
		justifyContent: 'center',
		width: 20,
	},
	container: {
		backgroundColor: 'white',
		flex: 1,
		height: '100%',
	},
	flex: {
		flex: 1,
	},
	header: {
		backgroundColor: '#F7F7F7',
		borderBottomColor: '#E7E7E7',
		borderBottomWidth: 0.5,
		height: 60,
		justifyContent: 'center',
	},
	inputContainer: {
		alignItems: 'center',
		backgroundColor: '#F1F1F1',
		borderColor: 'white',
		borderRadius: 8,
		borderWidth: 0,
		display: 'flex',
		flex: 1,
		flexDirection: 'row',
		fontSize: 15,
		height: 40,
		justifyContent: 'center',
		marginBottom: 0,
		marginLeft: 10,
		marginRight: 10,
		padding: 2,
		paddingLeft: 15,
		paddingRight: 15,
	},
	item: {
		alignItems: 'center',
		borderBottomColor: '#f2f2f2',
		borderBottomWidth: 0.5,
		display: 'flex',
		flexDirection: 'row',
		height: 60,
		marginLeft: 5,
		padding: 10,
		paddingTop: 8,
	},
	loading: {
		marginRight: 15,
	},
	myLocation: {
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 25,
		bottom: 40,
		elevation: 1,
		height: 50,
		justifyContent: 'center',
		left: Platform.OS === 'web' ? 10 : null,
		position: 'absolute',
		right: Platform.OS === 'web' ? null : 10,
		shadowColor: '#000',
		shadowOffset: {
			height: 2,
			width: 0,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1,
		width: 50,
		zIndex: 10,
	},
	nearPlaceLoading: {
		marginTop: 20,
	},
	pin: {
		height: 40,
		left: width / 2,
		marginLeft: -20,
		marginTop: -40,
		position: 'absolute',
		top: height / 2,
		width: 40,
	},
	price: {
		color: '#999',
	},
	right: {
		flex: 1,
		marginLeft: 10,
		marginRight: 10,
	},
	search: {
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 25,
		bottom: 100,
		elevation: 1,
		height: 50,
		justifyContent: 'center',
		left: Platform.OS === 'web' ? 10 : null,
		position: 'absolute',
		right: Platform.OS === 'web' ? null : 10,
		shadowColor: '#000',
		shadowOffset: {
			height: 2,
			width: 0,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1,
		width: 50,
		zIndex: 10,
	},
	searchContent: {
		alignItems: 'center',
		backgroundColor: 'white',
		flexDirection: 'row',
		height: 60,
	},
	searchItem: {
		description: {
			color: '#BBB',
			fontSize: 13,
		},
		icon: {
			alignItems: 'center',
			backgroundColor: 'white',
			borderRadius: 15,
			height: 30,
			justifyContent: 'center',
			marginLeft: 15,
			marginRight: 15,
			width: 30,
		},
		name: {
			marginBottom: 2,
		},
		style: {
			alignItems: 'center',
			flexDirection: 'row',
			height: 40,
			marginBottom: 20,
			marginRight: 15,
			width: width - 60,
		},
		textContainer: {
			marginRight: 15,
		},
	},
	textinput: {
		flex: 1,
		fontSize: 15,
		paddingLeft: 10,
		paddingRight: 10,
	},
	title: {
		flex: 1,
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 10,
		marginRight: 10,
		textAlign: 'center',
	},
}
