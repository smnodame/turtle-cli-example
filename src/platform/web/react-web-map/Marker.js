import React, { Component } from 'react'

import { Marker } from 'react-google-maps'

class MapViewMarker extends Component {
    render() {
        return (
            <Marker
                icon={{
                    url: this.props.icon || null,
                    scaledSize: this.props.scaledSize || { width: 26, height: 26 },
                    anchor: this.props.anchor
                }}
                title={this.props.title}
                position={{ lat: this.props.coordinate.latitude, lng: this.props.coordinate.longitude }}
            >
                {this.props.children}
            </Marker>
        )
    }
}

export default MapViewMarker
