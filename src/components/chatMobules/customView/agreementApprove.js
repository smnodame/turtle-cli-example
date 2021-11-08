import { Text, TouchableOpacity, View } from 'react-native'

import CheckBox from 'react-native-hybrid-checkbox'
import React from 'react'
import { WebBrowser } from 'hybrid-expo'
import _ from 'lodash'
import actions from '../../../redux/actions'
import { connect } from 'react-redux'

class AgreementApprove extends React.Component {
	onChangeCB = () => {
		const { currentQuestion, storeCurrentAnswer, currentMessage, currentAnswer } = this.props
		if (currentQuestion.id === currentMessage.question.id) {
			const isApproved = _.get(currentAnswer, `${currentMessage.question.id}.answer`)
			storeCurrentAnswer(currentMessage.question.id, !isApproved)
		}
	}

	render() {
		const { design, currentMessage, currentAnswer } = this.props
		const color = _.get(
			design,
			`colors.chatBubbles['${design.colors.chatBubbles.selected}'].bot.textColor`,
			'black'
		)

		const openWeb = (link) => {
			WebBrowser.openBrowserAsync(link)
		}

		const isApproved = _.get(currentAnswer, `${currentMessage.question.id}.answer`)

		return (
			<View>
				<TouchableOpacity onPress={this.onChangeCB}>
					<Text
						style={{
							fontSize: 14,
							padding: 8,
							paddingBottom: 6,
							color: color,
							width: 220,
						}}
					>
						{currentMessage.question.input.note}
					</Text>
				</TouchableOpacity>
				<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
					<CheckBox
						value={isApproved}
						style={{ marginLeft: 10, marginRight: 5, marginTop: 5 }}
						color='green'
						onChange={this.onChangeCB}
					/>
					<TouchableOpacity
						onPress={() => openWeb(currentMessage.question.input.link)}
						style={{ borderColor: 'white', borderTopWidth: 1, flexDirection: 'row' }}
					>
						<Text
							style={{
								color: color,
								fontWeight: '500',
								fontSize: 15,
								textAlign: 'center',
								padding: 8,
								paddingTop: 6,
								paddingBottom: 2,
							}}
						>
							{currentMessage.question.input.title}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	currentAnswer: state.chat.currentAnswer,
	currentQuestion: state.chat.currentQuestion,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	storeCurrentAnswer: (id, answer) => {
		dispatch(actions.currentAnswer(id, answer))
	},
})

const Container = connect(mapStateToProps, mapDispatchToProps)(AgreementApprove)

export default Container
