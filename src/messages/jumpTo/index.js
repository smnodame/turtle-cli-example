import * as apis from '../../redux/apis'

const JumpTo = ({ question }) => {
	return apis.fetchConfig(question.input.app).then((data) => {
		const messages = data.messages.reduce((old, obj) => {
			return {
				...old,
				[obj.id]: {
					...obj,
				},
			}
		}, {})

		if (question.input.is_specific_point) {
			if (messages[question.input.node]) {
				return {
					trigger: question.input.node,
					steps: messages,
				}
			}

			return {
				trigger: null,
				steps: {},
			}
		}

		return {
			trigger: 'START',
			steps: messages,
		}
	})
}

export default JumpTo
