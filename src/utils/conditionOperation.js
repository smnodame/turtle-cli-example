const conditionOperation = {
	'Equal to': {
		validation: (answer, value) => {
			return answer === value
		},
	},
	'Does not equal to': {
		validation: (answer, value) => {
			return answer !== value
		},
	},
	'(Text) Contains': {
		validation: (answer, value) => {
			answer = answer.toString()
			value = value.toString()
			return answer.indexOf(value) >= 0
		},
	},
	'(Text) Does not contain': {
		validation: (answer, value) => {
			answer = answer.toString()
			value = value.toString()
			return answer.indexOf(value) < 0
		},
	},
	'(Text) Exactly matchs': {
		validation: (answer, value) => {
			answer = answer.toString()
			value = value.toString()
			return answer === value
		},
	},
	'(Text) Does not exactly match': {
		validation: (answer, value) => {
			answer = answer.toString()
			value = value.toString()
			return answer !== value
		},
	},
	'(Text) Is in': {
		validation: (answer, value) => {
			answer = answer.toString()
			value = value.toString()
			return value.indexOf(answer) >= 0
		},
	},
	'(Text) Is not in': {
		validation: (answer, value) => {
			answer = answer.toString()
			value = value.toString()
			return value.indexOf(answer) < 0
		},
	},
	'(Text) Starts with': {
		validation: (answer, value) => {
			answer = answer.toString()
			value = value.toString()
			return answer.startsWith(value)
		},
	},
	'(Text) Does not start with': {
		validation: (answer, value) => {
			answer = answer.toString()
			value = value.toString()
			return !answer.startsWith(value)
		},
	},
	'(Text) Ends with': {
		validation: (answer, value) => {
			answer = answer.toString()
			value = value.toString()
			return answer.endsWith(value)
		},
	},
	'(Text) Does not end with': {
		validation: (answer, value) => {
			answer = answer.toString()
			value = value.toString()
			return !answer.endsWith(value)
		},
	},
	'(Number) Greater than': {
		validation: (answer, value) => {
			answer = parseFloat(answer) || 0
			value = parseFloat(value) || 0
			return answer > value
		},
	},
	'(Number) Less than': {
		validation: (answer, value) => {
			answer = parseFloat(answer) || 0
			value = parseFloat(value) || 0
			return answer < value
		},
	},
	'(Number) Is equal to': {
		validation: (answer, value) => {
			answer = parseFloat(answer) || 0
			value = parseFloat(value) || 0
			return answer === value
		},
	},
	'(Date/time) After': {
		validation: (answer, value) => {
			answer = new Date(answer) !== 'Invalid Date' ? new Date(answer) : new Date()
			value = new Date(value) !== 'Invalid Date' ? new Date(value) : new Date()
			return answer > value
		},
	},
	'(Date/time) Before': {
		validation: (answer, value) => {
			answer = new Date(answer) !== 'Invalid Date' ? new Date(answer) : new Date()
			value = new Date(value) !== 'Invalid Date' ? new Date(value) : new Date()
			return answer < value
		},
	},
	'(Boolean) Is true': {
		validation: (answer, value) => {
			return answer === true
		},
	},
	'(Boolean) Is false': {
		validation: (answer, value) => {
			return answer === false
		},
	},
	'(Array) Includes': {
		validation: (answer, value) => {
			return answer.indexOf(value) >= 0
		},
	},
	'(Array) Does not include': {
		validation: (answer, value) => {
			return answer.indexOf(value) < 0
		},
	},
	Exists: {
		validation: (answer, value) => {
			return !!answer
		},
	},
	'Does not exist': {
		validation: (answer, value) => {
			return !answer
		},
	},
}

export default conditionOperation
