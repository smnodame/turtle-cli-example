import React from 'react'
import { View } from 'react-native'

function MessageVideo ({ source: { uri } }) {
    return (
        <View style={styles.container}>
            <video style={styles.video} controls>
                <source src={uri} type='video/webm'></source>
                <source src={uri} type='video/mp4'></source>
                <source src={uri} type='video/ogg'></source>
            </video>
        </View>
    )
}

export default MessageVideo

const styles = {
    container: {
        borderRadius: 13,
        margin: 3,
        backgroundColor: 'white', 
        marginTop: 10, 
        marginRight: 5,
        overflow: 'hidden'
    },
    video: {
        width: '100%', 
        height: 210
    }
}