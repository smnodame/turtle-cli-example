import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps'

import React from 'react'

const LocationView = ({ currentMessage }) => {
	const location = {
		lat: currentMessage.location.latitude,
		lng: currentMessage.location.latitude,
	}
	return (
		<GoogleMap {...this.props} defaultZoom={5} defaultCenter={location} center={location}>
			<Marker position={location}></Marker>
		</GoogleMap>
	)
}

const Map = withScriptjs(withGoogleMap((props) => <LocationView {...props} />))

export default Map
