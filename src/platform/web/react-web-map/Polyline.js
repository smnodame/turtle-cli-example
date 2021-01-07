import React, { Component } from 'react'

import { Polyline } from 'react-google-maps'

class MapViewPolyline extends Component {
    
    render() {
        const coordinates = (this.props.coordinates || []).map((coord) => {
            return {
                lat: coord.latitude,
                lng: coord.longitude
            }
        })
        
        return (
            <Polyline
                path={coordinates}
                geodesic={true}
                options={{
                    ...this.props
                }}
            />
        )
    }
}

export default MapViewPolyline
