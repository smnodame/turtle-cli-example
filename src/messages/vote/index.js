import { Platform, Text, TouchableOpacity, View } from 'react-native'

import { FontAwesome } from 'hybrid-icon'
import React from 'react'
import StarRating from 'react-native-star-rating'
import _ from 'lodash'
import actions from '../../redux/actions'
import { connect } from 'react-redux'

class Vote extends React.Component {
	constructor(props) {
		super(props)
		this.defaultRating = 0
	}

	onRatingChange = (rating) => {
		const { question, storeCurrentAnswer } = this.props
		storeCurrentAnswer(question.id, {
			rating,
		})
	}

	onSubmit = () => {
		const { question, answers, storeAnswers, currentAnswer, storeCurrentAnswer } = this.props
		const rating = _.get(currentAnswer, `${question.id}.answer.rating`, this.defaultRating)

		const answer = {
			[question.id]: {
				answer: {
					rating: {
						value: rating,
					},
					created_at: {
						value: new Date(),
					},
				},
				mode: question.mode,
			},
		}

		storeCurrentAnswer(question.id, {
			rating,
			isSubmitted: true,
		})

		// store answers in store
		storeAnswers(
			{
				...answers,
				...answer,
			},
			answer
		)
	}

	render = () => {
		const { question, currentAnswer } = this.props
		const rating = _.get(currentAnswer, `${question.id}.answer.rating`, 0)
		const isSubmitted = _.get(currentAnswer, `${question.id}.answer.isSubmitted`)

		return (
			<View style={{ backgroundColor: '#EEE', margin: 18, padding: 10, borderRadius: 5 }}>
				<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
					<FontAwesome
						active
						name='question-circle'
						size={18}
						style={{ color: 'dodgerblue' }}
					/>
					<Text style={{ fontSize: 12, marginLeft: 6 }}>
						{question.input.description}
					</Text>
				</View>

				<View style={{ marginTop: 8, marginBottom: 8 }}>
					<StarRating
						fullStarColor={'#FFB400'}
						starSize={24}
						maxStars={question.input.max_stars}
						rating={rating || this.defaultRating}
						valueChanged={this.onRatingChange}
						selectedStar={this.onRatingChange}
						interitemSpacing={0}
						containerStyle={{
							width: 24 * question.input.max_stars,
						}}
						starStyle={{
							padding: 4,
						}}
						disabled={isSubmitted}
					/>
				</View>
				{!isSubmitted && (
					<TouchableOpacity
						onPress={this.onSubmit}
						style={{ marginTop: Platform.OS === 'web' ? -8 : 0 }}
					>
						<Text style={{ color: '#8a2be2' }}>{question.input.submit}</Text>
					</TouchableOpacity>
				)}
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	answers: state.chat.answers,
	currentAnswer: state.chat.currentAnswer,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	storeAnswers: (answers, answer) => {
		dispatch(actions.answers(answers, answer))
	},
})

const Container = connect(mapStateToProps, mapDispatchToProps)(Vote)

export default Container
