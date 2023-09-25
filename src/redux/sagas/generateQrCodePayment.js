import conf from '../../conf'
import * as apis from '../apis'
import actions from '../actions'
import { call, put, select, take } from 'redux-saga/effects'
import { v4 as uuidv4, validate as uuidValidate } from 'uuid'

import * as selectors from '../selectors'
import EventLog from '../../modules/eventlog'
import types from '../types'

function* generateQrCodePayment() { // Use 'function*' to define a generator function
    while (true) {
        const {
            payload: { input, userID },
        } = yield take(types.GENERATE_QR_CODE_PAYMENT)
        try {
            let userId = ""
            if (conf.MODE === 'FULL-PREVIEW' || conf.MODE === 'TEMPLATE-PREVIEW') {
                userId = uuidv4()
                userId = userId.replace(/-/g, '')
            }else{
                const registerCollectorAccount = yield call(apis.registerCollectorAccount)
                userId = registerCollectorAccount.user_id
            }

            const response = yield call(
                apis.generateQrCodePayment,
                input,
                userId
            )
            console.log("response", response)
            yield put(actions.saveQrCodePayment(response))
        } catch (err) {
            console.error('[addToCart] ', err)
        }
    }
}

export default generateQrCodePayment
