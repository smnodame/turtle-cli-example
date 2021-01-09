import React from 'react'
import { Video } from 'expo-av'
import { View } from 'react-native'

function MessageVideo ({ source }) {
    return (
        <View style={styles.container}>
            <Video
                resizeMode='cover'
                style={styles.video}
                source={{ uri: source.uri }}
                useNativeControls={true}
            />
        </View>
    )
}

export default MessageVideo

const styles = {
    container: {
        width: 150,
        height: 100,
        borderRadius: 13,
        margin: 3,
        backgroundColor: 'white', 
        marginTop: 10, 
        marginRight: 5
    },
    video: {
        width: 150, 
        height: 100
    }
}