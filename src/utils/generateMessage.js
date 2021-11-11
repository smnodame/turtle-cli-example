import _ from 'lodash'

const getPath = (expression) => {
	const keyField = expression.replace('@', '')
	const messageId = keyField.match(/ms_\d{5}/g)[0]
	const pathValue = keyField.replace(`${messageId}_`, '')
	const field = pathValue.match(/^\w+/)
	const option = pathValue.replace(field, '')

	return `${messageId}.answer.${field}.value${option}`
}

const renderMessageWithAnswer = (expression, answers) => {
	const matched = expression.match(/@ms_\d{5}(([.]?\w+)|(\[\d+\])|(\['\w+'\])|(\["\w+"\]))*/g)
	if (matched) {
		return matched.reduce((o, m) => {
			// additionalField for supporting json answer
			return o.replace(m, _.get(answers, getPath(m), ''))
		}, expression)
	}

	return expression
}

const generateMessage = (expression = '', answers = {}, currentAnswer = {}) => {
	const allAnswers = {
		...answers,
		...currentAnswer,
	}

	return renderMessageWithAnswer(expression, allAnswers)
}

export default generateMessage
