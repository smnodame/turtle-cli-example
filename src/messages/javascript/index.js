import generateMessage from '../../utils/generateMessage'

const Javascript = ({ question, answers, storeAnswers }) => {
	return new Promise((resolve) => {
		var output = {}

		try {
			// eslint-disable-next-line
			eval(generateMessage(question.input.code, answers))
		} catch (e) {
			console.info('[code] : ', e)
		}

		if (typeof output === 'object') {
			const answer = {
				[question.id]: {
					answer: {
						output: {
							value: output,
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
		}

		resolve('success')
	})
}

export default Javascript
