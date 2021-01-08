import React from 'react'
import SignaturePad from './react-native-signature-pad'
import { View } from 'react-native'

export default class DrawPad extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            key : Math.floor(Math.random(100) * 100)
        }

        this.base64DataUrl = null
    }

    componentDidMount() {
        this.props.getRef(this)
    }

    toDataURL = () => this.base64DataUrl

    clear = () => {
        this.base64DataUrl = null
        this.setState({ 
            key : Math.floor(Math.random(100) * 100)
        })
    }

    render() {
        return (
            <View key={this.state.key} style={{ flex: 1 }}>
                <SignaturePad
                    onChange={({base64DataUrl}) => this.base64DataUrl = base64DataUrl}
                    onError={() => {}}
                    style={{flex: 1, backgroundColor: 'white'}}
                />
            </View>
        )
    }
}
