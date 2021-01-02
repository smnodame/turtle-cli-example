import generateMessage from './generateMessage'

const prepareDataWebhook = (data, answers, currentAnswer = {}) => {
	const basicAuth = generateMessage(data.basic_auth, answers, currentAnswer)
	const payload = {
		method: data.method,
		url: generateMessage(data.url, answers, currentAnswer),
		headers: data.headers.reduce(
			(o, n) => {
				// skip when field is empty
				if (!n.field) {
					return {
						...o,
					}
				}

				return {
					...o,
					[n.field]: generateMessage(n.value, answers, currentAnswer),
				}
			},
			{
				'Content-Type': data.payload_type,
			}
		),
		data: data.data.reduce((o, n) => {
			const answer = generateMessage(n.value, answers, currentAnswer)
			let value = answer
			try {
				value = JSON.parse(answer)
			} catch (err) {
				value = answer
			}
			return {
				...o,
				[n.field]: value,
			}
		}, {}),
	}

	if (!!basicAuth) {
		payload['auth'] = {
			username: basicAuth.includes('|') ? basicAuth.split('|')[0] : null,
			password: basicAuth.includes('|') ? basicAuth.split('|')[1] : null,
		}
	}

	return payload
}

export default prepareDataWebhook
