import * as apis from '../../redux/apis'

import { Entypo, Ionicons } from 'hybrid-icon'
import { TextInput as Input, Platform, TouchableOpacity, View } from 'react-native'

import React from 'react'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import { filePicker } from 'react-native-file-picker'

class HumanTakeOver extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			text: '',
			progress: 0,
		}
	}

	onSend = () => {
		const { text } = this.state
		if (text) {
			this.setState({
				text: '',
			})

			this.props.onSendMsgToHuman({
				text,
			})
		}
	}

	onTextChange = (text) => {
		this.setState({
			text,
		})
	}

	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps)
	}

	imagePicker = () => {
		filePicker({ accept: '.jpg, .png, .jpeg, .gif' }).then(({ uri, name }) => {
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
			const { text } = this.state
			this.setState({
				text: '',
				isUploading: true,
			})

			apis[uploadData.func](uploadData.data, this.progressCallback).then(({ link }) => {
				this.setState({
					progress: 0,
					isUploading: false,
				})

				this.props.onSendMsgToHuman({
					text: text,
					image: link,
				})
			})
		})
	}

	progressCallback = (percent) => {
		this.setState({
			progress: percent * 100,
		})
	}

	render() {
		const { progress, isUploading } = this.state
		return (
			<View>
				{isUploading && (
					<View style={componentStyles.progressContainer}>
						<View
							style={[componentStyles.progressBar, { width: `${progress}%` }]}
						></View>
					</View>
				)}
				<View style={componentStyles.textinputContainer}>
					<TouchableOpacity onPress={this.imagePicker} style={componentStyles.sendButton}>
						<View ref={(component) => (this._root = component)}>
							<Entypo name='image' style={{ fontSize: 22, color: 'gray' }} />
						</View>
					</TouchableOpacity>
					<Input
						blurOnSubmit={false}
						onSubmitEditing={this.onSend}
						style={componentStyles.textinput}
						returnKeyType={'done'}
						value={this.state.text}
						onChangeText={this.onTextChange}
						placeholderTextColor={'#999'}
						placeholder={this.placeholder}
						underlineColorAndroid='transparent'
					/>
					<TouchableOpacity onPress={this.onSend} style={componentStyles.sendButton}>
						<View ref={(component) => (this._root = component)}>
							<Ionicons name='md-send' style={{ fontSize: 30, color: '#FF006F' }} />
						</View>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	answers: state.chat.answers,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	storeAnswers: (answers, answer) => {
		dispatch(actions.answers(answers, answer))
	},
	onSendMsgToHuman: (data) => {
		dispatch(actions.onSendMsgToHuman(data))
	},
})

const Container = connect(mapStateToProps, mapDispatchToProps)(HumanTakeOver)

export default Container

const componentStyles = {
	closeButton: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 10,
	},
	closeIcon: {
		color: '#FFFFFF',
		padding: 5,
	},
	errorBox: {
		alignItems: 'center',
		backgroundColor: '#FFAAAA',
		flexDirection: 'row',
		height: 40,
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
	sendButton: {
		alignItems: 'center',
		height: 40,
		justifyContent: 'center',
		marginTop: 2,
		width: 40,
	},
	textError: {
		color: 'white',
	},
	textinput: {
		backgroundColor: 'white',
		borderColor: '#CCC',
		borderRadius: 5,
		borderWidth: 0.5,
		flex: 1,
		height: 45,
		marginBottom: 5,
		marginLeft: 5,
		marginRight: 5,
		paddingHorizontal: 20,
		paddingLeft: 10,
		paddingRight: 10,
	},
	textinputContainer: {
		backgroundColor: '#f2f2f2',
		display: 'flex',
		flexDirection: 'row',
		height: 60,
		padding: 10,
		paddingTop: 8,
	},
}
