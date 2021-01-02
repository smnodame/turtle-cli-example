import { Image, StyleSheet, Text, View } from 'react-native'

import AppIntroSlider from '../../components/appIntroSlider'
import LinearGradient from 'react-native-linear-gradient'
import Modal from 'react-native-full-modal'
import React from 'react'
import actions from '../../redux/actions'
import { connect } from 'react-redux'

class Intro extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			show: true,
		}
	}

	_renderItem = ({ item, dimensions }) => (
		<View className='app-intro-item-container' style={{ display: 'flex', flex: 1 }}>
			<LinearGradient
				style={[styles.mainContent, dimensions]}
				colors={item.colors}
				start={{ x: 0, y: 0.1 }}
				end={{ x: 0.1, y: 1 }}
			>
				<Image source={{ uri: item.image }} style={styles.image} />
				<View style={styles.detail}>
					<Text style={styles.title}>{item.title}</Text>
					<Text style={styles.text}>{item.text}</Text>
				</View>
			</LinearGradient>
		</View>
	)

	onDone = () => {
		const { onDone } = this.props
		this.setState(
			{
				show: false,
			},
			() => {
				onDone()
			}
		)
	}

	render() {
		const {
			appIntro: {
				input: { pages: slides },
			},
		} = this.props
		return (
			<Modal animationType='slide' transparent={false} visible={this.state.show}>
				<AppIntroSlider
					slides={slides}
					renderItem={this._renderItem}
					bottomButton
					onDone={this.onDone}
				/>
			</Modal>
		)
	}
}

const mapStateToProps = (state) => ({
	appIntro: state.chat.appIntro,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onDone: () => {
		dispatch(actions.onDoneIntro())
	},
})

const Container = connect(mapStateToProps, mapDispatchToProps)(Intro)

export default Container

const styles = StyleSheet.create({
	mainContent: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		width: 180,
		height: 180,
		marginTop: 22,
		marginBottom: 22,
	},
	text: {
		color: 'rgba(255, 255, 255, 0.8)',
		backgroundColor: 'transparent',
		textAlign: 'center',
		paddingHorizontal: 16,
		marginBottom: 16,
	},
	title: {
		fontSize: 22,
		color: 'white',
		backgroundColor: 'transparent',
		textAlign: 'center',
		marginBottom: 16,
	},
	detail: {
		marginBottom: 100,
	},
})
