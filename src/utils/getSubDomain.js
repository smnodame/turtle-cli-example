export default () => {
	const domain = window.location.host
	if (domain.match(/\./g).length === 1) {
		return ''
	}

	var parts = domain.split('.')
	return parts[0]
}
