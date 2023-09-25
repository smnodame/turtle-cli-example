import { ActivityIndicator, View } from 'react-native'
import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps'
import React, { Component } from 'react'

import Marker from './Marker'
import Polyline from './Polyline'
import _ from 'lodash'
import { connect } from 'react-redux'

const GoogleMapContainer = withScriptjs(
	withGoogleMap((props) => <GoogleMap {...props} ref={props.handleMapMounted} />)
)

class MapView extends Component {
	constructor(props) {
		super(props)
		this.state = {
			center: { lat: _.get(props, 'region.latitude'), lng: _.get(props, 'region.longitude') },
		}
	}

	handleMapMounted = (map) => {
		this.map = map
		if (this.props.polyline && this.props.polyline.length > 1 && this.map) {
			this.fitBounds(this.props.polyline)
		}
	}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.polyline !== this.props.polyline && this.map) {
			this.fitBounds(nextProps.polyline)
		}
	}

	fitBounds = (polyline) => {
		const bounds = new window.google.maps.LatLngBounds()
		polyline.forEach((bound) =>
			bounds.extend(new window.google.maps.LatLng(bound.latitude, bound.longitude))
		)
		this.map.fitBounds(bounds)
	}

	onDragEnd = () => {
		const center = this.map.getCenter()
		!!this.props.onRegionChange &&
			this.props.onRegionChange({ latitude: center.lat(), longitude: center.lng() })
	}

	render() {
		const { credentials, region, style } = this.props
		const center = region
			? {
					lat: _.get(region, 'latitude'),
					lng: _.get(region, 'longitude'),
			  }
			: null
		if (!this.state.center)
			return (
				<View style={{ ...style }}>
					<ActivityIndicator />
				</View>
			)

		return (
			<View style={{ ...style }}>
				<GoogleMapContainer
					loadingElement={<div style={{ height: `100%` }} />}
					googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${credentials.google.apiKey}`}
					handleMapMounted={this.handleMapMounted}
					containerElement={<div style={{ height: '100%', width: '100%' }} />}
					mapElement={<div style={{ height: '100%', width: '100%' }} />}
					center={center || this.state.center}
					onDragEnd={this.onDragEnd}
					defaultZoom={15}
				>
					{this.props.children}
				</GoogleMapContainer>
			</View>
		)
	}
}

MapView.Marker = Marker
MapView.Polyline = Polyline

const mapStateToProps = (state) => ({
	credentials: state.chat.credentials,
})

const mapDispatchToProps = (dispatch, ownProps) => ({})

const Container = connect(mapStateToProps, mapDispatchToProps)(MapView)

export {
	Marker,
	Polyline
}
export default Container
