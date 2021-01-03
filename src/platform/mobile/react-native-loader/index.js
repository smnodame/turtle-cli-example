import { DotIndicator } from 'react-native-indicators'
import React from 'react'

export const Bubbles = ({ size, color }) => {
    return <DotIndicator count={3} size={size} color={color} />
}
