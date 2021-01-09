import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import MapView from 'react-native-maps'
import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'

const LocationView = ({ currentMessage, mapViewStyle, containerStyle }) => (
    <TouchableOpacity style={[ containerStyle ]} onPress={() => {
        const url = Platform.select({
            ios: `http://maps.apple.com/?ll=${currentMessage.location.latitude},${currentMessage.location.longitude}`,
            android: `http://maps.google.com/?q=${currentMessage.location.latitude},${currentMessage.location.longitude}`
        })
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                return Linking.openURL(url)
            }
        }).catch(err => {
            console.error('An error occurred', err)
        })
    }}>
        <MapView
            style={[styles.mapView, mapViewStyle]}
                region={{
                latitude: currentMessage.location.latitude,
                longitude: currentMessage.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            }}
            scrollEnabled={false}
            zoomEnabled={false}
        >
        <MapView.Marker
            image={require('../../../images/small-pin.png')}
            coordinate={{latitude: currentMessage.location.latitude, longitude: currentMessage.location.longitude}}
        />
        </MapView>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3
  }
})

export default LocationView