import { ActivityIndicator } from 'react-native'
import Background from './background'
import { Constants } from 'hybrid-expo'
import Content from './content'
import { MainHeader as Header } from './header'
import Intro from '../messages/intro'
import React from 'react'
import Splash from './splash'
import YellowBox from './yellowBox'
import actions from '../redux/actions'
import conf from '../conf'
import { connect } from 'react-redux'
import errorHandler from './errorHandler'

class WraperComponent extends React.Component {
	render = () => {
		const { children } = this.props
		return children
	}
}

class Main extends React.Component {
	// we will not call on start app for previwe until the the trigger is run
	componentDidMount() {
		const { onStartApp } = this.props
		onStartApp()

		if (conf.MODE === 'TEMPLATE-PREVIEW') {
			document.getElementsByTagName('body')[0].style.zoom = '70%'
		}
	}

	render() {
		const {
			addErrorMsgToYellowBox,
			app,
			askConfirmRestart,
			design,
			isExpandYellowBox,
			isLoadingRequireData,
			isRestarting,
			isShowingIntro,
			onClearState,
			onRestart,
			onStartApp,
			startAppError,
			toggleYellowBox,
			yellowBoxError,
		} = this.props

		if (startAppError) {
			return errorHandler(
				startAppError,
				onStartApp,
				isLoadingRequireData,
				onRestart,
				onClearState
			)
		}

		// splash-testing for keep this splash page for design preview
		if (
			isLoadingRequireData ||
			isLoadingRequireData === undefined ||
			design.mode === 'SPLASH-TESTING'
		) {
			return <Splash config={design.splash} />
		}

		return (
			<WraperComponent>
				<Background
					background={design.colors.background}
					option={design.colors.background.selected}
				/>
				<Header
					app={app}
					askConfirmRestart={askConfirmRestart}
					design={design}
					isRestarting={isRestarting}
				/>
				{!isShowingIntro && <Content />}
				{isShowingIntro && <Intro />}
				<ActivityIndicator size='small' color={'white'} style={styles.loading} />
				{yellowBoxError && (
					<YellowBox
						addErrorMsgToYellowBox={addErrorMsgToYellowBox}
						errorMsg={yellowBoxError}
						isExpandYellowBox={isExpandYellowBox}
						toggleYellowBox={toggleYellowBox}
					/>
				)}
			</WraperComponent>
		)
	}
}

const mapStateToProps = (state) => ({
	app: state.chat.app,
	design: state.chat.design,
	isExpandYellowBox: state.chat.isExpandYellowBox,
	isLoadingRequireData: state.chat.isLoadingRequireData,
	isRestarting: state.chat.isRestarting,
	isShowingIntro: state.chat.isShowingIntro,
	startAppError: state.chat.startAppError,
	yellowBoxError: state.chat.yellowBoxError,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	addErrorMsgToYellowBox: (errMsg) => {
		dispatch(actions.yellowBoxError(errMsg))
	},
	askConfirmRestart: () => {
		dispatch(actions.askConfirmRestart())
	},
	onClearState: () => {
		dispatch(actions.onClearState())
	},
	onRestart: () => {
		dispatch(actions.onRestart())
	},
	onStartApp: () => {
		dispatch(actions.onStartApp())
	},
	toggleYellowBox: (isExpand) => {
		dispatch(actions.toggleYellowBox(isExpand))
	},
})

const Container = connect(mapStateToProps, mapDispatchToProps)(Main)

export default Container

const styles = {
	loading: {
		position: 'absolute',
		top: 71 + Constants.statusBarHeight,
		left: 6,
	},
}
