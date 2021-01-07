import * as apis from '../../redux/apis'

import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import React from 'react'
import _ from 'lodash'
import deepCopy from '../../utils/cloneDeep'
import generateMessage from '../../utils/generateMessage'
import { setVariables } from '../../modules/setVariables'

export default class AmountInputList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			items: [],
		}
	}

	componentDidMount = () => {
		const { question } = this.props
		this.fetchItems(question).then((items) => {
			this.setState({
				items,
			})
		})
	}

	fetchItems = (question) => {
		try {
			if (question.db.type === 'custom') {
				return new Promise((resolve) =>
					resolve(deepCopy(_.get(question, 'input.items', [])))
				)
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
								name: _.get(item, '0'),
								description: _.get(item, '1'),
								number: _.get(item, '2', 0),
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

	decrease = (index) => {
		let items = this.state.items
		items[index] = {
			...items[index],
			number: items[index].number - 1,
		}

		this.setState({
			items,
		})
	}

	increase = (index) => {
		let items = this.state.items
		items[index] = {
			...items[index],
			number: items[index].number + 1,
		}

		this.setState({
			items,
		})
	}

	onLongIncrease = (index) => {
		let items = this.state.items
		items[index] = {
			...items[index],
			number: items[index].number + 1,
		}

		this.setState({
			items,
		})

		this.timer = setTimeout(() => {
			this.onLongIncrease(index)
		}, 100)
	}

	stopTimer = () => {
		clearTimeout(this.timer)
	}

	onLongDecrease = (index) => {
		let items = this.state.items
		const newAmount = items[index].number - 1
		if (newAmount >= 0) {
			items[index] = {
				...items[index],
				number: newAmount,
			}

			this.setState({
				items,
			})

			this.timer = setTimeout(() => {
				this.onLongDecrease(index)
			}, 100)
		}
	}

	onSend = () => {
		const { question, answers, storeAnswers, onSend } = this.props

		const amounts = this.state.items.map((item) => {
			return item.number
		})

		const answer = {
			[question.id]: {
				answer: {
					amounts,
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
		const message = generateMessage(question.answer, answers, answer)

		onSend(
			{
				text: message,
			},
			_.get(question, 'trigger.right')
		)
	}

	renderItems = () => {
		return this.state.items.map((item, index) => {
			return (
				<View key={index} style={styles.itemContainer}>
					<TouchableOpacity
						disabled={item.number === 0}
						onPress={() => this.decrease(index)}
						onLongPress={() => this.onLongDecrease(index)}
						onPressOut={this.stopTimer}
						style={styles.decrease.style}
					>
						<Text style={styles.decrease.text}>-</Text>
					</TouchableOpacity>
					<View style={styles.detailContainer}>
						<View style={styles.amountContainer.style}>
							<Text style={styles.amountContainer.text}>{item.number}</Text>
						</View>
						<View style={styles.detail.style}>
							<Text style={styles.detail.title} numberOfLines={1}>
								{item.name}
							</Text>
							<Text style={styles.detail.description} numberOfLines={1}>
								{item.description}
							</Text>
						</View>
					</View>
					<TouchableOpacity
						onPress={() => this.increase(index)}
						onLongPress={() => this.onLongIncrease(index)}
						onPressOut={this.stopTimer}
						style={styles.increase.style}
					>
						<Text style={styles.increase.text}>+</Text>
					</TouchableOpacity>
				</View>
			)
		})
	}

	render = () => {
		const { question } = this.props

		const buttonText = _.get(question, 'input.button.text', 'CONTINUE')

		return (
			<View>
				<ScrollView style={styles.scrollview}>{this.renderItems()}</ScrollView>
				<TouchableOpacity onPress={this.onSend} style={styles.button}>
					<Text numberOfLines={1} style={styles.text}>
						{buttonText}
					</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = {
	amountContainer: {
		style: {
			flex: 2,
		},
		text: {
			color: '#7B7B7B',
			fontSize: 28,
			fontWeight: 'bold',
			marginRight: 8,
			textAlign: 'right',
		},
	},
	button: {
		alignItems: 'center',
		backgroundColor: '#F8F8F8',
		borderColor: '#EEE',
		borderTopWidth: 1,
		borderWidth: 0.5,
		height: 60,
		justifyContent: 'center',
	},
	decrease: {
		style: {
			alignItems: 'center',
			justifyContent: 'center',
			width: 80,
		},
		text: {
			color: '#9195F7',
			fontSize: 22,
			fontWeight: 'bold',
		},
	},
	detail: {
		description: {
			color: '#AAA',
			fontSize: 12,
		},
		style: {
			flex: 3,
		},
		title: {
			color: '#7B7B7B',
			fontWeight: '600',
		},
	},
	detailContainer: {
		alignItems: 'center',
		display: 'flex',
		flex: 1,
		flexDirection: 'row',
	},
	increase: {
		style: {
			alignItems: 'center',
			justifyContent: 'center',
			width: 80,
		},
		text: {
			color: '#9195F7',
			fontSize: 22,
			fontWeight: 'bold',
		},
	},
	itemContainer: {
		backgroundColor: '#FEFEFE',
		borderColor: '#EEE',
		borderTopWidth: 1,
		flexDirection: 'row',
		height: 60,
	},
	scrollview: {
		backgroundColor: '#F8F8F8',
		maxHeight: 180,
	},
	text: {
		color: '#4B4B4B',
		fontSize: 14,
	},
}
