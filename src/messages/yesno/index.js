import { Text, TouchableOpacity, View } from 'react-native'

import React from 'react'
import SvgUri from 'react-native-svg-uri'
import _ from 'lodash'
import deepCopy from '../../utils/cloneDeep'
import generateMessage from '../../utils/generateMessage'
import { setVariables } from '../../modules/setVariables'

export default class YesNo extends React.Component {
	state = {
		options: [],
	}

	componentDidMount = () => {
		const { question } = this.props
		this.fetchItems(deepCopy(question.input)).then((options) => {
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
		return new Promise((resolve) => resolve(input.options))
	}

	onSelect = (label, value, trigger) => {
		const { question, onSend, storeAnswers, answers } = this.props

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
	}

	render() {
		const { options } = this.state
		const { trigger } = this.props.question || {}
		const enabledImage = _.get(this.props.question, 'input.enabled_image', false)

		return (
			<View style={styles.container}>
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
			</View>
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
