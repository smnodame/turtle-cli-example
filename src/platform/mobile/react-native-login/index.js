import * as Facebook from 'expo-facebook'
import * as Google from 'expo-google-app-auth'

import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import Icon, { Entypo, FontAwesome, Ionicons } from 'hybrid-icon'

import React from 'react'

class LogIn extends React.Component {
    constructor(props) {
        super(props)
    }

    facebookLogin = async () => {
        const { credentials, onAuthenticated } = this.props
        Facebook.initializeAsync(credentials.facebook.appId, 'appName')
        try {
            const {
                type,
                token,
            } = await Facebook.logInWithReadPermissionsAsync(credentials.facebook.appId, {
                permissions: ['public_profile', 'email'],
                behavior: 'browser',
            })
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`)
                const data = await response.json()
                onAuthenticated({
                    email: data.email,
                    image: `https://graph.facebook.com/${data.id}/picture?height=350&width=250`,
                    name: data.name,
                    largeImage: `https://graph.facebook.com/${data.id}/picture?height=350&width=250`
                })
            } else {
                Alert.alert('Something is wrong !')
            }
        } catch ({ message }) {
            Alert.alert(`Facebook Login Error: ${message}`)
        }
    }

    googleLogin = async () => {
        const { credentials, onAuthenticated } = this.props
        
        const logInResult = await Google.logInAsync({
            scopes: ['profile', 'email'],
            iosClientId: `577807098300-vmfne9udd8e8crlihdtapc98fpbmt2el.apps.googleusercontent.com`,
            androidClientId: `577807098300-mm0e8849avj0fkndjt8d1f5smjaq3qg3.apps.googleusercontent.com`,
            iosStandaloneAppClientId: `577807098300-a902b15okekee12ouorbcm216g2u5pbm.apps.googleusercontent.com`,
            androidStandaloneAppClientId: `577807098300-j2v8vo7r3a5gq7fgkek30uk0k7tjc8m6.apps.googleusercontent.com`
        });

        if (logInResult.type === 'success') {
            // Then you can use the Google REST API
            let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${logInResult.accessToken}` },
            })

            this.props.onAuthenticated({
                email: logInResult.user.email,
                image: logInResult.user.photoUrl,
                name: logInResult.user.name,
                largeImage: logInResult.user.photoUrl
            })
        }
    }

    render() {
        const { app } = this.props
        return (
            <View style={styles.container}>
                <Image source={{uri: app.icon }} style={styles.avatar} />
                <Text style={styles.name}>{ app.name }</Text>
                <TouchableOpacity 
                    onPress={this.facebookLogin}
                    style={{ ...styles.button, backgroundColor: '#428bca' }}
                >
                    <View style={{ paddingHorizontal: 12 }}>
                        <FontAwesome name='facebook' style={styles.icon} />
                    </View>
                    <Text style={styles.buttonText}>Sign in with Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={this.googleLogin}
                    style={{ ...styles.button, backgroundColor: '#d9534f' }}
                >
                    <View style={{ paddingHorizontal: 12 }}>
                        <FontAwesome name='google' style={styles.icon} />
                    </View>
                    <Text style={styles.buttonText}>Sign in with Google</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default LogIn

const styles = {
    container: {
        display: 'flex', 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    button: { 
        display: 'flex', 
        flexDirection: 'row', 
        backgroundColor: '#428bca', 
        paddingVertical: 16, 
        marginVertical: 4, 
        width: 280 
    },
    buttonText: { 
        flex: 1, 
        color: 'white', 
        fontWeight: '600', 
        textAlign: 'center', 
        marginLeft: -26  
    },
    icon: {
        color: 'white', 
        fontSize: 18
    },
    name: {
        fontSize: 22, 
        fontWeight: '600', 
        marginBottom: 18, 
        color: '#616161',
    },
    avatar: {
        width: 90, 
        height: 90, 
        borderRadius: 45, 
        marginBottom: 15
    }
}