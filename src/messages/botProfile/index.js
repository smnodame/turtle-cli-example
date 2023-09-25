import { Animated, Image, Text, View } from 'react-native'

import React from 'react'
import StarRating from 'react-native-star-rating'
import _ from 'lodash'
import actions from '../../redux/actions'
import { connect } from 'react-redux'
import deepCopy from '../../utils/cloneDeep'

class BotProfile extends React.Component {
	state = {
		bot: deepCopy(_.get(this.props.question, 'input.bot', {})),
		fadeAnim: new Animated.Value(0),
	}

	componentDidMount() {
		Animated.timing(
			// Animate over time
			this.state.fadeAnim, // The animated value to drive
			{
				toValue: 1, // Animate to opacity: 1 (opaque)
				duration: 1500, // Make it take a while
			}
		).start() // Starts the animation
	}

	render() {
		const { fadeAnim } = this.state

		return (
			<Animated.View
				style={{
					opacity: fadeAnim,
				}}
			>
				<View style={styles.container}>
					<Image source={{ uri: this.state.bot.avatar }} style={styles.avatar} />
					<Text style={styles.name}>{this.state.bot.name}</Text>
					<StarRating
						fullStarColor={'#FF0069'}
						starSize={24}
						disabled={true}
						maxStars={5}
						rating={this.state.bot.rating}
					/>
					<Text style={styles.role}>{this.state.bot.role}</Text>
				</View>
			</Animated.View>
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
})

const Container = connect(mapStateToProps, mapDispatchToProps)(BotProfile)

export default Container

const styles = {
	avatar: {
		borderRadius: 45,
		height: 90,
		marginBottom: 15,
		width: 90,
	},
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10,
		padding: 5,
	},
	name: {
		color: '#616161',
		fontSize: 15,
		fontWeight: '500',
		marginBottom: 10,
	},
	role: {
		color: '#989898',
		fontSize: 13,
		marginTop: 10,
	},
}
