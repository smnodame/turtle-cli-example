import React from 'react'
import Recorder from './recorder'

export default class ReactRecorder extends React.Component {
    constructor(props) {
        super(props)
        this.timer = 0
    }

    componentDidMount() {
        
    }

    startTimer = () => {
        // first call
        this.timer = this.timer + 200
        this.props.timer(this.timer)

        this.timerFunc = setInterval(() => {
            this.props.timer(this.timer)
            this.timer = this.timer + 200
        }, 200)
    }

    onStopRecording = (url) => {
        clearInterval(this.timerFunc)
        this.timer = 0
        this.props.onStopRecording(url)
    }

    onStartRecording  = () => {
        this.startTimer()
    }

    render = () => {
        return (
            <Recorder command={this.props.status} onStop={this.onStopRecording} onStart={this.onStartRecording} />
        )
    }
}