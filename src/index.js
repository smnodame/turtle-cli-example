import './index.scss'

import HybridApp from './app'
import React from 'react'
import ReactDOM from 'react-dom'
import actions from './redux/actions'
import { store } from './redux/index'

// addEventListener support for IE8
function bindEvent(element, eventName, eventHandler) {
	if (element.addEventListener) {
		element.addEventListener(eventName, eventHandler, false)
	} else if (element.attachEvent) {
		element.attachEvent('on' + eventName, eventHandler)
	}
}

// Listen to messages from parent window
bindEvent(window, 'message', function (e) {
	if (e.data && e.data.source === 'DESIGN-CONFIG') {
		store.dispatch(actions.design(e.data.data))
	}
})

ReactDOM.render(
	<div className='app-container'>
		<HybridApp />
	</div>,
	document.getElementById('root')
)
