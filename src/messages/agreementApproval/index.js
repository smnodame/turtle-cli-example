import { Text, TouchableOpacity, View } from 'react-native'

import React from 'react'
import _ from 'lodash'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import generateMessage from '../../utils/generateMessage'

class AgreementApproval extends React.Component {
	constructor(props) {
		super(props)
		this.trigger = _.get(props.question, 'trigger')
	}

	onSend = () => {
		const { question, answers, storeAnswers, onSend } = this.props

		const answer = {
			[question.id]: {
				answer: {
					text: {
						value: 'approve',
					},
					status: {
						value: true,
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

	render = () => {
		const { question, currentAnswer } = this.props

		const text = _.get(question, 'input.button.text', 'APPROVE')
		const isApproved = _.get(currentAnswer, `${question.id}.answer`)

		return (
			<View>
				<TouchableOpacity
					onPress={() => {
						this.onSend()
					}}
					disabled={!isApproved}
					style={styles.button}
				>
					<Text
						numberOfLines={1}
						style={{ ...styles.text, ...(isApproved ? {} : styles.disabled) }}
					>
						{text}
					</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	currentQuestion: state.chat.currentQuestion,
	answers: state.chat.answers,
	design: state.chat.design,
	currentAnswer: state.chat.currentAnswer,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	storeAnswers: (answers, answer) => {
		dispatch(actions.answers(answers, answer))
	},
})

const Container = connect(mapStateToProps, mapDispatchToProps)(AgreementApproval)

export default Container

const styles = {
	button: {
		backgroundColor: '#F8F8F8',
		borderColor: '#EEE',
		height: 60,
		borderWidth: 0.5,
		borderTopWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		color: '#4B4B4B',
		fontSize: 14,
	},
	disabled: {
		color: '#AAAAAA',
	},
}
