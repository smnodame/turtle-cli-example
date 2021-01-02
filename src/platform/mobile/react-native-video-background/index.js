import { Dimensions } from 'react-native'
import React from 'react'
import { Video } from 'expo-av'

const VideoBackground = ({ src }) => {
    const {height, width} = Dimensions.get('window')

    return (
        <Video
            source={{ uri: src }}
            isMuted={true}
            resizeMode='cover'
            shouldPlay
            isLooping
            style={{ width, height }}
        />
    )
}

export default VideoBackground