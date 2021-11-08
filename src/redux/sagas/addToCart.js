import * as apis from '../apis'

import { call, take, select } from 'redux-saga/effects'
import * as selectors from '../selectors'
import conf from '../../conf'
import types from '../types'

function* addToCart() {
	while (true) {
		const {
			payload: { id },
		} = yield take(types.ADD_TO_CART)
		try {
			if (conf.MODE === 'MOBILE' || conf.MODE === 'FULL-CHATBOT') {
				const { slug } = yield select(selectors.getResponse)
				yield call(apis.addToCart, slug, id)
			}
		} catch (err) {
			console.error('[addToCart] ', err)
		}
	}
}

export default addToCart
