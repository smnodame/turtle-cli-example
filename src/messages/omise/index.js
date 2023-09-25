import * as apis from '../../redux/apis'

import { Text, TouchableOpacity, View } from 'react-native'

import Modal from 'react-native-full-modal'
import React from 'react'
import { WebView } from 'react-native-webview'
import _ from 'lodash'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import generateMessage from '../../utils/generateMessage'
import getMessageDuration from '../../utils/getMessageDuration'
import { setVariables } from '../../modules/setVariables'

class Omise extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isShowingPopup: true,
		}

		const amountExpression = _.get(props.question, 'input.amount', '0')
		try {
			const amount = generateMessage(amountExpression, props.answers).replace(' ', '')
			// eslint-disable-next-line
			this.amountWithPoint = parseFloat(eval(amount)).toFixed(2)
			this.amount = this.amountWithPoint.replace('.', '')
		} catch (e) {
			this.amountWithPoint = '1.00'
			this.amount = '100' // mean 1.00
		}
	}

	hideModel = () => {
		this.setState({
			isShowingPopup: false,
		})
	}

	showModal = () => {
		this.setState({
			isShowingPopup: true,
		})
	}

	onMessage = (event) => {
		const extractedPayload = JSON.parse(event.nativeEvent.data)
		if (extractedPayload.action === 'CLOSE') {
			this.setState({
				isShowingPopup: false,
			})
		} else {
			const { question, answers, storeAnswers, onSend, addErrorMsgToYellowBox, variables } = this.props

			const currency = _.get(question, 'input.currency', '')
			const secretKey = _.get(question, 'input.secret_key', '')
			apis.submitChargeOmise(this.amount, currency, extractedPayload.token, secretKey).then(
				(data) => {
					// response can be 200 but the data will include the error code
					if (data.failure_code) {
						this.putErrorMessage(data.failure_message)
						return
					}

					this.setState(
						{
							show: false,
						},
						() => {
							const answer = {
								[question.id]: {
									answer: {
										response: {
											value: data,
										},
										amount: {
											value: this.amountWithPoint,
										},
										created_at: {
											value: new Date(),
										},
									},
									mode: question.mode,
								},
							}

							setVariables(question.id, variables, answer)
							
							// store answers in store
							storeAnswers(
								{
									...answers,
									...answer,
								},
								answer
							)

							// generate answer and replace expression
							const message = generateMessage(question.answer, answers, answer)

							onSend(
								{
									text: message,
								},
								_.get(question, 'trigger.right')
							)
						}
					)
				},
				(data) => {
					// known error that we provided from our server should add to yellow box
					if (data.detail) {
						addErrorMsgToYellowBox(data.detail)
					}

					this.putErrorMessage(question.input.error_message)
				}
			)
		}
	}

	putErrorMessage = (message) => {
		const { addMessageToChat, question, retry } = this.props
		addMessageToChat(question, message)

		setTimeout(() => {
			retry(question.id)
		}, getMessageDuration())
	}

	render() {
		const { question } = this.props
		const { isShowingPopup } = this.state

		const publicKey = _.get(question, 'input.public_key', '')
		const frameLabel = _.get(question, 'input.frame_label', '')
		const frameDescription = _.get(question, 'input.frame_description', '')
		const currency = _.get(question, 'input.currency', '')

		if (!isShowingPopup) {
			return (
				<TouchableOpacity onPress={this.showModal} style={styles.button}>
					<Text numberOfLines={1} style={styles.text}>
						Continue
					</Text>
				</TouchableOpacity>
			)
		}

		return (
			<Modal animationType='slide' transparent={true} visible={true}>
				<View style={styles.container}>
					<WebView
						originWhitelist={['*']}
						javaScriptEnabled={true}
						onMessage={this.onMessage}
						onNavigationStateChange={(evt) => {}}
						onError={(e) => {
							console.error('error occured', e)
						}}
						useWebKit={true}
						source={{
							html: `
                            <!DOCTYPE html>
                            <html>
                                <head>
                                    <meta charset='utf-8' />
                                    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
                                    <meta name='viewport' content='width=device-width, initial-scale=1'>
                                    <script src='https://cdn.omise.co/omise.js'></script>
                                </head>
                                <body>
                                    <script>
                                        function postMessage(payload) {
                                            if(window.ReactNativeWebView) {
                                                // React Native
                                                window.ReactNativeWebView.postMessage(payload)
                                            } else if (window.opener) {
                                                // Web new window
                                                window.opener.postMessage(payload, window.opener.origin)
                                                window.close()
                                            } else if (window.parent) {
                                                // Web iframe
                                                window.parent.postMessage(payload, window.parent.origin)
                                            }
                                        }

                                        OmiseCard.configure({
                                            publicKey: '${publicKey}',
                                            submitLabel: 'Pay',
                                        })

                                        const formClosedhandler = () => {
                                            postMessage(JSON.stringify({
                                                action: 'CLOSE',
                                            }))
                                        }

                                        const createTokenSuccessHandler = (token) => {
                                            postMessage(JSON.stringify({
                                                action: 'SUCCESS',
                                                token: token
                                            }))
                                        }

                                        setTimeout(function(){ 
                                            OmiseCard.open({
                                                amount: '${this.amount}',
                                                frameLabel: '${frameLabel}',
                                                frameDescription: '${frameDescription}',
                                                currency: '${currency}',
                                                onCreateTokenSuccess: createTokenSuccessHandler,
                                                onFormClosed: formClosedhandler,
                                            })
                                        }, 1000)
                                    </script>
                                </body>
                            </html>
                        `,
						}}
					/>
				</View>
			</Modal>
		)
	}
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
	addMessageToChat: (question, message) => {
		dispatch(
			actions.addMessageToChat({
				text: message,
				question,
			})
		)
	},
	retry: (id) => {
		dispatch(actions.currentQuestion({}))
		dispatch(actions.runMessage(id))
	},
	addErrorMsgToYellowBox: (msg) => {
		dispatch(actions.yellowBoxError(msg))
	},
})

const Container = connect(mapStateToProps, mapDispatchToProps)(Omise)

export default Container

const styles = {
	button: {
		alignItems: 'center',
		backgroundColor: '#F8F8F8',
		borderColor: '#EEE',
		borderTopWidth: 1,
		borderWidth: 0.5,
		height: 60,
		justifyContent: 'center',
	},
	container: {
		backgroundColor: 'rgbc(0,0,0,0)',
		flex: 1,
		height: '100%',
	},
	text: {
		color: '#4B4B4B',
		fontSize: 14,
	},
}
