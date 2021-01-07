import { Dimensions, Text, TouchableOpacity, View } from 'react-native'

import React from 'react'
import _ from 'lodash'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import generateMessage from '../../utils/generateMessage'
import { setVariables } from '../../modules/setVariables'

const dementions = Dimensions.get('window')

class Scale extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			keys: [],
			leftLabel: '',
			rightLabel: '',
		}
	}

	componentDidMount = () => {
		const { from, to, left_label, right_label } = this.props.question.input
		const keys = _.range(from, from <= to ? to + 1 : to - 1, from <= to ? 1 : -1)
		this.setState({
			keys,
			leftLabel: left_label,
			rightLabel: right_label,
		})
	}

	onSend = (number) => {
		const { question, answers, storeAnswers, onSend } = this.props

		const answer = {
			[question.id]: {
				answer: {
					number: {
						value: number,
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
				...this.props.answers,
				...answer,
			},
			answer
		)

		// generate answer and replace expression
		const message = generateMessage(question.answer || `${number}`, answers, answer)

		onSend(
			{
				text: message,
			},
			_.get(question, `trigger.scale_${number}`) || _.get(question, 'trigger.default')
		)
	}

	render = () => {
		const { keys, leftLabel, rightLabel } = this.state
		return (
			<View
				style={{
					...styles.container,
					overflowX: keys.length > dementions.width / 50 ? 'auto' : 'unset',
				}}
			>
				{keys.map((key, index) => (
					<TouchableOpacity
						style={{
							...styles.button,
							...(keys.length > dementions.width / 50 ? {} : { flex: 1 }),
						}}
						onPress={() => this.onSend(key)}
					>
						<Text numberOfLines={1} style={styles.text}>
							{key}
						</Text>
						{!!leftLabel && index === 0 && (
							<Text numberOfLines={1} style={styles.label}>
								{leftLabel}
							</Text>
						)}
						{!!rightLabel && keys.length - 1 === index && (
							<Text numberOfLines={1} style={styles.label}>
								{rightLabel}
							</Text>
						)}
					</TouchableOpacity>
				))}
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	currentQuestion: state.chat.currentQuestion,
	answers: state.chat.answers,
	currentAnswer: state.chat.currentAnswer,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	storeAnswers: (answers, answer) => {
		dispatch(actions.answers(answers, answer))
	},
})

const Container = connect(mapStateToProps, mapDispatchToProps)(Scale)

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
		width: 50,
	},
	container: {
		display: 'flex',
		flexDirection: 'row',
		overflowX: 'auto',
		width: '100%',
	},
	label: {
		bottom: 8,
		fontSize: 8,
		position: 'absolute',
	},
	text: {
		color: '#4B4B4B',
		fontSize: 14,
	},
}
