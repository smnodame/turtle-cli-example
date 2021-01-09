import React, { Component } from 'react'

import VideoRecorder from 'react-video-recorder'
import { View } from 'react-native'
import getBlobDuration from 'get-blob-duration'

class VideoRecording extends Component {
    render = () => {
        return (
            <View style={styles.content}>
                <VideoRecorder 
                    timeLimit={10000}
                    mimeType={'video/mp4'}
                    onRecordingComplete={(recordedBlob) => {
                        getBlobDuration(recordedBlob).then((duration) => {
                            if(duration > 10) {
                                return
                            }

                            const url = URL.createObjectURL(recordedBlob)
                            this.props.onRecordedVideo(recordedBlob, url)
                        })
                    }} 
                />
                <h5 style={styles.warning}>Maximum recording time is 10 seconds</h5>
            </View>

        )
    }
}

export default VideoRecording

const styles = {
    content: { 
        display: 'flex', 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    warning: {
        position: 'absolute',
        bottom: 0,
        color: '#ffc107'
    }
}
