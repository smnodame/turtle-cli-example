import * as apis from '../../redux/apis'

import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import CheckBox from 'react-native-hybrid-checkbox'
import React from 'react'
import SvgUri from 'react-native-svg-uri'
import _ from 'lodash'
import generateMessage from '../../utils/generateMessage'
import { setVariables } from '../../modules/setVariables'

class CheckboxMsg extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			filter: '',
			results: [],
			selected: null,
			options: [],
		}
	}

	componentDidMount = () => {
		const { question } = this.props
		this.fetchItems(question).then((options) => {
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

	fetchItems = (question) => {
		try {
			if (question.db.type === 'custom') {
				return new Promise((resolve) => resolve(question.input.options))
			} else if (question.db.type === 'google-spreadsheet') {
				if (question.db.is_specific_sheet && !question.db.sheet) {
					return new Promise((resolve) => resolve([]))
				}

				return apis
					.fetchSpreadsheetData(
						question.db.spreadsheet,
						question.db.is_specific_sheet ? question.db.sheet : null
					)
					.then((data) => {
						return (data || []).map((item, index) => {
							return {
								label: _.get(item, '0'),
								value: _.get(item, '1'),
								image: _.get(item, '2'),
								id: index,
							}
						})
					})
			}

			return new Promise((resolve) => resolve([]))
		} catch (e) {
			return new Promise((resolve) => resolve([]))
		}
	}

	validate = (callback = () => {}) => {
		const { currentAnswer, question } = this.props
		const min = _.get(question, 'input.min', null)
		const max = _.get(question, 'input.max', null)

		const answer = _.get(currentAnswer, `${question.id}.answer`, {})
		const selectedValue = Object.keys(answer).filter((key) => {
			return !!answer[key]
		})

		if (max) {
			if (selectedValue.length > max) {
				return
			}
		}

		if (min) {
			if (selectedValue.length < min) {
				return
			}
		}

		callback()
	}

	onCheckboxChange = (index) => {
		const { currentAnswer, question, storeCurrentAnswer } = this.props
		const answer = _.get(currentAnswer, `${question.id}.answer`, {})
		answer[index] = !answer[index]
		storeCurrentAnswer(question.id, answer)
	}

	onClickSend = () => {
		this.validate(() => {
			const { currentAnswer, question, storeAnswers, onSend, answers, variables } = this.props
			const chebkboxAnswer = _.get(currentAnswer, `${question.id}.answer`, {})

			const selected = Object.keys(chebkboxAnswer)
				.filter((key) => {
					return !!chebkboxAnswer[key]
				})
				.map((index) => {
					return this.state.options[index]
				})

			const answer = {
				[question.id]: {
					answer: {
						selected_value: {
							value: selected.map((v) => v.value || v.label),
						},
						selected_label: {
							value: selected.map((v) => v.label),
						},
						selected_number: {
							value: selected.length,
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
			storeAnswers({
				...answers,
				...answer,
			})

			// generate answer and replace expression
			const message = generateMessage(question.answer, answers, answer)

			// send message to board
			onSend(
				{
					text: message,
				},
				_.get(question, 'trigger.right')
			)
		})
	}

	render() {
		const { currentAnswer, question } = this.props
		const enabledImage = _.get(question, 'input.enabled_image', false)
		const text = _.get(question, 'input.button.text', 'SEND')

		return (
			<View>
				<View style={styles.choice.style}>
					<ScrollView style={styles.scrollview}>
						{this.state.options.map((option, index) => (
							<TouchableOpacity
								onPress={() => {
									this.onCheckboxChange(index)
								}}
								style={styles.choice.button}
							>
								{!!enabledImage && (
									<View style={styles.choice.image}>
										{!!option.image && (
											<SvgUri
												width='30'
												height='30'
												svgXmlData={option.image}
											/>
										)}
									</View>
								)}

								<Text numberOfLines={1} style={styles.choice.text}>
									{option.label.toUpperCase()}
								</Text>
								<View style={styles.choice.hr} />
								<CheckBox
									style={styles.choice.checkbox}
									color='green'
									value={_.get(currentAnswer, `${question.id}.answer.${index}`)}
									onChange={() => {
										this.onCheckboxChange(index)
									}}
								/>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>
				<TouchableOpacity onPress={this.onClickSend} style={styles.button.style}>
					<Text numberOfLines={1} style={styles.button.text}>
						{' '}
						{text}{' '}
					</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

export default CheckboxMsg

const styles = {
	button: {
		style: {
			alignItems: 'center',
			backgroundColor: '#F8F8F8',
			borderColor: '#EEE',
			borderTopWidth: 1,
			borderWidth: 0.5,
			bottom: 0,
			flex: 1,
			height: 60,
			justifyContent: 'center',
			position: 'absolute',
			width: '100%',
		},
		text: {
			color: '#4B4B4B',
			fontSize: 14,
		},
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
			marginRight: 5,
		},
		style: {
			backgroundColor: '#F8F8F8',
			marginBottom: 60,
		},
		text: {
			color: '#4B4B4B',
			fontSize: 14,
			marginLeft: 30,
		},
	},
	scrollview: {
		maxHeight: 180,
	},
}
