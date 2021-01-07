import * as apis from '../apis'
import * as selectors from '../selectors'

import { call, put, select, take } from 'redux-saga/effects'

import EventLog from '../../modules/eventlog'
import _ from 'lodash'
import actions from '../actions'
import { addMessageToChat } from './addMessageToChat'
import backends from '../../components/chatMobules/customBackend'
import conf from '../../conf'
import generateMessage from '../../utils/generateMessage'
import getMessageDuration from '../../utils/getMessageDuration'
import { setVariables } from '../../modules/setVariables'
import { store } from '../index'
import subscribeChat from './subscribeChat'
import types from '../types'

function transformReceive(question, answers) {
	// generate answer and replace expression
	const message = generateMessage(question.message, answers)

	return {
		text: message,
		location: question.location || null,
		image: question.image || null,
		system: question.system || null,
		audio: question.audio || null,
		question,
	}
}

function* unionMessage(nodeId, messages, answers, trigger, index = 0) {
	const currentMessage = messages[index]
	switch (currentMessage.mode) {
		case 'BUTTON': {
			const messageWithAnswer = transformReceive(
				{ message: currentMessage.question },
				answers
			)
			yield* addMessageToChat(messageWithAnswer)
			actions.onAddTimeout(
				setTimeout(() => {
					store.dispatch(
						actions.currentQuestion({
							...currentMessage,
							id: nodeId,
							trigger: trigger,
						})
					)
				}, getMessageDuration())
			)
			break
		}
		default:
			const messageWithAnswer = transformReceive(currentMessage, answers)
			yield* addMessageToChat(messageWithAnswer)
			break
	}
	if (messages.length - 1 === index) {
		const nextMessage = _.get(trigger, 'right')
		yield put(actions.nextMessage(nextMessage))
		store.dispatch(
			actions.onAddTimeout(
				setTimeout(() => {
					store.dispatch(actions.runMessage(nextMessage))
				}, getMessageDuration())
			)
		)
	} else {
		yield put(actions.nextMessage(nodeId, index + 1))
		yield put(
			actions.onAddTimeout(
				setTimeout(() => {
					store.dispatch(actions.runMessage(nodeId, index + 1))
				}, getMessageDuration())
			)
		)
	}
}

