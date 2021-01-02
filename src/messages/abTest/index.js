import _ from 'lodash'
import pickUsingWeights from '../../utils/pickUsingWeights'

const ABTest = ({ question, answers, storeAnswers }) => {
	const path = pickUsingWeights(
		['a', 'b'],
		[parseInt(question.input.a), parseInt(question.input.b)]
	)
	return new Promise((resolve) => {
		const answer = {
			[question.id]: {
				answer: {
					value: {
						value: path,
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

		resolve(_.get(question, `trigger.${path}`))
	})
}

export default ABTest
