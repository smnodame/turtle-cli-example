export const getQuestionByID = (state, id) => {
	return state.chat.steps[id]
}

export const getAnswers = (state) => {
	return state.chat.answers
}

export const getBot = (state) => {
	return state.chat.bot
}

export const getMessages = (state) => {
	return state.chat.messages
}

export const getCurrentQuestion = (state) => {
	return state.chat.currentQuestion
}

export const getResponseId = (state) => {
	return state.chat.response._id
}

export const getRoomId = (state) => {
	return state.chat.response.room_id
}

export const getIsDirtyResponse = (state) => {
	return state.chat.isDirtyResponse
}

export const getSteps = (state) => {
	return state.chat.steps
}

export const getTimeouts = (state) => {
	return state.chat.timeouts
}

export const getApp = (state) => {
	return state.chat.app
}

export const getStartOver = (state) => {
	return state.chat.startOver
}

export const getCredentials = (state) => {
	return state.chat.credentials
}

export const getPusherManager = (state) => {
	return state.chat.pusherManager
}

export const getResponse = (state) => {
	return state.chat.response
}

export const getNextMessage = (state) => {
	return state.chat.nextMessage
}

export const getFailedMessages = (state) => {
	return state.chat.failedMessages
}

export const getAccessToken = (state) => {
	return state.chat.security.accessToken
}
