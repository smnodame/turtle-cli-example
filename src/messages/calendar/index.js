import DateTimePicker from 'react-native-modal-datetime-picker'
import React from 'react'
import { View } from 'react-native'
import _ from 'lodash'
import generateMessage from '../../utils/generateMessage'
import moment from 'moment'

export default class Calendar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: true,
		}
	}

	componentDidMount = () => {}

	onSend = (date) => {
		const { question, answers, storeAnswers, onSend } = this.props

		this.setState(
			{
				visible: false,
			},
			() => {
				const answer = {
					[question.id]: {
						answer: {
							default: {
								value: date,
							},
							datetime: {
								value: moment(date).format('MMMM Do YYYY, h:mm:ss a'),
							},
							fulldate: {
								value: moment(date).format('MMM Do YY'),
							},
							day: {
								value: moment(date).format('dddd'),
							},
							minute: {
								value: moment(date).minute(),
							},
							hour: {
								value: moment(date).hour(),
							},
							date: {
								value: moment(date).day(),
							},
							month: {
								value: moment(date).month() + 1,
							},
							year: {
								value: moment(date).year(),
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
					question.answer || this.getDefaultFormat(date),
					answers,
					answer
				)

				onSend(
					{
						text: message,
					},
					_.get(question, 'trigger.right')
				)
			}
		)
	}

	getDefaultFormat = (date) => {
		const { question } = this.props
		const mode = _.get(question, 'input.calendar.mode', 'datetime')
		if (mode === 'datetime') {
			return moment(date).format('MMMM Do YYYY, h:mm:ss a')
		} else if (mode === 'time') {
			return moment(date).format('h:mm:ss a')
		} else if (mode === 'date') {
			return moment(date).format('MMMM Do YYYY')
		}
	}

	render() {
		const { question } = this.props

		const mode = _.get(question, 'input.calendar.mode', 'datetime')
		const buttonText = _.get(question, 'input.button.text', 'Confirm')

		return (
			<View>
				<DateTimePicker
					isVisible={this.state.visible}
					onConfirm={this.onSend}
					onCancel={() => {}}
					mode={mode}
					confirmTextIOS={buttonText}
				/>
			</View>
		)
	}
}