import { WebView } from 'react-native-webview'
import generateMessage from '../../utils/generateMessage'
import { View, ActivityIndicator } from 'react-native'
import actions from '../../redux/actions'
import React from 'react'
import { connect } from 'react-redux'
import { WebBrowser } from 'hybrid-expo'
import config from '../../conf'

class FlexSimulator extends React.Component {
	state = {
		style: {
			height: 0.5,
		},
		loading: true
	}

	componentDidMount = () => {
		const { question, answers } = this.props 
		setTimeout(() => {
			this.webView.postMessage({
				source: 'FLEX-SIMULATOR',
				data: JSON.parse(generateMessage(JSON.stringify(question), answers)),
				style: {
					backgroundColor: 'transparent',
					zoom: '70%'
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
					style: {
						...this.state.style,
						height: extractedPayload.payload,
					},
					loading: false
				})
			}
		} catch (e) {
			console.log('Got invalid postback data from child iframe')
		}
	}

	render = () => {
		const { loading } = this.state
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
					onNavigationStateChange={(evt) => {}}
					onError={(err) => {
						console.warn('Error occured', err)
					}}
					onMessage={this.onMessage}
					useWebKit={true}
					source={{ uri: `${config.APP_PROTOCAL}://flex-simulator.${config.APP_HOST}` }}
					style={{
						...this.state.style
					}}
					ref={( webView ) => this.webView = webView} 
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