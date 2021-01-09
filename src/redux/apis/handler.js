import conf from '../../conf'

export const responseHandler = (response) => {
	if (response.ok) {
		const contentType = response.headers.get('content-type')
		if (!contentType || !contentType.includes('application/json')) {
			return null
		}
		return response.json()
	} else {
		// for known error from the server, we will ignore handle error, will use to show in yellow box
		const contentType = response.headers.get('content-type')
		if (conf.MODE === 'PREVIEW' && contentType && contentType.includes('application/json')) {
			return response.json().then((error) => Promise.reject(error))
		}

		const e = new Error(response.statusText)
		if (response.status < 0) {
			e.name = 'NetworkError'
		} else if (response.status === 404) {
			e.name = 'NotFoundError'
		} else if (response.status === 401 || response.status === 403) {
			e.name = 'UnauthorizedError'
		} else if (response.status < 500) {
			e.name = 'ClientError'
		} else if (response.status >= 500) {
			e.name = 'ServerError'
		}

		throw e
	}
}

export const catchHandler = (err) => {
	if (err.name === 'TypeError') {
		const e = new Error(err.message)
		e.name = 'NetworkError'
		throw e
	} else {
		throw err
	}
}
