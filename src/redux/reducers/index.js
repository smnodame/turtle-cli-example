import _ from 'lodash'
import conf from '../../conf'
import types from '../types'

const defaultState = {
	answers: {},
	app: {},
	bot: {
		_id: 2,
		id: 2,
		name: 'SYSTEM BOT',
	},
	currentAnswer: {},
	currentQuestion: {},
	design: {},
	failedMessages: {},
	isDirtyResponse: false,
	isLoadingRequireData: true,
	isRestarting: false,
	messages: {},
	nextQuestion: null,
	response: {},
	startAppError: null,
	timeouts: [],
	variables: {},
	editOrder: undefined,
	orders: {},
	humantakeover: {}
}

const chat = (state = defaultState, action) => {
	switch (action.type) {
		case types.CURRENT_QUESTION:
			return {
				...state,
				currentQuestion: action.payload.currentQuestion,
			}
		case types.CLEAE_STATE_WITHOUT_REFRESH:
			return {
				...state,
				answers: {},
				currentAnswer: {},
				currentQuestion: {},
				failedMessages: {},
				isDirtyResponse: false,
				messages: [],
				nextQuestion: null,
				orders: {},
				editOrder: null
			}
		case types.HUMANTAKEOVER:
			return {
				...state,
				humantakeover: {
					...state.humantakeover,
					...action.payload,
				}
			}
		case types.LAST_QUESTION_ANSWER:
			return {
				...state,
				lastQuestionAnswer: action.payload.lastQuestionAnswer,
			}
		case types.ANSWERS:
			return {
				...state,
				answers: action.payload.answers,
			}
		case types.CURRENT_ANSWER:
			return {
				...state,
				currentAnswer: {
					...state.currentAnswer,
					...action.payload.currentAnswer,
				},
			}
		case types.CLEAR_STATE:
			// should keep error because when user click retry on the error page,
			// it will clear all state and it will show loading page instead of error page with loading
			return {
				...defaultState,
				startAppError: _.get(state, 'startAppError'),
			}
		case types.STEPS:
			return {
				...state,
				steps: action.payload.steps,
			}
		case types.MESSAGES:
			return {
				...state,
				messages: action.payload.messages,
			}
		case types.UPDATE_BOT: {
			return {
				...state,
				bot: action.payload.bot,
			}
		}
		case types.RESPONSE_ID: {
			return {
				...state,
				responseId: action.payload.id,
			}
		}
		case types.SET_DIRTY_RESPONSE: {
			return {
				...state,
				isDirtyResponse: true,
			}
		}
		case types.APP: {
			return {
				...state,
				app: action.payload.app,
			}
		}
		case types.IS_SHOWING_INTRO: {
			return {
				...state,
				isShowingIntro: action.payload.isShowing,
			}
		}
		case types.APP_INTRO:
			return {
				...state,
				appIntro: action.payload.intro,
			}
		case types.DESIGN:
			return {
				...state,
				design: action.payload.design,
			}
		case types.IS_LOADING_REQUIRE_DATA:
			return {
				...state,
				isLoadingRequireData: action.payload.status,
			}
		case types.ON_ADD_TIMEOUT:
			return {
				...state,
				timeouts: [...state.timeouts, action.payload.timeout],
			}
		case types.START_OVER:
			return {
				...state,
				startOver: action.payload.config,
			}
		case types.CREDENTIALS:
			return {
				...state,
				credentials: action.payload.credentials,
			}
		case types.PUSHER_MANAGER:
			return {
				...state,
				pusherManager: action.payload.pusherManager,
			}
		case types.RESPONSE:
			return {
				...state,
				response: action.payload.response,
			}
		case types.MESSAGES_QUEUE:
			return {
				...state,
				messagesQueue: action.payload.messages,
			}
		case types.NEXT_MESSAGE:
			return {
				...state,
				nextMessage: {
					trigger: action.payload.trigger,
					index: action.payload.index,
				},
			}
		case types.FAILED_MESSAGES:
			return {
				...state,
				failedMessages: {
					...action.payload.failedMessages,
				},
			}
		case types.RETRYING_ERROR_MESSAGE:
			return {
				...state,
				isRetryingErrorMessage: action.payload.status,
			}
		case types.START_APP_ERROR:
			return {
				...state,
				startAppError: action.payload.error,
			}
		case types.IS_RESTARTING:
			return {
				...state,
				isRestarting: action.payload.status,
			}
		case types.YELLOW_BOX_ERROR:
			return {
				...state,
				yellowBoxError: action.payload.error,
			}
		case types.TOGGLE_YELLOW_BOX:
			return {
				...state,
				isExpandYellowBox: action.payload.isExpand,
			}
		case types.IS_REQUESTING:
			return {
				...state,
				isRequesting: action.payload.status,
			}
		case types.ACCESS_TOKEN:
			// assign access token to conf class, so the api function can use it easier
			conf.ACCESS_TOKEN = action.payload.accessToken
			return {
				...state,
				security: {
					accessToken: action.payload.accessToken,
				},
			}
		case types.VARIABLES:
			return {
				...state,
				variables: action.payload.variables
			}
		case types.TYPING_EMULATION:
			return {
				...state,
				typingEmulation: action.payload.typingEmulation,
			}
		case types.UPDATE_EDIT_ORDER:
			return {
				...state,
				editOrder: action.payload.editOrder
			}
		case types.ORDERS:
			return {
				...state,
				orders: action.payload.orders
			}
		default:
			return state
	}
}

export { chat }
