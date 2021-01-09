import * as apis from '../../redux/apis'

import { Platform, Text, TouchableOpacity, View } from 'react-native'

import React from 'react'
import _ from 'lodash'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import { filePicker } from 'react-native-file-picker'
import generateMessage from '../../utils/generateMessage'
import { setVariables } from '../../modules/setVariables'

class File extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			pregress: 0,
		}
	}

	componentDidMount = () => {}

	onSend = () => {
		const { question, answers, storeAnswers, onSend, variables } = this.props

		filePicker().then(({ uri, name }) => {
			if (!uri) return

			const uploadData =
				Platform.OS === 'web'
					? {
							data: uri,
							func: 'uploadBlob',
					  }
					: {
							data: uri,
							func: 'uploadFile',
					  }

			this.setState({
				isUploading: true,
			})

			apis[uploadData.func](uploadData.data, this.progressCallback).then(({ link }) => {
				const answer = {
					[question.id]: {
						answer: {
							url: {
								value: link,
							},
							name: {
								value: name,
							},
							created_at: {
								value: new Date(),
							},
						},
						mode: question.mode,
					},
				}

				this.setState({
					isUploading: false,
					progress: 0,
				})

				setVariables(question.id, variables, answer)
				
				// store answers in store
				storeAnswers(
					{
						...answers,
						...answer,
					},
					answer
				)

				// generate answer and replace expression
				const message = generateMessage(question.answer, answers, answer)

				onSend(
					{
						text: message,
						file: link,
						fileName: name,
					},
					_.get(question, 'trigger.right')
				)
			})
		})
	}

	progressCallback = (percent) => {
		this.setState({
			progress: percent * 100,
		})
	}

	render = () => {
		const { question } = this.props

		const text = _.get(question, 'input.button.text', 'UPLOAD FILE')
		const { progress, isUploading } = this.state
		return (
			<View>
				{isUploading && (
					<View style={styles.progressContainer}>
						<View style={[styles.progressBar, { width: `${progress}%` }]}></View>
					</View>
				)}
				<TouchableOpacity
					disabled={isUploading}
					onPress={this.onSend}
					style={styles.button}
				>
					<Text numberOfLines={1} style={styles.text}>
						{text}
					</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	currentQuestion: state.chat.currentQuestion,
	answers: state.chat.answers,
	currentAnswer: state.chat.currentAnswer,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	storeAnswers: (answers, answer) => {
		dispatch(actions.answers(answers, answer))
	},
})

const Container = connect(mapStateToProps, mapDispatchToProps)(File)

export default Container

const styles = {
	button: {
		alignItems: 'center',
		backgroundColor: '#F8F8F8',
		borderColor: '#EEE',
		borderTopWidth: 1,
		borderWidth: 0.5,
		height: 60,
		justifyContent: 'center',
	},
	progressBar: {
		backgroundColor: '#007bff',
		borderRadius: 5,
		height: 5,
		transition: 'width .6s ease',
		width: '0%',
	},
	progressContainer: {
		margin: 1,
	},
	text: {
		color: '#4B4B4B',
		fontSize: 14,
	},
}
