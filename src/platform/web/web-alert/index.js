import './style.css'

import {
    Text,
    TouchableOpacity,
    View
} from 'react-native'

import Modal from 'react-native-modal-enhanced'
import React from 'react'

let self = null

class AlertView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            title: '',
            description: '',
            cancel: {},
            confirm: {}
        }

        self = this
    }

    onCancel = () => {
        this.setState({
            visible: false
        }, () => {
            this.state.cancel.onPress()
        })
    }

    onConfirm = () => {
        this.setState({
            visible: false
        }, () => {
            this.state.confirm.onPress()
        })
    }

    render() {
        return (
            <Modal
                isVisible={this.state.visible}
                avoidKeyboard={true}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <View
                    className='alert'
                    style={styles.modal}
                >
                    <View style={styles.content}>
                        <Text style={styles.title}>
                            { this.state.title }
                        </Text>
                        <Text style={styles.description}>
                            { this.state.description }
                        </Text>
                        <View style={styles.buttonContainer}>
                            <View style={{ flex: 1 }} />
                            <TouchableOpacity
                                onPress={this.onCancel}
                                className='button'
                            >
                                <Text style={styles.cancel}>{this.state.cancel.text || 'CANCEL'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.onConfirm}
                                className='button primary'
                            >
                                <Text style={styles.confirm}>{this.state.confirm.text || 'CONFIRM'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}


export default {
    alert: (
        title,
        description,
        button
    ) => {
        self.setState({
            visible: true,
            title: title,
            description,
            cancel: button[0],
            confirm: button[1]
        })
    },
    view: () => <AlertView />
}

const styles = {
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 15,
        textAlign: 'right'
    },
    cancel: {
        color: 'rgba(0,0,0,.6)',
        fontWeight: '700'
    },
    confirm: {
        color: 'white',
        fontWeight: '700'
    },
    content: {
        padding: 15,
        paddingTop: 15,
        width: '100%'
    },
    description: {
        color: '#333'
    },
    modal: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'center',
        padding: 0,
        maxWidth: 600
    },
    title: {
        color: '#333',
        fontWeight: '600',
        marginBottom: 10
    }
}