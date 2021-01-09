import './style.css'

import { Image, Text } from 'react-native'

import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { FontAwesome } from 'react-web-vector-icons'
import GoogleLogin from 'react-google-login'
import React from 'react'

export default class LogIn extends React.Component {
    auths = {
        'FACEBOOK': {
            callback: (data) => {
                // do nothing when data is none
                if(!data.id) return

                this.props.onAuthenticated({
                    email: data.email,
                    image: data.picture.data.url,
                    name: data.name,
                    largeImage: `https://graph.facebook.com/${data.id}/picture?height=350&width=250`
                })
            },
            fields: 'name,email,picture'
        },
        'GOOGLE': {
            onSuccess: (data) => {
                this.props.onAuthenticated({
                    email: data.profileObj.email,
                    image: data.profileObj.imageUrl,
                    name: data.profileObj.name,
                    largeImage: data.profileObj.imageUrl
                })
            },
            onFailure: (error) => {

            }
        }
    }

    render () {
        const { options, app } = this.props
        return (
            <div className='login-container'>
                <Image source={{uri: app.icon }} style={styles.avatar} />
                <Text style={styles.name}>{ app.name }</Text>
                <br />
                <div>
                    {
                        !!options['FACEBOOK'].enable && <div>
                            <div className='btn-group'>
                                <button className='btn btn-primary disabled header'>
                                    <FontAwesome
                                        name='facebook-f'
                                        color='white'
                                        size={14}
                                    />
                                </button>
                                <FacebookLogin
                                    disableMobileRedirect={true}
                                    appId={this.props.credentials.facebook.appId}
                                    autoLoad={false}
                                    fields={this.auths['FACEBOOK'].fields}
                                    callback={this.auths['FACEBOOK'].callback}
                                    render={renderProps => (
                                        <button className='btn btn-primary description' onClick={renderProps.onClick}>Sign in with Facebook</button>
                                    )}
                                />
                            </div>
                            <br/>
                            <br/>
                        </div>
                    }
                    {
                        !!options['GOOGLE'].enable && <div className='btn-group'>
                            <button className='btn btn-danger disabled header'>
                                <FontAwesome
                                    name='google'
                                    color='white'
                                    size={14}
                                />
                            </button>
                            <GoogleLogin
                                disableMobileRedirect={true}
                                clientId={this.props.credentials.google.clientId}
                                onSuccess={this.auths['GOOGLE'].onSuccess}
                                onFailure={this.auths['GOOGLE'].onFailure}
                                render={renderProps => (
                                    <button className='btn btn-danger description' onClick={renderProps.onClick}>Sign in with Google</button>
                                )}
                            />
                        </div>
                    }
                </div>
            </div>
        )
    }
}

const styles = {
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
