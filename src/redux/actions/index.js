import types from '../types'

const currentQuestion = (currentQuestion) => {
	return {
		type: types.CURRENT_QUESTION,
		payload: {
			currentQuestion,
		},
	}
}

const nextMessage = (trigger, index) => {
	return {
		type: types.NEXT_MESSAGE,
		payload: {
			trigger,
			index,
		},
	}
}

const app = (app) => {
	return {
		type: types.APP,
		payload: {
			app,
		},
	}
}

const lastQuestionAnswer = (lastQuestionAnswer) => {
	return {
		type: types.LAST_QUESTION_ANSWER,
		payload: {
			lastQuestionAnswer,
		},
	}
}

const answers = (answers, newAnswer) => {
	return {
		type: types.ANSWERS,
		payload: {
			answers,
			newAnswer,
		},
	}
}

const currentAnswer = (id, answer) => {
	return {
		type: types.CURRENT_ANSWER,
		payload: {
			currentAnswer: {
				[id]: {
					answer: answer,
				},
			},
		},
	}
}

const onStartApp = () => {
	return {
		type: types.START_APP,
	}
}

const onRestart = () => {
	return {
		type: types.RESTART,
	}
}

const fetchRequireData = () => {
	return {
		type: types.FETCH_REQUIRE_DATA,
	}
}

const runMessage = (id, index) => {
	return {
		type: types.RUN_MESSAGE,
		payload: {
			id,
			index,
		},
	}
}

const onClearState = () => {
	return {
		type: types.CLEAR_STATE,
	}
}

const storeSteps = (steps) => {
	return {
		type: types.STEPS,
		payload: {
			steps,
		},
	}
}

const addMessageToChat = (message) => {
	return {
		type: types.ADD_MESSAGE_TO_CHAT,
		payload: {
			message,
		},
	}
}

const messages = (messages) => {
	return {
		type: types.MESSAGES,
		payload: {
			messages,
		},
	}
}

const onSend = (data, trigger) => {
	return {
		type: types.ON_SEND,
		payload: {
			data,
			trigger,
		},
	}
}

const updateBot = (bot) => {
	return {
		type: types.UPDATE_BOT,
		payload: {
			bot,
		},
	}
}

const responseId = (id) => {
	return {
		type: types.RESPONSE_ID,
		payload: {
			id,
		},
	}
}

const setDirtyResponse = () => {
	return {
		type: types.SET_DIRTY_RESPONSE,
	}
}

const done = () => {
	return {
		type: types.DONE,
	}
}

const isShowingIntro = (isShowing) => {
	return {
		type: types.IS_SHOWING_INTRO,
		payload: {
			isShowing,
		},
	}
}

const onDoneIntro = () => {
	return {
		type: types.ON_DONE_INTRO,
	}
}

const appIntro = (intro) => {
	return {
		type: types.APP_INTRO,
		payload: {
			intro,
		},
	}
}

const design = (design) => {
	return {
		type: types.DESIGN,
		payload: {
			design,
		},
	}
}

const isLoadingRequireData = (status) => {
	return {
		type: types.IS_LOADING_REQUIRE_DATA,
		payload: {
			status,
		},
	}
}

const onClearStateWithOutRefresh = () => {
	return {
		type: types.CLEAE_STATE_WITHOUT_REFRESH,
	}
}

const onAddTimeout = (timeout) => {
	return {
		type: types.ON_ADD_TIMEOUT,
		payload: {
			timeout,
		},
	}
}

const onClearTimeouts = () => {
	return {
		type: types.ON_CLEAR_TIMEOUTS,
	}
}

const askConfirmRestart = () => {
	return {
		type: types.ASK_CONFIRM_RESTART,
	}
}

const startOver = (config) => {
	return {
		type: types.START_OVER,
		payload: {
			config,
		},
	}
}

const credentials = (credentials) => {
	return {
		type: types.CREDENTIALS,
		payload: {
			credentials,
		},
	}
}

const pusherManager = (pusherManager) => {
	return {
		type: types.PUSHER_MANAGER,
		payload: {
			pusherManager,
		},
	}
}

const subscribeChat = (userId, roomId) => {
	return {
		type: types.SUBSCRIBE_CHAT,
		payload: {
			userId,
			roomId,
		},
	}
}

const response = (response) => {
	return {
		type: types.RESPONSE,
		payload: {
			response,
		},
	}
}

const unSubscribeChat = (roomId) => {
	return {
		type: types.UNSUBSCRIBE_CHAT,
		payload: {
			roomId,
		},
	}
}

