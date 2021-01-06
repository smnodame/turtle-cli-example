import { Entypo, Ionicons } from 'hybrid-icon'
import { TextInput as Input, Text, TouchableOpacity, View } from 'react-native'
import { keyboardType, validation } from '../../utils/inputValidation'

import React from 'react'
import _ from 'lodash'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import generateMessage from '../../utils/generateMessage'

class TextInput extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			text: '',
			showError: true,
			required: true,
		}

		this.id = props.question.id
		this.correctBorderColor = _.get(props.question, 'input.textinput.correct_border_color')
		this.errorBorderColor = _.get(props.question, 'input.textinput.error_border_color', 'red')
		this.input = _.get(props.question, 'input.textinput', {})
		this.type = _.get(props.question, 'input.textinput.type', 'default')
		this.errorMessage = _.get(
			props.question,
			'input.textinput.error_message',
			'There is some error'
		)
		this.min = _.get(props.question, 'input.textinput.min', null)
		this.max = _.get(props.question, 'input.textinput.max', null)
		this.placeholder = _.get(props.question, 'input.textinput.placeholder', 'ADD A MESSAGE ...')
		this.trigger = _.get(props.question, 'trigger')
		this.message = _.get(props.question, 'message', '')
	}

	getStyleInputError = () => {
		if (this.state.dirty) {
			return {
				borderColor: this.state.error ? this.errorBorderColor : this.correctBorderColor,
			}
		} else {
			return {}
		}
	}

	setDirtyInput = () => {
		this.setState({
			dirty: true,
		})
	}

	validate = (callback = () => {}) => {
		this.setDirtyInput()
		const passed = validation(
			this.type,
			this.state.text,
			{
				min: this.min,
				max: this.max,
			},
			this.state.required
		)
		this.setState(
			{
				showError: true,
				error: passed ? null : this.errorMessage,
			},
			() => {
				if (passed) {
					callback()
				}
			}
		)
	}

	onSend = () => {
		this.validate(() => {
			const { question, answers, storeAnswers, onSend } = this.props

			// clear timeout before unmount
			clearTimeout(this.timeout)

			const answer = {
				[question.id]: {
					answer: {
						text: {
							value: this.state.text,
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
			const message = generateMessage(question.answer || this.state.text, answers, answer)
			onSend(
				{
					text: message,
				},
				_.get(question, 'trigger.right')
			)
		})
	}

	onTextChange = (text) => {
		clearTimeout(this.timeout)
		this.timeout = setTimeout(() => {
			this.validate()
		}, 800)
		this.setState({
			text,
		})
	}

	onBlurInput = () => {
		this.setDirtyInput()
		this.validate()
	}

	renderError = () => {
		return (
			<View style={componentStyles.errorBox}>
				<TouchableOpacity
					onPress={() => {
						this.setState({
							showError: false,
						})
					}}
					style={componentStyles.closeButton}
				>
					<Entypo name='cross' style={{ color: '#FFFFFF', padding: 5 }} size={22} />
				</TouchableOpacity>
				<Text numberOfLines={1} style={componentStyles.textError}>
					{this.state.error}
				</Text>
			</View>
		)
	}

	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps)
	}

	render() {
		const { design } = this.props

		const customStyle = {
			button: {
				color: _.get(
					design,
					`colors.forms['${design.colors.forms.selected}'].button.backgroundColor`,
					'#FF006F'
				),
			},
			input: {
				borderColor: _.get(
					design,
					`colors.forms['${design.colors.forms.selected}'].textarea.borderColor`,
					'#CCC'
				),
				color: _.get(
					design,
					`colors.forms['${design.colors.forms.selected}'].textarea.textColor`,
					'#4B4B4B'
				),
				backgroundColor: _.get(
					design,
					`colors.forms['${design.colors.forms.selected}'].textarea.backgroundColor`,
					'#FFF'
				),
				placeholderTextColor: _.get(
					design,
					`colors.forms['${design.colors.forms.selected}'].textarea.placeholderTextColor`,
					'#999'
				),
			},
			container: {
				backgroundColor: _.get(
					design,
					`colors.forms['${design.colors.forms.selected}'].backgroundColor`,
					'#F2F2F2'
				),
			},
		}

		return (
			<View>
				{this.state.showError && this.state.error && this.renderError()}
				<View style={{ ...componentStyles.textinputContainer, ...customStyle.container }}>
					<Input
						style={{ ...componentStyles.textinput, ...customStyle.input }}
						returnKeyType={'done'}
						onSubmitEditing={this.onSend}
						blurOnSubmit={true}
						value={this.state.text}
						onChangeText={this.onTextChange}
						onBlur={this.onBlurInput}
						keyboardType={keyboardType(this.type)}
						placeholderTextColor={customStyle.input.placeholderTextColor}
						placeholder={this.placeholder}
						underlineColorAndroid='transparent'
					/>
					<TouchableOpacity onPress={this.onSend} style={componentStyles.sendButton}>
						<View ref={(component) => (this._root = component)}>
							<Ionicons
								name='md-send'
								style={{ fontSize: 30, ...customStyle.button }}
							/>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	design: state.chat.design,
	answers: state.chat.answers,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	storeAnswers: (answers, answer) => {
		dispatch(actions.answers(answers, answer))
	},
})

const Container = connect(mapStateToProps, mapDispatchToProps)(TextInput)

export default Container

const componentStyles = {
	closeButton: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 10,
	},
	closeIcon: {
		color: '#FFFFFF',
		padding: 5,
	},
	errorBox: {
		alignItems: 'center',
		backgroundColor: '#FFAAAA',
		flexDirection: 'row',
		height: 40,
	},
	sendButton: {
		alignItems: 'center',
		height: 40,
		justifyContent: 'center',
		marginTop: 2,
		width: 40,
	},
	textError: {
		color: 'white',
	},
	textinput: {
		backgroundColor: 'white',
		borderColor: '#CCC',
		borderRadius: 5,
		borderWidth: 0.5,
		flex: 1,
		height: 45,
		marginBottom: 5,
		marginRight: 5,
		paddingHorizontal: 20,
		paddingLeft: 10,
		paddingRight: 10,
	},
	textinputContainer: {
		backgroundColor: '#f2f2f2',
		display: 'flex',
		flexDirection: 'row',
		height: 60,
		padding: 10,
		paddingTop: 8,
	},
}
