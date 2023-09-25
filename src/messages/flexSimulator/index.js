import { ActivityIndicator, View } from 'react-native'

import React from 'react'
import { WebBrowser } from 'hybrid-expo'
import { WebView } from 'react-native-webview'
import actions from '../../redux/actions'
import config from '../../conf'
import { connect } from 'react-redux'
import generateMessage from '../../utils/generateMessage'

class FlexSimulator extends React.Component {
	state = {
		style: {
			height: 0.5,
		},
		loading: true,
	}

	componentDidMount = () => {
		const { question, answers } = this.props

		setTimeout(() => {
			this.webView.postMessage({
				source: 'FLEX-SIMULATOR',
				data: JSON.parse(generateMessage(JSON.stringify(question), answers)),
				style: {
					backgroundColor: 'transparent',
					zoom: '90%'
				}
			}, '*')
		}, 1500)
	}

	onMessage = (event) => {
		try {
			const { runMessage, question } = this.props
			const extractedPayload = event.nativeEvent.data
			if (extractedPayload.type === 'postback') {
				const clickedID = extractedPayload.data.split('=')[1]
				runMessage(question.trigger[clickedID])
				return
			} else if (extractedPayload.type === 'uri') {
				WebBrowser.openBrowserAsync(extractedPayload.uri)
				return
			}

			if (extractedPayload?.action === 'SET_HEIGHT') {
				this.setState({
					[extractedPayload.id]: {
						style: {
							...this.state.style,
							height: extractedPayload.payload,
						},
						loading: false
					}
				})
			}
		} catch (err) {
			console.error('[onMessage] ', err)
		}
	}

	render = () => {
		const { question } = this.props
		const dynamicStyle = this.state[question.id] ? this.state[question.id].style : {};
		const loading = this.state[question.id] ? this.state[question.id].loading : {};

		return (
			<View>
				{
					loading && <View style={{ marginTop: 40 }}>
						<ActivityIndicator size='small' />
					</View>
				}
				<WebView
					scalesPageToFit
					originWhitelist={['*']}
					javaScriptEnabled={true}
					onNavigationStateChange={(evt) => { }}
					onError={(err) => {
						console.error('Error occured', err)
					}}
					onMessage={this.onMessage}
					useWebKit={true}
					source={{ uri: `${config.APP_PROTOCAL}://flex.${config.APP_HOST}` }}
					style={dynamicStyle}
					ref={(webView) => this.webView = webView}
				/>
			</View>
		)
	}
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch, ownProps) => ({
	runMessage: (id) => {
		dispatch(actions.runMessage(id))
	}
})

const FlexSimulatorWrapper = connect(mapStateToProps, mapDispatchToProps)(FlexSimulator)

export default FlexSimulatorWrapper