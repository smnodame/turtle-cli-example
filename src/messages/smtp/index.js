import * as apis from '../../redux/apis'

import generateMessage from '../../utils/generateMessage'

const SMTP = ({ question, answers, storeAnswers }) => {
	const { input } = question
	const payload = {
		host: input.host,
		credential: input.credential,
		password: input.password,
		tls: input.tls,
		port: input.port,
		from_email: input.from_email,
		to: generateMessage(input.to, answers),
		subject: generateMessage(input.subject, answers),
		body: generateMessage(input.body, answers),
		from_name: generateMessage(input.bcc, answers),
		cc: generateMessage(input.cc, answers),
		bcc: generateMessage(input.bcc, answers),
	}

	return apis.sendRequestSMTP(payload)
}

export default SMTP
