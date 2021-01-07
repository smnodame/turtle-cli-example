import Horizontal from './horizontal'
import React from 'react'
import Vertical from './vertical'
import { View } from 'react-native'
import _ from 'lodash'
import generateMessage from '../../utils/generateMessage'
import { setVariables } from '../../modules/setVariables'

export default class Button extends React.Component {
	state = {
		options: [],
	}

	componentDidMount = () => {
		const { question } = this.props
		this.fetchItems(question.input).then((options) => {
			try {
				this.setState({
					options: options,
				})
			} catch (e) {
				this.setState({
					options: [],
				})
			}
		})
	}

	fetchItems = (input) => {
		try {
			return new Promise((resolve) => resolve(input.options))
		} catch (e) {
			console.error('[fetchItems]', e)
			return new Promise((resolve) => resolve([]))
		}
	}

	onSelect = (label, value, trigger) => {
		const { question, onSend, storeAnswers, answers } = this.props

		const answer = {
			[question.id]: {
				answer: {
					value: {
						value: value || label,
					},
					label: {
						value: label,
					}
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
		const message = generateMessage(question.answer || label, answers, answer)

		// send message to board
		onSend(
			{
				text: message,
			},
			trigger || _.get(question, 'trigger.default')
		)
	}

	render() {
		const { question } = this.props
		const layout = _.get(question, 'input.layout', 'horizontal')

		switch (layout) {
			case 'vertical':
				return (
					<Vertical
						trigger={question.trigger || {}}
						options={this.state.options}
						onSelect={this.onSelect}
					/>
				)
			case 'horizontal':
				return (
					<Horizontal
						trigger={question.trigger || {}}
						options={this.state.options}
						onSelect={this.onSelect}
					/>
				)
			default:
				return <View />
		}
	}
}
