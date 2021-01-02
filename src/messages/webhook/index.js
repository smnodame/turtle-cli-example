import * as apis from '../../redux/apis'

import prepareDataWebhook from '../../utils/prepareDataWebhook'

const Webhook = ({ question, answers, storeAnswers, addErrorMsgToYellowBox }) => {
	return SendWebhook(
		question.id,
		question.mode,
		question.input,
		answers,
		storeAnswers,
		addErrorMsgToYellowBox
	)
}

const SendWebhook = (id, mode, input, answers, storeAnswers, addErrorMsgToYellowBox) => {
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