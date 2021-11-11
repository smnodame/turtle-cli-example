import * as apis from '../../redux/apis'

import prepareDataWebhook from '../../utils/prepareDataWebhook'
import { setVariables } from '../../modules/setVariables'

const Webhook = ({ question, answers, storeAnswers, addErrorMsgToYellowBox, variables }) => {
	return SendWebhook(
		question.id,
		question.mode,
		question.input,
		answers,
		storeAnswers,
		addErrorMsgToYellowBox,
		variables
	)
}

const SendWebhook = (id, mode, input, answers, storeAnswers, addErrorMsgToYellowBox, variables) => {
	const data = input
	const payload = prepareDataWebhook(data, answers, {})
	console.log(payload)
	return apis.webhook(payload).then(
		(response) => {
			const outputs = {
				response: {
					value: response,
				},
				created_at: {
					value: new Date(),
				},
			}

			const answer = {
				[id]: {
					answer: {
						...outputs,
					},
					mode: mode,
				},
			}

			setVariables(id, variables, answer)
			
			// store answers in store
			storeAnswers(
				{
					...answers,
					...answer,
				},
				answer
			)

			return response
		},
		(err) => {
			addErrorMsgToYellowBox(err)
		}
	)
}

export default Webhook
