import _ from 'lodash'
import conditionOperation from '../../utils/conditionOperation'
import generateMessage from '../../utils/generateMessage'
import { setVariables } from '../../modules/setVariables'

const Condition = ({ question, answers, storeAnswers, variables }) => {
	return new Promise((resolve) => {
		const groupCondition = question.input.conditions.reduce((o, n) => {
			if (n.type === 'or') {
				return [
					...o,
					{
						condition: [],
					},
				]
			}
			o[o.length - 1].condition.push(n)
			return [...o]
		}, [])

		try {
			const isPass = groupCondition.some((con, index) => {
				return con.condition.every((c) => {
					// generate answer and replace expression
					const var1 = generateMessage(c.var1, answers, {})

					const var2 = generateMessage(c.var2, answers, {})

					return conditionOperation[c.condition].validation(var1, var2)
				})
			})

			const answer = {
				[question.id]: {
					answer: {
						status: {
							value: isPass,
						},
						created_at: {
							value: new Date(),
						},
					},
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

			return resolve(_.get(question, `trigger.${isPass ? 'true' : 'false'}`))
		} catch (err) {
			console.log('[condition] : ', err)
			const answer = {
				[question.id]: {
					answer: {
						status: {
							value: false,
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

			return resolve(_.get(question, `trigger.false`))
		}
	})
}

export default Condition