function* runMessage() {
	while (true) {
		const {
			payload: { id, index },
		} = yield take(types.RUN_MESSAGE)
		try {
			// do nothing for non id
			if (!id) {
				store.dispatch(actions.done())
				continue
			}

			// if there is only one failed message should stop running message
			const failedMessages = yield select(selectors.getFailedMessages)
			if (Object.keys(failedMessages).length > 0) {
				continue
			}

			// find question in store by id
			const question = yield select(selectors.getQuestionByID, id)

			// for the case the id is exist but question is removed
			if (!question) {
				continue
			}

			yield put(actions.nextMessage(null))

			// fetch answers in store
			const answers = yield select(selectors.getAnswers)

			const mode = question.mode.split('/')[0]
			
			EventLog.info('run message', { mode, id })

			if (mode === 'UNION-MESSAGE') {
				yield* unionMessage(id, question.messages, answers, question.trigger, index)
				continue
			} else if (mode === 'SINGLE-INPUT') {

				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
									mode: question.mode,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'AMOUNT-INPUT-LISTS') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'APPROVE') {
				const messageWithAnswer = transformReceive(
					{
						...question,
						message: '',
					},
					answers
				)
				yield* addMessageToChat(messageWithAnswer)

				yield put(actions.currentQuestion(question))
				continue
			} else if (mode === 'AUTO-COMPLETE') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'CALENDAR') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'QR-CODE') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				setTimeout(() => {
					store.dispatch(
						actions.currentQuestion({
							...question,
						})
					)
				}, getMessageDuration())
				continue
			} else if (mode === 'AUDIO-RECORDING') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'PHOTO-CAMERA') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'VIDEO-RECORDING') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)
				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'CHECKBOX') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'YESNO') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'FILE') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'SCALE') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'SIGNATURE') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'ITEM-LISTS') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'LOGIN') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'MULTI-INPUT') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'MAP') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'MAP-DIRECTION') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'OMISE') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)

				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.currentQuestion({
									...question,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			} else if (mode === 'WEB-CARD') {
				yield* addMessageToChat({
					question: question,
					system: true,
				})
			} else if (mode === 'RATING') {
				yield* addMessageToChat({
					question: question,
					system: true,
				})
			} else if (mode === 'CONTACT-INFO') {
				yield* addMessageToChat({
					question: question,
					system: true,
				})
			} else if (mode === 'BOT-PROFILE') {
				yield* addMessageToChat({
					question: question,
					system: true,
				})
				yield put(actions.updateBot(question.input.bot))
			} else if (mode === 'GOOD-BYE') {
				const messageWithAnswer = transformReceive(
					{ message: question.input.message },
					answers
				)
				yield* addMessageToChat(messageWithAnswer)
				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.addMessageToChat({
									question: question,
									system: true,
								})
							)
						}, getMessageDuration())
					)
				)
				// no more message after good bye mode
				continue
			} else if (mode === 'CODE') {
				const args = {
					question: question,
					answers: answers,
					storeAnswers: (answers, answer) => {
						store.dispatch(actions.answers(answers, answer))
					},
					variables
				}

				yield call(backends['CODE'], args)
			} else if (mode === 'CONDITION') {
				const args = {
					question: question,
					answers: answers,
					storeAnswers: (answers, answer) => {
						store.dispatch(actions.answers(answers, answer))
					},
					variables
				}

				const trigger = yield call(backends['CONDITION'], args)
				store.dispatch(actions.nextMessage(trigger))
				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(actions.runMessage(trigger))
						}, 100)
					)
				)
				continue
			} else if (mode === 'JUMP-TO') {
				const args = {
					question: question,
					answers: answers,
					storeAnswers: (answers, answer) => {
						store.dispatch(actions.answers(answers, answer))
					},
					variables
				}

				const config = yield call(backends['JUMP-TO'], args)
				const steps = yield select(selectors.getSteps)
				yield put(
					actions.storeSteps({
						...steps,
						...config.steps,
					})
				)

				if (conf.MODE === 'MOBILE' || conf.MODE === 'FULL-CHATBOT') {
					const response = yield call(
						apis.createNewResponse,
						question.input.app,
						{}
					)
					const { _id: newResponseId, room_id: newRoomId, user_id: userId } = response

					// unsubscribe main app
					const roomId = yield select(selectors.getRoomId)
					yield put(actions.unSubscribeChat(roomId))

					// set main app status response to finish
					const { slug } = yield select(selectors.getResponse)
					yield call(apis.updateResponseStatus, slug, 'FINISHED')

					const answer = {
						[question.id]: {
							answer: {
								response_id: {
									value: newResponseId,
								},
								app_id: {
									value: question.input.app,
								},
								created_at: {
									value: new Date(),
								},
							},
							mode: 'JUMP-TO',
						},
					}

					setVariables(question.id, variables, answer)

					yield put(
						actions.answers(
							{
								...answers,
								...answer,
							},
							answer
						)
					)

					// change env
					conf.APP_SLUG = question.input.app

					// subscribe jump to app
					yield put(actions.response(response))
					yield call(subscribeChat, userId, newRoomId)
				}

				// store the next question
				store.dispatch(actions.nextMessage(config.trigger))
				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(actions.runMessage(config.trigger))
						}, 100)
					)
				)
				continue
			} else if (mode === 'WEBHOOK') {
				const args = {
					question: question,
					answers: answers,
					storeAnswers: (answers, answer) => {
						store.dispatch(actions.answers(answers, answer))
					},
					addErrorMsgToYellowBox: (errMsg) => {
						store.dispatch(actions.yellowBoxError(errMsg))
					},
					variables
				}

				yield call(backends['WEBHOOK'], args)
			} else if (mode === 'SMTP') {
				const args = {
					question: question,
					answers: answers,
					storeAnswers: (answers, answer) => {
						store.dispatch(actions.answers(answers, answer))
					},
					variables
				}

				yield call(backends['SMTP'], args)
			} else if (mode === 'AB-TEST') {
				const args = {
					question: question,
					answers: answers,
					storeAnswers: (answers, answer) => {
						store.dispatch(actions.answers(answers, answer))
					},
					variables
				}
				const trigger = yield call(backends['AB-TEST'], args)
				store.dispatch(actions.nextMessage(trigger))
				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(actions.runMessage(trigger))
						}, 100)
					)
				)
				continue
			} else if (mode === 'PICTURE-CHOICE') {
				const messageWithAnswer = transformReceive({ message: question.question }, answers)
				yield* addMessageToChat(messageWithAnswer)
				yield put(
					actions.currentQuestion({
						...question,
						mode: 'PICTURE-CHOICE',
					})
				)
				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(
								actions.addMessageToChat({
									question: question,
									system: true,
								})
							)
						}, getMessageDuration())
					)
				)
				continue
			}

			const nextMessage = _.get(question, 'trigger.right')
			yield put(actions.nextMessage(nextMessage))

			if (nextMessage) {
				// run next step after x seconds
				store.dispatch(
					actions.onAddTimeout(
						setTimeout(() => {
							store.dispatch(actions.runMessage(nextMessage))
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
			console.error('[runMessageSaga] ', err)
			EventLog.error('run message', {
				message: err.message
			})
		}
	}
}

export default runMessage
