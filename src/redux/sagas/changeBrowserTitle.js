import conf from '../../conf'

function changeBrowserTitle(app) {
	if (conf.MODE === 'FULL-CHATBOT') {
		// change title name
		document.title = app.name

		// change shortcut icon
		var link = document.querySelector(`link[rel*='icon']`) || document.createElement('link')
		link.type = 'image/x-icon'
		link.rel = 'shortcut icon'
		link.href = app.icon
		document.getElementsByTagName('head')[0].appendChild(link)
	}
}

export default changeBrowserTitle
