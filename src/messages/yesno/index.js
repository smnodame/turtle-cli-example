import { Text, TouchableOpacity, View, Animated } from 'react-native'

import React from 'react'
import SvgUri from 'react-native-svg-uri'
import _ from 'lodash'
import deepCopy from '../../utils/cloneDeep'
import generateMessage from '../../utils/generateMessage'
import { setVariables } from '../../modules/setVariables'
import { animeInterval, footerMinHeight } from '../../constants'

export default class YesNo extends React.Component {
	state = {
		options: [],
		fadeAnim: new Animated.Value(0),
	}

	componentDidMount = () => {
		const { question } = this.props
		this.fetchItems(deepCopy(question.input)).then((options) => {
			try {
				this.setState({
					options: options,
				}, this.inAnime)
			} catch (e) {
				this.setState({
					options: [],
				})
			}
		})
	}

	inAnime = () => {
		Animated.timing(
			this.state.fadeAnim,
			{
				toValue: footerMinHeight * 2,
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
		return new Promise((resolve) => resolve(input.options))
	}

	onSelect = (label, value, trigger) => {
		const { question, onSend, storeAnswers, answers, variables } = this.props

		const answer = {
			[question.id]: {
				answer: {
					value: {
						value: value,
					},
					label: {
						value: label,
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
		const message = generateMessage(question.answer || label, answers, answer)

		// send message to board
		onSend(
			{
				text: message,
			},
			trigger || _.get(this.props.question, 'trigger.default')
		)

		this.outAnime()
	}

	render() {
		const { options } = this.state
		const { trigger } = this.props.question || {}
		const enabledImage = _.get(this.props.question, 'input.enabled_image', false)

		return (
			<Animated.View style={{ ...styles.container, height: this.state.fadeAnim, }}>
				{options.map((option, index) => (
					<TouchableOpacity
						key={option.value || index}
						onPress={() => {
							this.onSelect(option.label, option.value, _.get(trigger, option.value))
						}}
						style={[
							styles.choice.button,
							{ justifyContent: enabledImage ? '' : 'center' },
						]}
					>
						{!!enabledImage && (
							<View style={styles.choice.image}>
								{!!option.image && (
									<SvgUri width='30' height='30' svgXmlData={option.image} />
								)}
							</View>
						)}
						<Text numberOfLines={1} style={styles.choice.text}>
							{option.label.toUpperCase()}
						</Text>
					</TouchableOpacity>
				))}
			</Animated.View>
		)
	}
}

const styles = {
	button: {
		alignItems: 'center',
		backgroundColor: '#F8F8F8',
		borderColor: '#EEE',
		borderTopWidth: 1,
		borderWidth: 0.5,
		flex: 1,
		height: 60,
		justifyContent: 'center',
	},
	choice: {
		button: {
			alignItems: 'center',
			backgroundColor: '#F8F8F8',
			borderColor: '#EEE',
			borderTopWidth: 1,
			borderWidth: 0.5,
			flexDirection: 'row',
			height: 60,
			justifyContent: 'flex-start',
		},
		checkbox: {
			marginLeft: 10,
			marginRight: 30,
		},
		hr: {
			flex: 1,
		},
		image: {
			marginLeft: 15,
			marginRight: 35,
		},
		style: {
			backgroundColor: '#F8F8F8',
			marginBottom: 60,
		},
		text: {
			color: '#4B4B4B',
			fontSize: 14,
		},
	},
	container: {
		flexDirection: 'column',
	},
	text: {
		color: '#4B4B4B',
		fontSize: 14,
	},
}
