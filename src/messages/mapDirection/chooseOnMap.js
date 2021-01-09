import {
	Dimensions,
	Image,
	Platform,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	View,
} from 'react-native'

import MapView from 'react-native-maps'
import { MaterialIcons } from 'hybrid-icon'
import Modal from 'react-native-full-modal'
import React from 'react'

const { width } = Dimensions.get('window')

class ChooseOnMap extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentWillMount() {}

	componentDidMount = () => {
		this.setState({
			location: {
				...this.props.currentLocation,
			},
		})

		this.region = this.props.currentLocation
	}

	componentWillUnmount() {}

	onRegionChange = (region) => {
		this.region = region
	}

	getCoords = () => {
		if (this.state.location) {
			return {
				...this.state.location,
			}
		} else if (this.props.coords) {
			return {
				...this.props.coords.coords,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			}
		} else {
			return {
				...this.props.currentLocation,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			}
		}
	}

	render = () => {
		return (
			<Modal animationType='slide' transparent={false} visible={!!this.props.visible}>
				<View style={{ flex: 1 }}>
					<View
						style={{
							backgroundColor: '#6049FB',
							display: 'flex',
							padding: 15,
							height: 80,
						}}
					>
						<Text
							style={{
								fontWeight: '600',
								fontSize: 18,
								color: 'white',
								textAlign: 'center',
								paddingTop: 6,
							}}
						>
							Choose starting point
						</Text>
						<Text
							style={{
								fontWeight: '400',
								fontSize: 14,
								color: 'white',
								textAlign: 'center',
								paddingTop: 6,
							}}
						>
							Pand and zoom to adjust
						</Text>
					</View>
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
							ref={(ref) => {
								this.mapRef = ref
							}}
							region={this.getCoords()}
							onRegionChange={this.onRegionChange}
						>
							<MapView.Marker
								coordinate={this.props.currentLocation}
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
							</MapView.Marker>
						</MapView>
						<Image
							source={require('../../images/pin.png')}
							style={{
								width: 30,
								height: 30,
								marginTop: -30,
								alignItems: 'center',
								justifyContent: 'center',
							}}
						/>
					</View>
					<TouchableHighlight
						underlayColor='rgba(0, 0, 0, 0)'
						onPress={() => {
							this.setState({
								location: {
									...this.props.currentLocation,
								},
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
					<TouchableOpacity
						onPress={() => {
							this.props.onChoose(this.region)
						}}
						style={styles.button}
					>
						<Text numberOfLines={1} style={styles.text}>
							OK
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		)
	}
}

const styles = {
	button: {
		alignItems: 'center',
		backgroundColor: '#F8F8F8',
		borderColor: '#EEE',
		borderTopWidth: 1,
		borderWidth: 0.5,
		height: 60,
		justifyContent: 'center',
		width: width,
	},
	myLocation: {
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 25,
		bottom: 75,
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
	text: {
		color: '#4B4B4B',
		fontSize: 14,
	},
}

export default ChooseOnMap
