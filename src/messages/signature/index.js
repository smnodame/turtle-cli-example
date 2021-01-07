import * as apis from '../../redux/apis'

import { Platform, Text, TouchableOpacity, View } from 'react-native'

import DrawPad from 'react-native-draw-signature'
import { Entypo } from 'hybrid-icon'
import React from 'react'
import _ from 'lodash'
import generateMessage from '../../utils/generateMessage'
import moment from 'moment'
import { setVariables } from '../../modules/setVariables'

export default class Signature extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			progress: 0,
			isUploading: false,
		}
	}

	onDone = () => {
		const base64 = this.ref.toDataURL()
		if (!base64) return

		this.setState({
			isUploading: true,
		})

		const uploadData =
			Platform.OS === 'web'
				? {
						data: base64,
						func: 'uploadBlob',
				  }
				: {
						data: base64,
						func: 'uploadFile',
				  }

		apis[uploadData.func](uploadData.data, this.progressCallback).then(({ link }) => {
			const { question, answers, storeAnswers, onSend } = this.props

			const answer = {
				[question.id]: {
					answer: {
						url: {
							value: link,
						},
						created_at: {
							value: new Date(),
						},
					},
					mode: question.mode,
				},
			}

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
					image: link,
				},
				_.get(question, 'trigger.right')
			)
		})
	}

	onClear = () => {
		this.ref.clear()
	}

	progressCallback = (percent) => {
		this.setState({
			progress: percent * 100,
		})
	}

	render = () => {
		const text = _.get(this.props.question, 'input.button.text', 'SEND')
		const dateFormat = _.get(this.props.question, 'input.date_format', 'MMM Do YYYY')
		const { progress, isUploading } = this.state
		return (
			<View>
				{isUploading && (
					<View style={styles.progressContainer}>
						<View style={[styles.progressBar, { width: `${progress}%` }]}></View>
					</View>
				)}
				<View style={styles.signature.style}>
					<View style={styles.signature.body}>
						<DrawPad
							getRef={(ref) => {
								this.ref = ref
							}}
						/>
						<View style={styles.time.style}>
							<Text style={styles.time.text}>{moment().format(dateFormat)}</Text>
						</View>
						<TouchableOpacity onPress={this.onClear} style={styles.clear.style}>
							<Entypo
								name='cross'
								style={{ color: '#888', marginLeft: 2, marginTop: 2 }}
								size={22}
							/>
						</TouchableOpacity>
						{isUploading && <View style={styles.signature.block} />}
					</View>
				</View>
				<TouchableOpacity
					onPress={() => {
						this.onDone()
					}}
					disabled={isUploading}
					style={styles.done.style}
				>
					<Text numberOfLines={1} style={styles.done.text}>
						{text}
					</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = {
	clear: {
		icon: {},
		style: {
			alignItems: 'center',
			backgroundColor: '#F8F8F8',
			borderColor: '#EEE',
			borderRadius: 15,
			borderWidth: 0.5,
			display: 'flex',
			height: 30,
			justifyContent: 'center',
			margin: 4,
			position: 'absolute',
			right: 0,
			top: 0,
			width: 30,
		},
	},
	done: {
		style: {
			alignItems: 'center',
			backgroundColor: '#F8F8F8',
			borderColor: '#EEE',
			borderTopWidth: 1,
			borderWidth: 0.5,
			height: 60,
			justifyContent: 'center',
		},
		text: {
			color: '#4B4B4B',
			fontSize: 14,
		},
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
	signature: {
		block: {
			bottom: 0,
			left: 0,
			position: 'absolute',
			right: 0,
			top: 0,
		},
		body: {
			backgroundColor: 'white',
			borderColor: '#CCC',
			borderRadius: 10,
			borderStyle: 'dashed',
			borderWidth: 2,
			flex: 1,
			margin: 10,
		},
		style: {
			backgroundColor: '#F8F8F8',
			borderColor: '#EEE',
			borderTopWidth: 1,
			borderWidth: 0.5,
			height: 180,
		},
	},
	time: {
		style: {
			position: 'absolute',
			top: '70%',
			width: '100%',
		},
		text: {
			color: '#999',
			fontSize: 14,
			marginTop: 8,
			textAlign: 'center',
			width: '100%',
		},
	},
}
