import * as apis from '../../redux/apis'

import {
	ActivityIndicator,
	Animated,
	Dimensions,
	Image,
	TextInput as Input,
	Platform,
	ScrollView,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native'
import { Entypo, FontAwesome, MaterialIcons } from 'hybrid-icon'

import { ContentHeader } from '../../layout/header'
import MapView, { Marker } from 'react-native-maps'
import Modal from 'react-native-full-modal'
import React from 'react'
import _ from 'lodash'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import generateMessage from '../../utils/generateMessage'
import { setVariables } from '../../modules/setVariables'
import { getCurrentLocation } from 'react-native-location'
import settings from '../../settings'

const dementions = Dimensions.get('window')
const { width } = {
	height: dementions.height + 65,
	width: dementions.width,
}

class Map extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			marker: {
				title: '',
			},
			nearPlaces: [],
			isNearPlaceLoading: true,
			keyboardAvoiding: 0,
			mapLocation: null,
			isMarkerLoading: true,
			isShowCallout: true,
			hasCameraPermission: null,
			isShowingPopup: true,
		}

		this.placeTypes = _.get(props.question, 'place_types', []).join(',')
		this.searchHeader = _.get(props.question, 'search_header', 'Search')
		this.redius = _.get(props.question, 'redius', 10000)
	}

	componentDidMount() {
		this.getLocationAsync()
	}

	hideModel = () => {
		this.setState({
			isShowingPopup: false,
		})
	}

	showModal = () => {
		this.setState({
			isShowingPopup: true,
		})
	}

	getLocationAsync = () => {
		const { addMessageToChat } = this.props

		getCurrentLocation().then(
			(location) => {
				const coords = {
					latitude: location.latitude,
					longitude: location.longitude,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}

				this.userLocation = {
					...coords,
				}

				this.mapLocation = {
					...coords,
				}

				this.setState(
					{
						hasCameraPermission: true,
						isLoading: false,
						mapLocation: {
							...coords,
						},
					},
					() => {
						this.onRegionChange(coords)
					}
				)
			},
			() => {
				this.setState({
					hasCameraPermission: false,
					isLoading: false,
				})

				addMessageToChat(
					{},
					settings.permissions[settings.language.selected].NO_GEOGRAPHY_PERMISSION
				)
			}
		)
	}

	onRegionChange = (coords) => {
		clearTimeout(this.timeout)

		this.setState({
			isNearPlaceLoading: true,
			isMarkerLoading: true,
		})

		this.setState({
			mapLocation: null,
		})

		this.mapLocation = coords

		this.timeout = setTimeout(() => {
			const { credentials } = this.props
			if (!this.state.text) {
				apis.nearbysearch(
					coords,
					this.redius,
					this.placeTypes,
					credentials.map.apiKey
				).then((data) => {
					if (data.error_message) {
						return
					}

					this.setState({
						nearPlaces: data.results,
						isNearPlaceLoading: false,
					})
				})
			} else {
				this.setState({
					isNearPlaceLoading: false,
				})
			}

			fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&sensor=true&key=${credentials.map.apiKey}`
			)
				.then((res) => res.json())
				.then((data) => {
					if (data.error_message) {
						return
					}

					this.setState({
						marker: {
							title: data.results[0].formatted_address,
						},
						isMarkerLoading: false,
					})
				})
		}, 1500)
	}

	onSearch = (filter) => {
		// if clear search should back to show search result of map location
		if (!filter) {
			this.onRegionChange(this.mapLocation)
			return
		}

		clearTimeout(this.timeout)

		this.setState({
			isNearPlaceLoading: true,
		})

		this.timeout = setTimeout(() => {
			const { credentials } = this.props
			apis.findplacefromtext(
				filter,
				this.redius,
				this.mapLocation,
				credentials.map.apiKey
			).then((data) => {
				if (data.error_message) {
					return
				}

				this.setState({
					nearPlaces: data.candidates,
					isNearPlaceLoading: false,
				})
			})
		}, 1500)
	}

	onSend = (placeName, lat, lng) => {
		const { question, answers, storeAnswers, onSend, variables } = this.props

		const answer = {
			[question.id]: {
				answer: {
					latitude: {
						value: lat,
					},
					longitude: {
						value: lng,
					},
					coordinate: {
						value: `${lat},${lng}`,
					},
					location_name: {
						value: placeName,
					},
					created_at: {
						value: new Date(),
					},
				},
				mode: question.mode,
			},
		}

		setVariables(question.id, variables, answer)
		
		// store answers in store
		storeAnswers(
			{
				...answers,
				...answer,
			},
			answer
		)

		// generate answer and replace expression
		const message = generateMessage(question.answer || placeName, answers, answer)

		onSend(
			{
				text: message,
				location: {
					lat: lat,
					lng: lng,
				},
			},
			_.get(question, 'trigger.right')
		)
	}

	render = () => {
		const { hasCameraPermission, isLoading, page, isShowingPopup } = this.state

		if (isLoading) {
			return (
				<Modal animationType='slide' transparent={false} visible={true}>
					<View style={styles.boostrap}>
						<ActivityIndicator size='large' />
					</View>
				</Modal>
			)
		}

		if (!hasCameraPermission) {
			return (
				<TouchableOpacity onPress={this.getLocationAsync} style={styles.button}>
					<Text numberOfLines={1} style={styles.text}>
						Continue
					</Text>
				</TouchableOpacity>
			)
		}

		if (!isShowingPopup) {
			return (
				<TouchableOpacity onPress={this.showModal} style={styles.button}>
					<Text numberOfLines={1} style={styles.text}>
						Continue
					</Text>
				</TouchableOpacity>
			)
		}

		return (
			<Modal animationType='slide' transparent={false} visible={true}>
				<Modal animationType='slide' transparent={false} visible={page === 'search'}>
					<ContentHeader
						onBackClick={() => {
							this.setState({
								page: null,
							})
						}}
					/>
					<View style={styles.searchContent}>
						<View regular style={styles.inputContainer}>
							<FontAwesome active name='search' size={20} style={{ color: '#999' }} />
							<Input
								style={styles.textinput}
								value={this.state.text}
								onChangeText={(text) => {
									clearTimeout(this.searchTimeout)
									this.setState(
										{
											text: text,
										},
										() => {
											this.searchTimeout = setTimeout(() => {
												this.onSearch(text)
											}, 800)
										}
									)
								}}
								underlineColorAndroid='transparent'
								placeholderTextColor={'#999'}
								placeholder={'SEARCH'}
							/>
							{!!this.state.text && (
								<TouchableHighlight
									onPress={() => {
										this.setState(
											{
												text: '',
											},
											() => {
												this.onRegionChange(this.mapLocation)
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
								</TouchableHighlight>
							)}
						</View>
					</View>
					{this.state.isNearPlaceLoading && (
						<View style={styles.isNearPlaceLoading}>
							<ActivityIndicator size='small' />
						</View>
					)}
					{!this.state.isNearPlaceLoading && (
						<ScrollView>
							<View style={{ marginTop: 15 }} />
							{this.state.nearPlaces.length > 0 &&
								this.state.nearPlaces.map((place) => {
									return (
										<TouchableHighlight
											onPress={() => {
												this.setState({
													mapLocation: {
														lat: place.geometry.location.lat,
														lng: place.geometry.location.lng,
														latitude: place.geometry.location.lat,
														longitude: place.geometry.location.lng,
														latitudeDelta: 0.0922,
														longitudeDelta: 0.0421,
													},
													marker: {
														title: place.name,
													},
													page: null,
												})
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
										</TouchableHighlight>
									)
								})}
							{this.state.nearPlaces.length === 0 && (
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
				<View style={{ display: 'flex', flex: 1 }}>
					<ContentHeader
						onBackClick={this.hideModel}
						onDoneClick={() => {
							if (!this.state.isMarkerLoading) {
								this.onSend(
									this.state.marker.title,
									this.mapLocation.latitude,
									this.mapLocation.longitude
								)
							}
						}}
					/>
					<View
						style={{
							display: 'flex',
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<MapView
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
								position: 'absolute',
								top: 0,
								bottom: 0,
								left: 0,
								right: 0,
							}}
							onRegionChange={(coords) => {
								this.onRegionChange(coords)
							}}
							region={this.state.mapLocation}
						>
							<Marker
								coordinate={this.userLocation}
								icon={require('../../images/my-location-icon.png')}
								scaledSize={{ width: 80, height: 80 }}
								anchor={{ x: 40, y: 40 }}
							>
								<View
									style={{
										width: 34,
										height: 34,
										borderRadius: 17,
										backgroundColor: '#7EC0EE55',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<View
										style={{
											width: 22,
											height: 22,
											borderRadius: 11,
											backgroundColor: '#7EC0EE',
											borderWidth: 2,
											borderColor: 'white',
										}}
									></View>
								</View>
							</Marker>
						</MapView>
						<Animated.View style={[styles.pin]}>
							<TouchableWithoutFeedback
								onPress={() => {
									this.setState({
										isShowCallout: !this.state.isShowCallout,
									})
								}}
							>
								<Image
									source={require('../../images/pin.png')}
									style={{
										height: 40,
										width: 40,
									}}
								/>
							</TouchableWithoutFeedback>
						</Animated.View>
						{this.state.isShowCallout && !this.state.isHolded && (
							<TouchableHighlight
								underlayColor='rgba(0, 0, 0, 0)'
								onPress={() => {
									if (!this.state.isMarkerLoading) {
										this.onSend(
											this.state.marker.title,
											this.mapLocation.latitude,
											this.mapLocation.longitude
										)
									}
								}}
								style={[calloutStyles.container]}
							>
								<View>
									<View style={calloutStyles.bubble}>
										{!this.state.isMarkerLoading && (
											<View style={calloutStyles.amount}>
												<View>
													<Text style={calloutStyles.shareTitle}>
														{'Share location >'}
													</Text>
													<Text
														numberOfLines={3}
														style={calloutStyles.textTitle}
													>
														{this.state.marker.title}
													</Text>
												</View>
											</View>
										)}
										{this.state.isMarkerLoading && (
											<View style={calloutStyles.loading}>
												<ActivityIndicator size='small' />
											</View>
										)}
									</View>
									<View style={calloutStyles.arrowBorder} />
									<View style={calloutStyles.arrow} />
								</View>
							</TouchableHighlight>
						)}
						<TouchableHighlight
							underlayColor='rgba(0, 0, 0, 0)'
							onPress={() => {
								this.setState(
									{
										mapLocation: {
											...this.userLocation,
											latitudeDelta: 0.0922,
											longitudeDelta: 0.0421,
										},
									},
									() => {
										this.onSearch()
									}
								)
							}}
							style={styles.myLocation}
						>
							<View>
								<MaterialIcons
									active
									name='my-location'
									size={25}
									style={{ marginTop: 2, marginLeft: 1, color: '#6e6f8f' }}
								/>
							</View>
						</TouchableHighlight>
						<TouchableHighlight
							underlayColor='rgba(0, 0, 0, 0)'
							onPress={() => {
								this.setState({
									page: 'search',
									mapLocation: this.mapLocation,
								})
							}}
							style={styles.search}
						>
							<View>
								<FontAwesome
									active
									name='search'
									size={25}
									style={{ marginTop: 2, marginLeft: 1, color: '#6e6f8f' }}
								/>
							</View>
						</TouchableHighlight>
					</View>
				</View>
			</Modal>
		)
	}
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
	addMessageToChat: (question, message) => {
		dispatch(
			actions.addMessageToChat({
				text: message,
				question,
			})
		)
	},
})

const Container = connect(mapStateToProps, mapDispatchToProps)(Map)

export default Container

const styles = {
	back: {
		flex: 1,
		marginLeft: 10,
		marginRight: 10,
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
	button: {
		alignItems: 'center',
		backgroundColor: '#F8F8F8',
		borderColor: '#EEE',
		borderTopWidth: 1,
		borderWidth: 0.5,
		height: 60,
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
		paddingHorizontal: 20,
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
	isNearPlaceLoading: {
		marginTop: 20,
	},
	pin: {
		height: 40,
		marginTop: -40,
		width: 40,
		alignItems: 'center',
		justifyContent: 'center',
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
	text: {
		color: '#4B4B4B',
		fontSize: 14,
	},
	textinput: {
		fontSize: 15,
		paddingLeft: 10,
		paddingRight: 10,
		flex: 1,
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

var calloutStyles = {
	amount: {
		flex: 1,
	},
	arrow: {
		alignSelf: 'center',
		backgroundColor: 'transparent',
		borderColor: 'transparent',
		borderTopColor: 'rgba(53, 54, 85, 0.9)',
		borderWidth: 16,
		marginTop: -32,
	},
	arrowBorder: {
		alignSelf: 'center',
		backgroundColor: 'transparent',
		borderColor: 'transparent',
		borderTopColor: 'white',
		borderWidth: 16,
		marginTop: -0.5,
	},
	bubble: {
		alignSelf: 'flex-start',
		backgroundColor: 'rgba(53, 54, 85, 0.9)',
		borderColor: 'white',
		borderRadius: 6,
		borderWidth: 0.5,
		flexDirection: 'row',
		paddingHorizontal: 20,
		paddingVertical: 12,
		width: 200,
	},
	container: {
		alignSelf: 'flex-start',
		bottom: '55%',
		flexDirection: 'column',
		left: '50%',
		marginLeft: -100,
		marginTop: -300,
		position: 'absolute',
	},
	dollar: {},
	loading: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
	shareTitle: {
		color: '#6e6f8f',
		fontSize: 12,
		marginBottom: 5,
	},
	textTitle: {
		color: '#fff',
		fontSize: 14,
	},
}
