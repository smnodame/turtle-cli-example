const browser = () => {
	// for avoid error in mobile build
	if (!navigator) {
		return '-'
	}

	if (navigator.userAgent.indexOf('Chrome') !== -1) {
		return 'Google Chrome'
	} else if (navigator.userAgent.indexOf('Firefox') !== -1) {
		return 'Mozilla Firefox'
	} else if (navigator.userAgent.indexOf('MSIE') !== -1) {
		return 'Internet Exploder'
	} else if (navigator.userAgent.indexOf('Edge') !== -1) {
		return 'Internet Exploder'
	} else if (navigator.userAgent.indexOf('Safari') !== -1) {
		return 'Safari'
	} else if (navigator.userAgent.indexOf('Opera') !== -1) {
		return 'Opera'
	} else if (navigator.userAgent.indexOf('YaBrowser') !== -1) {
		return 'YaBrowser'
	} else {
		return 'Others'
	}
}

export default browser
