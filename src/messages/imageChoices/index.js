import * as apis from '../../redux/apis'

import { FlatList, View } from 'react-native'

import Card from './card'
import React from 'react'
import _ from 'lodash'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import generateMessage from '../../utils/generateMessage'

class ImageChoices extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			options: [],
		}
	}

	componentDidMount = () => {
		const { question } = this.props
		this.fetchItems(question).then((options) => {
			try {
				this.setState({
					options,
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
								image: _.get(item, '1'),
								link: _.get(item, '2'),
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

	onSelect = (index) => {
		const { question, answers, storeAnswers, onSend } = this.props
		const answer = {
			[question.id]: {
				answer: {
					label: {
						value: question.input.options[index].label,
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
			question.answer || question.input.options[index].label,
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

	render = () => {
		const { question, currentQuestion } = this.props
		const { options } = this.state
		return (
			<View style={styles.container}>
				<FlatList
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					data={options}
					renderItem={({ item, index }) => {
						return (
							<View style={{ flexDirection: 'row' }}>
								<Card
									{...item}
									index={index}
									onSelect={this.onSelect}
									selectLabel={question.input.select_label}
									currentQuestion={currentQuestion}
									question={question}
								/>
							</View>
						)
					}}
					onEndReachedThreshold={1}
					onEndReached={({ distanceFromEnd }) => {}}
				/>
			</View>
		)
	}
}

const styles = {
	container: {
		flexDirection: 'row',
		flex: 1,
	},
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

const Container = connect(mapStateToProps, mapDispatchToProps)(ImageChoices)

export default Container
