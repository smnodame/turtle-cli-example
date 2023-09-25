import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { Camera } from 'expo-camera'
import React from 'react'
import _ from 'lodash'

export default class CameraPhoto extends React.Component {
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        show: true,
        processing: false
    }

    onTakePhoto = async () => {
        try {
            this.setState({
                processing: true
            })
            let photo = await this.camera.takePictureAsync({ quality: 0.5, skipProcessing: true })
            this.setState({
                processing: false
            }, () => {
                this.props.onTakePhoto(photo.uri)
            })
        } catch (e) {
            this.setState({
                processing: false
            })
        }
    }

    async componentWillMount() {
        const { granted } = await Camera.requestCameraPermissionsAsync()
		this.setState({
			hasCameraPermission: granted,
		})
    }

    render() {
        const { hasCameraPermission, processing } = this.state;
        if (hasCameraPermission === null) {
            return <View />
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>
        } else {
            return (
                <Camera ref={ref => { this.camera = ref }} style={{ flex: 1 }} type={this.state.type}>
                {
                    processing && <View style={styles.container}>
                        <View style={styles.loadingContainer.style}>
                            <ActivityIndicator size='small' color={'white'} />
                        </View>
                    </View>
                }
                {
                    !processing && <View
                        style={styles.container}>
                            <TouchableOpacity
                                style={styles.swipCamera.style}
                                onPress={() => {
                                    this.setState({
                                        type: this.state.type === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back,
                                    });
                                }}>
                                <Ionicons name='camera-reverse-sharp' style={styles.swipCamera.icon}  size={40} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button.style}
                                onPress={this.onTakePhoto}
                            >
                                <View style={styles.button.inner}></View>
                            </TouchableOpacity>
                        </View>
                }
                </Camera>
            )
        }
    }
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
    },
    swipCamera: {
        style: {
            position: 'absolute',
            right: 0,
            bottom: 0
        },
        icon: { color: 'white', padding: 10 }
    },
    loadingContainer: {
        style: {
            position: 'absolute',
            left: '50%',
            marginLeft: -38,
            margin: 10,
            bottom: 0,
            width: 76,
            height: 76,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
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
            alignItems: 'center',
            padding: 2
        },
        inner: {
            width: 74,
            height: 74,
            borderRadius: 37,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }
    }
}
