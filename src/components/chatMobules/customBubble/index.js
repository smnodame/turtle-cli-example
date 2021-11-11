import { Dimensions, View } from 'react-native'

import AudioPlayer from 'react-native-audio-player'
import { Bubble } from 'react-native-gifted-chat'
import { Bubbles } from 'react-native-loader'
import Markdown from 'react-native-markdown'
import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import getMessageDuration from '../../../utils/getMessageDuration'

const Loading = ({ isBot, style }) => {
	const color = isBot ? style.textStyle.left.color : style.textStyle.right.color
	return (
		<View style={{ margin: 12 }}>
			<Bubbles size={6} color={color} />
		</View>
	)
}

class CustomBubble extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
		}

		this.isBot = props.currentMessage.user._id !== props.user._id
	}

	componentDidMount = () => {
		const { onAddTimeout, currentMessage } = this.props
		if (!currentMessage.loaded) {
			onAddTimeout(
				setTimeout(() => {
					this.setState(
						{
							loading: false,
						},
						() => {
							const { onMessages, messages } = this.props
							if (messages.length > 0) {
								messages[currentMessage.id].loaded = true
								_.set(messages, `${currentMessage.id}.loaded`)
								onMessages({
									...messages,
								})
							}
						}
					)
				}, getMessageDuration() - 500)
			)
		}
	}

	renderCustomView = () => {
		const style = this.style()
		return (
			<View>
				<Loading isBot={this.isBot} style={style} />
			</View>
		)
	}

	renderContent = () => {
		const props = this.props

		const { width } = Dimensions.get('window')
		const audio = _.get(props.currentMessage, 'audio')
		const text = _.get(props.currentMessage, 'text')
		const style = this.style()
		const color = this.isBot ? style.textStyle.left.color : style.textStyle.right.color
		const viewProps = {
			...props,
			renderMessageText: () => (
				<View className='markdown-container' style={{ marginTop: 5, marginRight: 10, marginBottom: 5, marginLeft: 10 }}>
					<Markdown source={text} color={color} />
				</View>
			)
		}

		if (audio) {
			// overide audio from built in of gifted schat
			props.currentMessage.audio = null
			return (
				<View style={{ maxWidth: width * 0.7 }}>
					<View style={{ alignSelf: this.isBot ? 'flex-start' : 'flex-end' }}>
						<AudioPlayer source={audio} />
					</View>
					{!!text && (
						<Bubble
							{...viewProps}
							wrapperStyle={style.wrapperStyle}
							textStyle={style.textStyle}
						/>
					)}
				</View>
			)
		} else {
			return (
				<View style={{ maxWidth: width * 0.7, color: `${color}` }}>
					<Bubble
						{...viewProps}
						wrapperStyle={style.wrapperStyle}
						textStyle={style.textStyle}
					/>
				</View>
			)
		}
	}

	style = () => {
		const { design } = this.props
		return {
			wrapperStyle: {
				left: {
					backgroundColor: _.get(
						design,
						`colors.chatBubbles['${design.colors.chatBubbles.selected}'].bot.backgroundColor`,
						'#f0f0f0'
					),
				},
				right: {
					backgroundColor: _.get(
						design,
						`colors.chatBubbles['${design.colors.chatBubbles.selected}'].user.backgroundColor`,
						'#0084FF'
					),
					paddingLeft: 10,
				},
			},
			textStyle: {
				left: {
					color: _.get(
						design,
						`colors.chatBubbles['${design.colors.chatBubbles.selected}'].bot.textColor`,
						'black'
					),
				},
				right: {
					color: _.get(
						design,
						`colors.chatBubbles['${design.colors.chatBubbles.selected}'].user.textColor`,
						'white'
					),
				},
			},
		}
	}

	render() {
		var props = this.props
		const { currentMessage, messages } = this.props
		var loading = {
			...props,
			renderCustomView: this.renderCustomView,
			renderMessageImage: () => <View />,
			renderMessageText: () => <View />,
			renderTime: () => <View />,
		}
		const style = this.style()
		return (
			<View className='bubble-container'>
				{!_.get(messages, `${currentMessage.id}.loaded`) && this.state.loading ? (
					<Bubble
						{...loading}
						wrapperStyle={style.wrapperStyle}
						textStyle={style.textStyle}
					/>
				) : (
					this.renderContent()
				)}
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	messages: state.chat.messages,
	design: state.chat.design,
})

const mapDispatchToProps = (dispatch, ownProps) => ({})

const Container = connect(mapStateToProps, mapDispatchToProps)(CustomBubble)

export default Container
