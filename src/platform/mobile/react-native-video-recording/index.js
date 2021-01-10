import * as Permissions from 'expo-permissions';

import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons'
import { Modal, Text, TouchableOpacity, View } from 'react-native'

import { Camera } from 'expo-camera';
import React from 'react'
import _ from 'lodash'
import moment from 'moment'

export default class VideoRecording extends React.Component {
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        show: true
    }

    onStart = async () => {
        if (this.camera) {

            this.setState({
                recording: true
            }, () => {
                let timer = 0
                this.timeout = setInterval(() => {
                    timer = timer + 1
                    const formatted = moment(timer, 'seconds').format('00:mm:ss', { trim: false })
                    this.setState({
                        timer: formatted
                    })
                }, 1000)
            })

            const video = await this.camera.recordAsync({ maxDuration: 30, quality: '480p' })
            this.props.onRecordedVideo(video.uri, video.uri)
            clearInterval(this.timeout)
        }
    }

    onStop = async () => {
        this.setState({
            recording: false
        })
        const video = await this.camera.stopRecording()
    }

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA)
        this.setState({ hasCameraPermission: status === 'granted' })
    }

    render() {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>
        } else {
            return (
                <View style={styles.container}>
                    <Camera ref={ref => { this.camera = ref }} style={styles.camera} type={this.state.type}>
                        <View
                            style={styles.body}
                        >
                            {
                                !this.state.recording && <TouchableOpacity
                                    style={styles.type}
                                    onPress={() => {
                                        this.setState({
                                            type: this.state.type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back,
                                        })
                                    }}
                                >
                                    <Ionicons name='camera-reverse-sharp' style={{ color: 'white', padding: 10,  }}  size={40} />
                                </TouchableOpacity>
                            }
                            <View
                                style={styles.timer.style}>
                                <Text style={styles.timer.text}>
                                    { this.state.timer || '00:00:00' }
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.button.style,
                                    {
                                        padding: this.state.recording? 15 : 2,
                                    }
                                ]}
                                onPress={() => {
                                    if(this.state.recording) {
                                        this.onStop()
                                    } else {
                                        this.onStart()
                                    }
                                }}
                            >
                            {
                                !this.state.recording &&
                                <View
                                    style={styles.button.start}
                                >
                                </View>
                            }
                            {
                                this.state.recording &&
                                <View style={styles.button.stop}>
                                </View>
                            }
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            )
        }
    }
}

const styles = {
    container: {
        flex: 1
    },
    body: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row'
    },
    camera: {
        flex: 1
    },
    button: {
        style: {
            position: 'absolute',
            left: '50%',
            marginLeft: -38,
            margin: 10,
            bottom: 0,
            width: 76,
            height: 76,
            borderRadius: 38,
            borderWidth: 5,
            borderColor: 'white',
            justifyContent: 'center',
            alignItems: 'center'
        },
        start: {
            width: 68,
            height: 68,
            borderRadius: 34,
            backgroundColor: 'red'
        },
        stop: {
            width: 40,
            height: 40,
            borderRadius: 5,
            backgroundColor: 'red',
            margin: 20
        }
    },
    timer: {
        style: {
            position: 'absolute',
            height: 50,
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            top: 0,
            borderColor: 'white',
            justifyContent: 'center',
            alignItems: 'center'
        },
        text: {
            fontSize: 16,
            color: 'white',
            marginTop: 10
        }
    },
    type: {
        position: 'absolute',
        right: 0,
        bottom: 0
    }
}
