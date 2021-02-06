import * as apis from '../apis'
import * as selectors from '../selectors'

import { call, put, select, take, delay } from 'redux-saga/effects'

import EventLog from '../../modules/eventlog'
import actions from '../actions'
import conf from '../../conf'
import getMessageDuration from '../../utils/getMessageDuration'
import { store } from '../index'
import types from '../types'

function* onSendSaga() {
	while (true) {
		const {
			payload: { data, trigger },
		} = yield take(types.ON_SEND)
		const id = new Date().getTime()
		const question = yield select(selectors.getCurrentQuestion)
		const message = {
			_id: id,
			id: id,
			createdAt: new Date(),
			user: {
				_id: 1,
				id: 1,
			},
			question: question,
			loaded: true,
			...data,
		}

		yield delay(200)
		try {
			// clear mode field for bubble question
			if (question.mode === 'APPROVE') {
				delete question.mode
			}

			const oldMessages = yield select(selectors.getMessages)

			// store latest question in store
			yield put(actions.lastQuestionAnswer(question))

			const loadedMessages = Object.values(oldMessages).reduce((o, n) => {
				return {
					...o,
					[n.id]: {
						...n,
						loaded: true,
					},
				}
			}, {})

			const newMessages = {
				[message.id]: {
					...message,
				},
				...loadedMessages,
			}

			// add mesage to chat board
			yield put(actions.messages(newMessages))

			// store the next question
			yield put(actions.nextMessage(trigger))

			// clear current question
			yield put(actions.currentQuestion({}))

			// add message to admin (pusher server)
			if (conf.MODE === 'MOBILE' || conf.MODE === 'FULL-CHATBOT') {
				const { room_id: roomId } = yield select(selectors.getResponse)
				yield call(apis.sendMessage, message, roomId)
			}

			if (trigger) {
				// run next step after x seconds
				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(actions.runMessage(trigger))
						}, getMessageDuration())
					)
				)
			} else {
				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(actions.done())
						}, 500)
					)
				)
			}
		} catch (err) {
			const failedMessages = yield select(selectors.getFailedMessages)
			EventLog.error('send message', {
				message: err.message
			})
			yield put(
				actions.failedMessages({
					...failedMessages,
					[id]: {
						...message,
					},
				})
			)
		}
	}
}

export default onSendSaga
