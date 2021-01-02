function min(min, value) {
	return min ? !(parseFloat(min) > parseFloat(value)) : true
}

function max(max, value) {
	return max ? !(parseFloat(max) < parseFloat(value)) : true
}

const validation = (type, value, property, required = false) => {
	if (!required && !value) {
		return true
	} else if (required && !value) {
		return false
	} else {
		var re = ''
		switch (type) {
			case 'email': {
				// eslint-disable-next-line
				re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
				return re.test(value)
			}
			case 'number': {
				return (
					Number.isInteger(parseInt(value)) &&
					min(property.min, value) &&
					max(property.max, value)
				)
			}
			case 'decimal': {
				return (
					Number.isInteger(parseInt(value)) &&
					min(property.min, value) &&
					max(property.max, value)
				)
			}
			case 'phone': {
				// eslint-disable-next-line
				re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
				return re.test(value)
			}
			case 'url': {
				// eslint-disable-next-line
				re = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
				return re.test(value)
			}
			case 'name': {
				// eslint-disable-next-line
				re = /^[a-zA-Z ]+$/
				return re.test(value)
			}
			default:
				return true
		}
	}
}

const keyboardType = (type) => {
	switch (type) {
		case 'email':
			return 'email-address'
		case 'number':
			return 'number-pad'
		case 'decimal':
			return 'decimal-pad'
		case 'phone':
			return 'phone-pad'
		default:
			return 'default'
	}
}

export { validation, keyboardType }
