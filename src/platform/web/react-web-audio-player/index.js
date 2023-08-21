import './style.css'

import React from 'react'
import { View } from 'react-native'

export default class AudioPlayer extends React.Component {
    render() {
        return (
            <View>
                <audio controls className='audio-container' >
                    <source  src={this.props.source} type="audio/ogg" />
                    <source  src={this.props.source} type="audio/mpeg" />
                </audio>
            </View>
        )
    }
}