const messagesQueue = (messages) => {
	return {
		type: types.MESSAGES_QUEUE,
		payload: {
			messages,
		},
	}
}

const requestFailed = () => {
	return {
		type: types.REQUEST_FAILED,
		payload: {},
	}
}

const networkDown = () => {
	return {
		type: types.NETWORK_DOWN,
	}
}

const onSendMsgToHuman = (data) => {
	return {
		type: types.ON_SEND_MSG_TO_HUMAN,
		payload: {
			data,
		},
	}
}

const failedMessages = (failedMessages) => {
	return {
		type: types.FAILED_MESSAGES,
		payload: {
			failedMessages,
		},
	}
}

const retryErrorMessage = () => {
	return {
		type: types.RETRY_ERROR_MESSAGE,
	}
}

const retryingErrorMessage = (status) => {
	return {
		type: types.RETRYING_ERROR_MESSAGE,
		payload: {
			status,
		},
	}
}

const startAppError = (error) => {
	return {
		type: types.START_APP_ERROR,
		payload: {
			error,
		},
	}
}

const isRestarting = (status) => {
	return {
		type: types.IS_RESTARTING,
		payload: {
			status,
		},
	}
}

const yellowBoxError = (error) => {
	return {
		type: types.YELLOW_BOX_ERROR,
		payload: {
			error,
		},
	}
}

const toggleYellowBox = (isExpand) => {
	return {
		type: types.TOGGLE_YELLOW_BOX,
		payload: {
			isExpand,
		},
	}
}

const isRequesting = (status) => {
	return {
		type: types.IS_REQUESTING,
		payload: {
			status,
		},
	}
}

const registerCollectorAccount = () => {
	return {
		type: types.REGISTER_COLLECTOR_ACCOUNT,
	}
}

const accessToken = (accessToken) => {
	return {
		type: types.ACCESS_TOKEN,
		payload: {
			accessToken,
		},
	}
}

const typingEmulation = (typingEmulation) => {
	return {
		type: types.TYPING_EMULATION,
		payload: {
			typingEmulation,
		},
	}
}

const variables = (variables) => {
	return {
		type: types.VARIABLES,
		payload: {
			variables
		}
	}
}

const addToCart = (id) => {
	return {
		type: types.ADD_TO_CART,
		payload: {
			id
		}
	}
}

const removeFromCart = (id) => {
	return {
		type: types.REMOVE_FROM_CART,
		payload: {
			id
		}
	}
}

const editOrder = (editOrder) => {
	return {
		type: types.UPDATE_EDIT_ORDER,
		payload: {
			editOrder,
		}
	}
}

const orders = (orders) => {
	return {
		type: types.ORDERS,
		payload: {
			orders
		}
	}
}

const humantakeover = (payload) => {
	return {
		type: types.HUMANTAKEOVER,
		payload
	}
}

const generateQrCodePayment = (input, userID) => {
	return {
		type: types.GENERATE_QR_CODE_PAYMENT,
		payload: {
			input,
		    userID
		}
	}
}

const saveQrCodePayment = (qrCodePaymentURL) => {
	return {
		type: types.SAVE_QR_CODE_PAYMENT,
		payload: {
			qrCodePaymentURL
		}
	}
}

const actions = {
	accessToken,
	addMessageToChat,
	answers,
	app,
	appIntro,
	askConfirmRestart,
	credentials,
	currentAnswer,
	currentQuestion,
	design,
	done,
	failedMessages,
	fetchRequireData,
	isLoadingRequireData,
	isRequesting,
	isRestarting,
	isShowingIntro,
	lastQuestionAnswer,
	messages,
	messagesQueue,
	networkDown,
	nextMessage,
	onAddTimeout,
	onClearState,
	onClearStateWithOutRefresh,
	onClearTimeouts,
	onDoneIntro,
	onRestart,
	onSend,
	onSendMsgToHuman,
	onStartApp,
	pusherManager,
	registerCollectorAccount,
	requestFailed,
	response,
	responseId,
	retryErrorMessage,
	retryingErrorMessage,
	runMessage,
	setDirtyResponse,
	startAppError,
	startOver,
	storeSteps,
	subscribeChat,
	toggleYellowBox,
	typingEmulation,
	unSubscribeChat,
	updateBot,
	yellowBoxError,
	variables,
	removeFromCart,
	addToCart,
	editOrder,
	orders,
	humantakeover,
	generateQrCodePayment,
	saveQrCodePayment
}

export default actions
