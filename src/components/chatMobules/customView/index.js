import { Image, Platform, StyleSheet, View } from 'react-native'

import AgreementApprove from './agreementApprove'
import MapView, { Marker, Polyline } from 'react-native-maps'
import React from 'react'
import SvgUri from 'react-native-svg-image'
import Video from 'react-native-custom-video'
import decodePolyline from '../../../utils/decodePolyline'

class CustomView extends React.Component {
	componentDidMount = () => {
		if (this.props.currentMessage.direction && Platform.OS !== 'web') {
			this.mapRef.fitToCoordinates(
				decodePolyline(this.props.currentMessage.direction.polyline),
				{ animated: true } // not animated
			)
		}
	}

	render() {
		if (this.props.currentMessage.location) {
			const location = {
				latitude: this.props.currentMessage.location.lat,
				longitude: this.props.currentMessage.location.lng,
			}

			return (
				<View className='message-map' style={styles.svg}>
					<MapView
						ref={(ref) => {
							this.mapRef = ref
						}}
						style={{ alignSelf: 'stretch', flex: 1, height: 111 }}
						region={{
							...location,
							latitudeDelta: 0.0922,
							longitudeDelta: 0.0421,
						}}
					>
						<Marker coordinate={location}>
							<Image
								source={require('../../../images/pin.png')}
								style={{ width: 30, height: 30 }}
							/>
						</Marker>
					</MapView>
				</View>
			)
		}

		if (this.props.currentMessage.question.mode === 'APPROVE') {
			return <AgreementApprove {...this.props} />
		}

		if (this.props.currentMessage.svg) {
			return (
				<View style={styles.svg}>
					<SvgUri
						svgXmlData={this.props.currentMessage.svg}
						width={'145'}
						height={'85'}
					/>
				</View>
			)
		}

		if (this.props.currentMessage.direction) {
			const polyline = decodePolyline(this.props.currentMessage.direction.polyline)
			const source = this.props.currentMessage.direction.source
			const destination = this.props.currentMessage.direction.destination
			return (
				<View className='message-map' style={styles.svg}>
					<MapView
						ref={(ref) => {
							this.mapRef = ref
						}}
						style={{ alignSelf: 'stretch', flex: 1 }}
						region={{
							latitude: (source.latitude + destination.latitude) / 2,
							longitude: (source.longitude + destination.longitude) / 2,
						}}
						polyline={polyline}
					>
						<Marker
							coordinate={this.props.currentMessage.direction.source}
							icon={require('../../../images/location.png')}
							scaledSize={{ width: 12, height: 12 }}
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
						<Marker
							coordinate={this.props.currentMessage.direction.destination}
							icon={require('../../../images/pin.png')}
						>
							<Image
								source={require('../../../images/pin.png')}
								style={{ width: 30, height: 30 }}
							/>
						</Marker>
						<Polyline
							coordinates={polyline}
							strokeColor='#000000'
							strokeWidth={8}
							strokeWeight={8}
							strokeOpacity={0.8}
							fillOpacity={0.35}
						/>
						<Polyline
							coordinates={polyline}
							strokeColor='#7773FD'
							strokeWidth={6}
							strokeWeight={6}
							strokeOpacity={0.6}
							fillOpacity={0.35}
						/>
					</MapView>
				</View>
			)
		}

		if (this.props.currentMessage.vdo) {
			return <Video source={{ uri: this.props.currentMessage.vdo }} />
		}
		return null
	}
}

export default CustomView

const styles = StyleSheet.create({
	mapView: {
		width: 150,
		height: 100,
		borderRadius: 13,
		margin: 3,
	},
	svg: {
		width: 150,
		height: 100,
		borderRadius: 13,
		margin: 3,
		backgroundColor: 'white',
		overflow: 'hidden',
	},
})