import * as apis from '../../redux/apis'

import {
	ActivityIndicator,
	Dimensions,
	Image,
	Platform,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	View,
} from 'react-native'
import { Entypo, MaterialIcons } from 'hybrid-icon'

import { ContentHeader } from '../../layout/header'
import MapView from 'react-native-maps'
import Modal from 'react-native-full-modal'
import React from 'react'
import SearchModal from './search'
import _ from 'lodash'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import decodePolyline from '../../utils/decodePolyline'
import generateMessage from '../../utils/generateMessage'
import { setVariables } from '../../modules/setVariables'
import settings from '../../settings'

const dementions = Dimensions.get('window')
const { height, width } = {
	height: dementions.height + 65,
	width: dementions.width,
}

class Map extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			source: {
				coords: {},
				name: '',
			},
			destination: {
				coords: {},
				name: '',
			},
			polygon: [],
			isShowingPopup: true,
		}

		this.placeTypes = _.get(props.question, 'place_types', []).join(',')
		this.searchHeader = _.get(props.question, 'search_header', 'Search')
		this.redius = _.get(props.question, 'redius', 10000)
	}

	componentWillMount() {
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

	renderDirection = (origin, destination) => {
		const { credentials } = this.props
		apis.directions(origin, destination, credentials.map.apiKey).then((result) => {
			if (result.error_message) {
				return
			}

			if (result.routes.length) {
				const poligon = decodePolyline(result.routes[0].overview_polyline.points) // definition below
				this.setState({
					polygon: poligon,
					distance: result.routes[0].legs[0].distance.text,
					polyline: result.routes[0].overview_polyline.points,
				})

				if (Platform.OS !== 'web') {
					this.mapRef.fitToCoordinates(
						poligon,
						{
							edgePadding: { top: 30, right: 30, bottom: 30, left: 30 },
							animated: true,
						} // not animated
					)
				}
			}
		})
	}

	getLocationAsync = () => {
		const { addMessageToChat } = this.props
		new Promise((resolve) => {
			navigator.geolocation.getCurrentPosition(
				(location) => {
					this.getLocationName(location.coords).then((name) => {
						resolve({
							coords: location.coords,
							name,
						})
					})
				},
				() => {
					this.setState({
						hasCameraPermission: false,
						loading: false,
					})
					addMessageToChat(
						{},
						settings.permissions[settings.language.selected].NO_GEOGRAPHY_PERMISSION
					)
				}
			)
		}).then((location) => {
			this.currentLocation = {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			}

			this.setState(
				{
					loading: false,
					currentLocation: {
						...this.currentLocation,
					},
					hasCameraPermission: true,
					source: {
						coords: {
							latitude: location.coords.latitude,
							longitude: location.coords.longitude,
						},
						name: location.name,
					},
					currentLocationName: location.name,
				},
				() => {
					this.renderDirection(this.state.source.coords, this.state.destination.coords)
				}
			)
		})
	}

	getLocationName = (region) => {
		const {
			credentials: {
				map: { apiKey },
			},
		} = this.props
		return fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&sensor=true&key=${apiKey}`
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.error_message) return 'Your location'

				return data.results[0].formatted_address
			})
	}

	onSend = () => {
		const { question, answers, storeAnswers, onSend, variables } = this.props

		if (!this.state.destination.name) {
			return
		}

		this.setState({
			show: false,
		})

		const answer = {
			[question.id]: {
				answer: {
					source_latitude: {
						label: 'Latitude source',
						value: this.state.source.coords.latitude,
					},
					source_longitude: {
						label: 'Longitude source',
						value: this.state.source.coords.longitude,
					},
					source_coordinate: {
						label: 'Coordinate source ',
						value: `${this.state.source.coords.latitude},${this.state.source.coords.longitude}`,
					},
					source_location_name: {
						label: 'Location name of source',
						value: this.state.source.name,
					},
					destination_latitude: {
						label: 'Latitude destination',
						value: this.state.destination.coords.latitude,
					},
					destination_longitude: {
						label: 'Longitude Destination',
						value: this.state.destination.coords.longitude,
					},
					destination_coordinate: {
						label: 'Coordinate Destination',
						value: `${this.state.destination.coords.latitude},${this.state.destination.coords.longitude}`,
					},
					destination_location_name: {
						label: 'Location name of Destination',
						value: this.state.destination.name,
					},
					distance: {
						label: 'Distance',
						value: this.state.distance,
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
		const message = generateMessage(question.message, answers, answer)

		onSend(
			{
				text: message,
				direction: {
					source: this.state.source.coords,
					destination: this.state.destination.coords,
					polyline: this.state.polyline,
				},
			},
			_.get(question, 'trigger.right')
		)
	}

	render = () => {
		const { hasCameraPermission, loading, isShowingPopup } = this.state

		if (loading) {
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

		const { credentials } = this.props
		return (
			<Modal animationType='slide' transparent={false} visible={true}>
				<ContentHeader onBackClick={this.hideModel} onDoneClick={this.onSend} />
				<View>
					<View style={{ backgroundColor: '#6049FB', display: 'flex', padding: 15 }}>
						<View
							style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
						>
							<MaterialIcons
								active
								name='my-location'
								size={18}
								style={{ color: 'white', marginTop: 6, marginRight: 10 }}
							/>
							<TouchableOpacity
								onPress={() => {
									this.setState({
										page: 'source',
									})
								}}
								style={{
									display: 'flex',
									flexDirection: 'row',
									height: 35,
									borderRadius: 5,
									paddingHorizontal: 20,
									paddingLeft: 10,
									paddingRight: 10,
									marginLeft: 5,
									marginRight: 5,
									marginBottom: 5,
									backgroundColor: '#7773FD',
									marginTop: 10,
									alignItems: 'center',
									flex: 1,
								}}
							>
								<Text style={{ color: 'white' }} numberOfLines={1}>
									{this.state.source.name}
								</Text>
							</TouchableOpacity>
						</View>
						<View
							style={{
								width: 4,
								height: 4,
								backgroundColor: 'white',
								borderRadius: 2,
								position: 'absolute',
								left: 22,
								top: 60,
							}}
						></View>
						<View
							style={{
								width: 4,
								height: 4,
								backgroundColor: 'white',
								borderRadius: 2,
								position: 'absolute',
								left: 22,
								top: 70,
							}}
						></View>
						<View
							style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
						>
							<Entypo
								active
								name='location-pin'
								size={20}
								style={{ color: 'white', marginTop: 6, marginRight: 10 }}
							/>
							<TouchableOpacity
								onPress={() => {
									this.setState({
										page: 'destination',
									})
								}}
								style={{
									display: 'flex',
									flexDirection: 'row',
									height: 35,
									borderRadius: 5,
									paddingHorizontal: 20,
									paddingLeft: 10,
									paddingRight: 10,
									marginLeft: 5,
									marginRight: 5,
									marginBottom: 5,
									backgroundColor: '#7773FD',
									marginTop: 10,
									alignItems: 'center',
									flex: 1,
								}}
							>
								<Text style={{ color: 'white' }} numberOfLines={1}>
									{this.state.destination.name}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<MapView
						style={{ alignSelf: 'stretch', height: height }}
						ref={(ref) => {
							this.mapRef = ref
						}}
						region={this.state.currentLocation}
						polyline={this.state.polygon}
					>
						<MapView.Marker
							coordinate={this.currentLocation}
							scaledSize={{ width: 80, height: 80 }}
							anchor={{ x: 40, y: 40 }}
							icon={require('../../images/my-location-icon.png')}
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
						</MapView.Marker>
						{!!(this.state.source.name !== 'Your location') && (
							<MapView.Marker
								coordinate={this.state.source.coords}
								icon={require('../../images/location.png')}
								scaledSize={{ width: 12, height: 12 }}
							>
								<View
									style={{
										width: 22,
										height: 22,
										borderRadius: 11,
										backgroundColor: 'white',
										borderWidth: 2,
										borderColor: 'black',
									}}
								></View>
							</MapView.Marker>
						)}
						<MapView.Marker
							coordinate={this.state.destination.coords}
							icon={require('../../images/pin.png')}
						>
							<Image
								source={require('../../images/pin.png')}
								style={{ width: 30, height: 30 }}
							/>
						</MapView.Marker>
						<MapView.Polyline
							coordinates={this.state.polygon}
							strokeColor='#000000'
							strokeWidth={8}
							strokeWeight={8}
							strokeOpacity={0.8}
							fillOpacity={0.35}
						/>
						<MapView.Polyline
							coordinates={this.state.polygon}
							strokeColor='#7773FD'
							strokeWidth={6}
							strokeWeight={6}
							strokeOpacity={0.6}
							fillOpacity={0.35}
						/>
					</MapView>
				</View>
				<TouchableHighlight
					underlayColor='rgba(0, 0, 0, 0)'
					onPress={() => {
						this.setState({
							currentLocation: this.currentLocation,
						})
					}}
					style={styles.myLocation}
				>
					<View ref={(component) => (this._root_my_location = component)}>
						<MaterialIcons
							active
							name='my-location'
							size={25}
							style={{ marginTop: 2, marginLeft: 1, color: '#6e6f8f' }}
						/>
					</View>
				</TouchableHighlight>
				<SearchModal
					coords={this.state.source}
					apiKey={credentials.map.apiKey}
					redius={this.redius}
					visible={this.state.page === 'source'}
					placeTypes={this.placeTypes}
					currentLocation={this.currentLocation}
					currentLocationName={this.state.currentLocationName}
					onClose={() => {
						this.setState({
							page: null,
						})
					}}
					onChoose={(location) => {
						this.setState(
							{
								source: location,
								currentLocation: null,
							},
							() => {
								this.renderDirection(
									this.state.source.coords,
									this.state.destination.coords
								)
							}
						)
					}}
				/>
				<SearchModal
					coords={this.state.source}
					apiKey={credentials.map.apiKey}
					redius={this.redius}
					visible={this.state.page === 'destination'}
					placeTypes={this.placeTypes}
					currentLocation={this.currentLocation}
					currentLocationName={this.state.currentLocationName}
					onClose={() => {
						this.setState({
							page: null,
						})
					}}
					onChoose={(location) => {
						this.setState(
							{
								destination: location,
								currentLocation: null,
							},
							() => {
								this.renderDirection(
									this.state.source.coords,
									this.state.destination.coords
								)
							}
						)
					}}
				/>
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
			borderRadius: '50%',
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
