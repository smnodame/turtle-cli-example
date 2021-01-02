import 'react-circular-progressbar/dist/styles.css'

import React, { Component } from 'react'

import CircularProgressbar from 'react-circular-progressbar'
import {
    View
} from 'react-native'

const PercentageCircle = ({ percent }) => {
    return (
        <View style={{ width: 55, height: 55 }}>
            <CircularProgressbar
                percentage={ percent }
                text={`${percent} %`}
            />
        </View>
    )
}

export default PercentageCircle