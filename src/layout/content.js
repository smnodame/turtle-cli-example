import * as FilePicker from 'react-native-file-picker'
import { footerMaxHeight } from '../constants'
import Alert from 'react-native-alert'
import CustomActions from '../components/chatMobules/customActions'
import CustomBubble from '../components/chatMobules/customBubble'
import CustomSystem from '../components/chatMobules/customSystem'
import CustomView from '../components/chatMobules/customView'
import { GiftedChat } from 'react-native-gifted-chat'
import React from 'react'
import { View } from 'react-native'
import actions from '../redux/actions'
import { connect } from 'react-redux'

class Content extends React.Component {
	runMessage = (id) => {
		const { runMessage } = this.props
		runMessage(id)
	}

	onSend = (data, trigger) => {
		const { onSend } = this.props
		onSend(data, trigger)
	}

	renderChatFooter = () => {
		const {
			answers,
			credentials,
			currentAnswer,
			currentQuestion,
			failedMessages,
			isRetryingErrorMessage,
			retryErrorMessage,
			storeAnswers,
			storeCurrentAnswer,
			variables
		} = this.props
		return (
			<CustomActions
				onSend={this.onSend}
				currentQuestion={currentQuestion}
				storeAnswers={storeAnswers}
				answers={answers}
				currentAnswer={currentAnswer}
				storeCurrentAnswer={storeCurrentAnswer}
				credentials={credentials}
				failedMessages={failedMessages}
				retryErrorMessage={retryErrorMessage}
				isRetryingErrorMessage={isRetryingErrorMessage}
				variables={variables}
			/>
		)
	}

	renderInputToolbar = (props) => {
		return null
	}

	renderContainerFooter = (props) => {
		return <View style={{ maxHeight: footerMaxHeight }}>{this.renderChatFooter()}</View>
	}

	renderBubble = (props) => {
		const { design, onAddTimeout, onMessages } = this.props
		return (
			<CustomBubble
				{...props}
				design={design}
				onAddTimeout={onAddTimeout}
				onMessages={onMessages}
			/>
		)
	}

	renderCustomView = (props) => {
		return <CustomView {...props} />
	}

	renderDay() {
		return <View />
	}

	renderSystemMessage = (props) => {
		const { currentQuestion, currentAnswer, storeCurrentAnswer } = this.props
		return (
			<CustomSystem
				{...props}
				currentQuestion={currentQuestion}
				runMessage={this.runMessage}
				currentAnswer={currentAnswer}
				storeCurrentAnswer={storeCurrentAnswer}
			/>
		)
	}

	render() {
		const { messages } = this.props
		return (
			<View
				behavior='padding'
				style={{
					flex: 1,
				}}
				className='chat-container'
			>
				<GiftedChat
					messages={Object.values(messages)}
					renderChatFooter={this.renderContainerFooter}
					renderInputToolbar={this.renderInputToolbar}
					minInputToolbarHeight={0}
					onSend={(message, trigger) => this.onSend(message, trigger)}
					renderBubble={this.renderBubble}
					renderDay={this.renderDay}
					renderCustomView={this.renderCustomView}
					renderSystemMessage={this.renderSystemMessage}
					user={{
						_id: 1,
						id: 1,
					}}
				/>
				<Alert.view />
				<FilePicker.view />
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	answers: state.chat.answers,
	app: state.chat.app,
	credentials: state.chat.credentials,
	currentAnswer: state.chat.currentAnswer,
	currentQuestion: state.chat.currentQuestion,
	design: state.chat.design,
	failedMessages: state.chat.failedMessages,
	isRetryingErrorMessage: state.chat.isRetryingErrorMessage,
	messages: state.chat.messages,
	variables: state.chat.variables
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onAddTimeout: (timeout) => {
		dispatch(actions.onAddTimeout(timeout))
	},
	onMessages: (messages) => {
		dispatch(actions.messages(messages))
	},
	onSend: (data, trigger) => {
		dispatch(actions.onSend(data, trigger))
	},
	retryErrorMessage: () => {
		dispatch(actions.retryErrorMessage())
	},
	runMessage: (id) => {
		dispatch(actions.runMessage(id))
	},
	storeAnswers: (answers, answer) => {
		dispatch(actions.answers(answers, answer))
	},
	storeCurrentAnswer: (id, answer) => {
		dispatch(actions.currentAnswer(id, answer))
	},
})

const Container = connect(mapStateToProps, mapDispatchToProps)(Content)

export default Container
