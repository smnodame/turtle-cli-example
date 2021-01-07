import { TextInput as Input, Text, TouchableOpacity, View } from 'react-native'
import { keyboardType, validation } from '../../utils/inputValidation'

import Modal from 'react-native-modal-enhanced'
import { Platform } from 'react-native'
import React from 'react'
import _ from 'lodash'
import deepCopy from '../../utils/cloneDeep'
import generateMessage from '../../utils/generateMessage'

export default class MultiInput extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			inputs: deepCopy(_.get(props.question, 'input.inputs', [])),
		}
	}

	onTextChange = (text, index) => {
		const { inputs } = this.state
		inputs[index].value = text

		// set input dirty
		inputs[index].dirty = true
		this.setState({
			inputs,
		})

		clearTimeout(this.timeout)
		this.timeout = setTimeout(() => {
			this.validate(text, index)
		}, 800)
	}

	validate = (text, index) => {
		const { inputs } = this.state
		const input = {
			...inputs[index],
		}
		const isPass = validation(
			input.type,
			text,
			{
				min: input.min,
				max: input.max,
			},
			input.required
		)
		inputs[index].isError = !isPass
		this.setState({
			inputs,
		})

		return isPass
	}

	hasError = () => {
		const { inputs } = this.state
		return inputs.some((input) => input.isError)
	}

	hasDirty = () => {
		const { inputs } = this.state
		return inputs.some((input) => input.dirty)
	}

	renderButtonStyle = () => {
		if (this.hasError()) {
			return {
				backgroundColor: '#d9534f',
				borderColor: '#d43f3a',
			}
		} else {
			return {
				backgroundColor: '#5cb85c',
				borderColor: '#4cae4c',
			}
		}
	}

	onSend = () => {
		const { question, answers, storeAnswers, onSend } = this.props

		const valids = this.state.inputs.map((input, index) => {
			return this.validate(input.value, index)
		})

		const isSomeError = valids.some((v) => !v)
		if (!isSomeError) {
			const answer = {
				[question.id]: {
					answer: {
						value: {
							value: this.state.inputs.map((input) => input.value),
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
			const message = generateMessage(question.answer, answers, answer)
			onSend(
				{
					text: message,
				},
				_.get(question, 'trigger.right')
			)
		}
	}

	render() {
		const { question } = this.props

		const title = _.get(question, 'input.title', '')
		const description = _.get(question, 'input.description', '')

		const text = _.get(question, 'input.button.text', 'CONFIRM')

		return (
			<Modal isVisible={true} avoidKeyboard={true}>
				<View style={styles.modal}>
					<View style={styles.content}>
						{!!title && (
							<View style={styles.title.container}>
								<View style={styles.title.body}>
									<Text style={styles.title.text}>{title}</Text>
								</View>
							</View>
						)}
						{!!description && (
							<View style={styles.description.container}>
								<View style={styles.description.body}>
									<Text style={styles.description.text}>{description}</Text>
								</View>
							</View>
						)}
						{this.state.inputs.map((input, index) => {
							return (
								<View key={input.id}>
									<View style={{ flexDirection: 'row', width: '100%' }}>
										<Input
											{...input}
											style={styles.textInput}
											keyboardType={keyboardType(input.type)}
											returnKeyType={'done'}
											blurOnSubmit={true}
											onChangeText={(text) => {
												this.onTextChange(text, index)
											}}
											onBlur={() => {
												this.validate(input.value, index)
											}}
											value={input.value}
											placeholderTextColor={'#DDD'}
											underlineColorAndroid='transparent'
										/>
									</View>
									{input.isError && (
										<Text style={styles.error}>{input.error_message}</Text>
									)}
								</View>
							)
						})}
					</View>
					<View style={styles.footer.style}>
						<TouchableOpacity
							onPress={this.onSend}
							style={[styles.footer.button, this.renderButtonStyle()]}
						>
							<Text style={styles.footer.text}>{text}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		)
	}
}

const styles = {
	content: {
		padding: 15,
		paddingBottom: 5,
		paddingTop: 15,
		width: '100%',
	},
	description: {
		body: {
			flex: 1,
		},
		container: {
			flexDirection: 'row',
			marginTop: 5,
			paddingBottom: 20,
			paddingLeft: 10,
			paddingRight: 10,
			width: '100%',
		},
		text: {
			color: '#4B4B4B',
			fontSize: 14,
			fontWeight: '400',
			textAlign: 'center',
		},
	},
	error: {
		color: '#D46A6A',
		fontSize: 12,
		marginBottom: 10,
		marginLeft: 10,
		marginTop: -4,
	},
	footer: {
		button: {
			alignItems: 'center',
			backgroundColor: '#999',
			borderBottomLeftRadius: 3,
			borderBottomRightRadius: 3,
			borderWidth: 0,
			flex: 1,
			justifyContent: 'center',
		},
		style: {
			display: 'flex',
			flexDirection: 'row',
			height: 50,
			width: '100%',
		},
		text: {
			color: '#FFF',
			fontSize: 14,
			fontWeight: 'bold',
		},
	},
	modal: {
		alignItems: 'center',
		backgroundColor: 'white',
		borderColor: 'rgba(0, 0, 0, 0.1)',
		borderRadius: 4,
		justifyContent: 'center',
		padding: 0,
	},
	textInput: {
		backgroundColor: 'white',
		borderColor: '#EEE',
		borderRadius: 5,
		borderWidth: Platform.OS === 'web' ? 1 : 0.5,
		flex: 1,
		height: 45,
		marginBottom: 10,
		marginLeft: 5,
		marginRight: 5,
		paddingHorizontal: 20,
		paddingLeft: 10,
		paddingRight: 10,
	},
	title: {
		body: {
			padding: 5,
		},
		container: {
			alignItems: 'center',
			justifyContent: 'center',
			marginTop: 5,
		},
		text: {
			color: '#4B4B4B',
			fontSize: 15,
			fontWeight: 'bold',
		},
	},
}
