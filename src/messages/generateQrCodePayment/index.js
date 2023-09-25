import { Image, Text, TouchableOpacity, View } from 'react-native'

import React from 'react'
import Share from 'react-native-share'
import SvgUri from 'react-native-svg-uri'
import { WebBrowser } from 'hybrid-expo'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import { retry } from '../../images'

class GenerateQrCodePayment extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount = () => {
		const { question, generateQrCodePayment } = this.props
		generateQrCodePayment(question.input)
		console.log(question)

	}

	render() {
		const { qr_code_url, question } = this.props
		return (
			<View >
				<Text style={styles.text}>{question.question}</Text>
				<Image source={{ uri: qr_code_url.qr_code_url }} style={{ width: 260, height: 260 }} />
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	answers: state.chat.answers,
	qr_code_url: state.chat.qrCodePaymentURL
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	storeAnswers: (answers, answer) => {
		dispatch(actions.answers(answers, answer))
	},
	onStartApp: () => {
		dispatch(actions.onStartApp())
	},
	generateQrCodePayment: (input, userID) => {
		dispatch(actions.generateQrCodePayment(input, userID))
	},
})

const Container = connect(mapStateToProps, mapDispatchToProps)(GenerateQrCodePayment)

export default Container

const styles = {
	image: {
		borderTopLeftRadius: 20,
		borderTopRightRaduis: 20,
		flex: 1,
		height: 120,
		width: '100%',
	},
	text: {
		backgroundColor: '#F8F8F8',
		borderColor: '#EEE',
		width: 260,
		height: 'auto', 
		justifyContent: 'center',
		alignItems: 'center',
		overflowWrap: 'break-word', 
		padding: '30px'
	},
}
