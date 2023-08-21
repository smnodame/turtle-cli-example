import Horizontal from './horizontal'
import React from 'react'
import Vertical from './vertical'
import { View, Animated } from 'react-native'
import _ from 'lodash'
import generateMessage from '../../utils/generateMessage'
import { setVariables } from '../../modules/setVariables'
import { animeInterval, footerMinHeight, footerMaxHeight } from '../../constants'

// yesno, vote, textinput, signature, scale, checkbox, button, agreement, input number

export default class Button extends React.Component {
	state = {
		options: [],
		isShowing: true,
		fadeAnim: new Animated.Value(0),
	}

	componentDidMount = () => {
		const { question } = this.props
		this.fetchItems(question.input).then((options) => {
			try {
				this.setState({
					options: options,
				}, () => {
					this.inAnime()
				})
			} catch (e) {
				this.setState({
					options: [],
				})
			}
		})
	}

	inAnime = () => {
		const { question } = this.props
		const { options } = this.state

		const layout = _.get(question, 'input.layout', 'horizontal')
		const height = layout === 'horizontal' ? footerMinHeight : (options.length >= 4 ? footerMaxHeight : footerMinHeight * options.length)

		Animated.timing(
			this.state.fadeAnim,
			{
				toValue: height,
				duration: animeInterval,
			}
		).start()
	}

	outAnime = () => {
		Animated.timing(
			this.state.fadeAnim,
			{
				toValue: 0,
				duration: animeInterval,
			}
		).start()
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
		const { question, onSend, storeAnswers, answers, variables } = this.props

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
		
		this.setState({
			isShowing: false
		}, () => {
			// send message to board
			onSend(
				{
					text: message,
				},
				trigger || _.get(question, 'trigger.default')
			)
		})

		this.outAnime()
	}

	render() {
		const { question } = this.props
		const layout = _.get(question, 'input.layout', 'horizontal')

		switch (layout) {
			case 'vertical':
				return (
					<Animated.View
						style={{
							height: this.state.fadeAnim,
						}}
					>
						<Vertical
							trigger={question.trigger || {}}
							options={this.state.options}
							onSelect={this.onSelect}
						/>
					</Animated.View>
				)
			case 'horizontal':
				return (
					<Animated.View
						style={{
							height: this.state.fadeAnim,
						}}
					>
						<Horizontal
							trigger={question.trigger || {}}
							options={this.state.options}
							onSelect={this.onSelect}
						/>
					</Animated.View>
				)
			default:
				return <View />
		}
	}
}
