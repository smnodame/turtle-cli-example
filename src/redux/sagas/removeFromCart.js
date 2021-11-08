import * as apis from '../apis'

import { call, take, select } from 'redux-saga/effects'
import * as selectors from '../selectors'
import conf from '../../conf'
import types from '../types'

function* removeFromCart() {
	while (true) {
		const {
			payload: { id },
		} = yield take(types.REMOVE_FROM_CART)
		try {
			if (conf.MODE === 'MOBILE' || conf.MODE === 'FULL-CHATBOT') {
				const { slug } = yield select(selectors.getResponse)
				yield call(apis.removeFromCart, slug, id)
			}
		} catch (err) {
			console.error('[removeFromCart] ', err)
		}
	}
}

export default removeFromCart
