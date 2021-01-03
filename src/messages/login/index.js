import { Platform, View } from 'react-native'

import HybridLogIn from 'react-native-login'
import Modal from 'react-native-full-modal'
import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import generateMessage from '../../utils/generateMessage'

class LogIn extends React.Component {
	constructor(props) {
		super(props)
		if (Platform.OS === 'web') {
			this.state = {
				show: true,
			}
		} else {
			this.state = {
				show: true,
			}
		}
	}

	componentDidMount() {}

	onAuthenticated = (data) => {
		const { question, answers, storeAnswers, onSend } = this.props

		this.setState(
			{
				show: false,
			},
			() => {
				const answer = {
					[question.id]: {
						answer: {
							image: {
								value: data.image,
							},
							name: {
								value: data.name,
							},
							email: {
								value: data.email,
							},
							created_at: {
								value: new Date(),
							},
						},
						mode: question.mode,
					},
				}

				// store answers in store
				storeAnswers(
					{
						...answers,
						...answer,
					},
					answer
				)

				// generate answer and replace expression
				const message = generateMessage(
					question.answer || data.name || data.email,
					answers,
					answer
				)

				onSend(
					{
						text: message,
						image: data.largeImage,
					},
					_.get(question, 'trigger.right')
				)
			}
		)
	}

	render() {
		const { question, app, credentials } = this.props

		return (
			<Modal animationType='slide' transparent={false} visible={this.state.show}>
				<View style={styles.container}>
					<HybridLogIn
						app={app}
						onAuthenticated={this.onAuthenticated}
						options={question.input.options}
						credentials={credentials}
					/>
				</View>
			</Modal>
		)
	}
}

const mapStateToProps = (state) => ({
	app: state.chat.app,
	credentials: state.chat.credentials,
})

const mapDispatchToProps = (dispatch, ownProps) => ({})

const LogInContainer = connect(mapStateToProps, mapDispatchToProps)(LogIn)

export default LogInContainer

const styles = {
	container: {
		flex: 1,
		height: '100%',
	},
}
