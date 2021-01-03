import { Text, TouchableOpacity, View } from 'react-native'

import React from 'react'
import Share from 'react-native-share'
import SvgUri from 'react-native-svg-uri'
import { WebBrowser } from 'hybrid-expo'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import { retry } from '../../images'

class GoodBye extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			countdown: props.question.input.start_again_button.countdown || 3,
		}
	}

	componentDidMount() {
		const { redirect } = this.props.question.input

		if (redirect.enable) {
			let countdown = redirect.countdown || 3

			this.setState({
				countdown,
			})

			this.countdown = setInterval(() => {
				this.setState(
					{
						countdown: this.state.countdown - 1,
					},
					() => {
						if (this.state.countdown === 0) {
							clearInterval(this.countdown)
							WebBrowser.openBrowserAsync(redirect.url)
						}
					}
				)
			}, 1000)
		}
	}

	render() {
		const { social, start_again_button, redirect } = this.props.question.input
		const { onStartApp } = this.props
		return (
			<View style={{ marginTop: 12 }}>
				{!!social.enable && <Share url={social.url} />}
				{!!start_again_button.enable && (
					<View
						style={{
							displey: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							margin: 8,
							marginTop: 18,
						}}
					>
						<SvgUri width='30' height='30' svgXmlData={retry} />
						<TouchableOpacity onPress={onStartApp} style={{ padding: 4 }}>
							<Text style={{ fontWeight: '600', color: '#363636' }}>
								{this.props.question.input.start_again_button.text}
							</Text>
						</TouchableOpacity>
					</View>
				)}
				{!!redirect.enable && this.state.countdown !== 0 && (
					<View
						style={{
							displey: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<TouchableOpacity onPress={onStartApp} style={{ padding: 4 }}>
							<Text style={{ fontWeight: '400', color: '#363636' }}>
								{'Redirect your in {timeout}'.replace(
									'{timeout}',
									this.state.countdown
								)}
							</Text>
						</TouchableOpacity>
					</View>
				)}
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
	onStartApp: () => {
		dispatch(actions.onStartApp())
	},
})

const Container = connect(mapStateToProps, mapDispatchToProps)(GoodBye)

export default Container
