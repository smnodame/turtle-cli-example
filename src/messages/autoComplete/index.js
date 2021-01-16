import * as apis from '../../redux/apis'

import {
	ActivityIndicator,
	TextInput as Input,
	KeyboardAvoidingView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	Animated
} from 'react-native'
import { Entypo, Ionicons } from 'hybrid-icon'

import React from 'react'
import _ from 'lodash'
import generateMessage from '../../utils/generateMessage'
import { setVariables } from '../../modules/setVariables'
import { animeInterval, footerMinHeight } from '../../constants'

export default class AutoComplete extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			filter: '',
			results: [],
			selected: null,
			items: [],
			fadeAnim: new Animated.Value(0),
		}
	}

	componentDidMount = () => {
		const { question } = this.props
		this.fetchItems(question).then((items) => {
			this.setState({
				items,
			}, this.inAnime)
		})
	}

	inAnime = () => {
		Animated.timing(
			this.state.fadeAnim,
			{
				toValue: footerMinHeight,
				duration: animeInterval,
			}
		).start()

		setTimeout(() => {
			this.setState({
				fadeAnim: null
			})
		}, animeInterval)
	}

	outAnime = () => {
		this.setState({
			fadeAnim: new Animated.Value(this.height),
		}, () => {
			Animated.timing(
				this.state.fadeAnim,
				{
					toValue: 0,
					duration: animeInterval,
				}
			).start()
		})
	}

	fetchItems = (question) => {
		try {
			if (question.db.type === 'custom') {
				return new Promise((resolve) => resolve(question.input.options))
			} else if (question.db.type === 'google-spreadsheet') {
				if (question.db.is_specific_sheet && !question.db.sheet) {
					return new Promise((resolve) => resolve([]))
				}

				return apis
					.fetchSpreadsheetData(
						question.db.spreadsheet,
						question.db.is_specific_sheet ? question.db.sheet : null
					)
					.then((data) => {
						return (data || []).map((item, index) => {
							return {
								label: _.get(item, '0'),
								value: _.get(item, '1'),
								id: index,
							}
						})
					})
			}

			return new Promise((resolve) => resolve([]))
		} catch (e) {
			return new Promise((resolve) => resolve([]))
		}
	}

	filterItems = () => {
		const { filter, items } = this.state
		try {
			const results = items.filter((option) => {
				return option.label.toLowerCase().search(filter.toLowerCase()) >= 0
			})

			this.setState({
				results: results,
				loading: false,
			})
		} catch (e) {
			this.setState({
				results: [],
				loading: false,
			})
		}
	}

	onSend = () => {
		const { question, answers, storeAnswers, onSend, variables } = this.props

		const { label, value } = this.state.selected
		const answer = {
			[question.id]: {
				answer: {
					value: {
						value: value,
					},
					label: {
						value: label,
					},
					created_at: {
						value: new Date(),
					},
				},
				mode: question.mode,
			},
		}

		setVariables(question.id, variables, answer)

		// store answers in store
		storeAnswers(
			{
				...answers,
				...answer,
			},
			answer
		)

		// generate answer and replace expression
		const message = generateMessage(question.answer || label, answers, answer)

		onSend(
			{
				text: message,
			},
			_.get(question, 'trigger.right')
		)

		this.outAnime()
	}

	render() {
		const { question } = this.props
		const input = _.get(question, 'input.textinput', {})

		return (
			<KeyboardAvoidingView>
				<Animated.View
					style={{
						height: this.state.fadeAnim,
					}}

					onLayout={(event) => {
						const { height } = event.nativeEvent.layout;
						this.height = height
					}}
				>
					{!this.state.selected && (
						<ScrollView style={styles.scrollview} keyboardShouldPersistTaps={'handled'}>
							{this.state.results.map((option) => (
								<TouchableOpacity
									full
									light
									onPress={() => {
										this.setState({
											selected: option,
										})
									}}
									style={styles.button}
								>
									<Text numberOfLines={1} style={{ color: '#4B4B4B', fontSize: 14 }}>
										{option.label.toString().toUpperCase()}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					)}
					{this.state.selected && (
						<View style={styles.selected.container}>
							<TouchableOpacity
								onPress={() => {
									this.setState({
										selected: null,
									})
								}}
								style={styles.selected.button}
							>
								<Entypo
									name='cross'
									style={{ color: '#FFFFFF', padding: 5 }}
									size={22}
								/>
							</TouchableOpacity>
							<Text numberOfLines={1} style={styles.selected.text}>
								{this.state.selected.label}
							</Text>
						</View>
					)}
					<View style={styles.footer}>
						<Input
							style={styles.textInput}
							blurOnSubmit={false}
							value={this.state.text}
							onChangeText={(text) => {
								clearTimeout(this.timeout)
								if (!text) {
									this.setState({
										loading: false,
										filter: '',
										results: [],
									})
									return
								}

								this.setState(
									{
										loading: true,
										filter: text,
										results: [],
									},
									() => {
										this.timeout = setTimeout(() => {
											this.filterItems(this.state.filter)
										}, 500)
									}
								)
							}}
							underlineColorAndroid='transparent'
							placeholderTextColor={'#999'}
							placeholder={'ADD A MESSAGE ...'}
							{...input}
						/>
						{this.state.loading && <ActivityIndicator size='small' />}
						{this.state.selected && (
							<TouchableOpacity
								disabled={!this.state.selected}
								onPress={this.onSend}
								style={styles.send}
							>
								<Ionicons name='md-send' style={{ fontSize: 30, color: '#FF006F' }} />
							</TouchableOpacity>
						)}
					</View>
				</Animated.View>
			</KeyboardAvoidingView>
		)
	}
}

const styles = {
	button: {
		backgroundColor: '#F8F8F8',
		borderColor: '#EEE',
		borderTopWidth: 1,
		borderWidth: 0.5,
		height: 60,
		justifyContent: 'center',
		paddingLeft: 20,
	},
	footer: {
		backgroundColor: '#f2f2f2',
		display: 'flex',
		flexDirection: 'row',
		height: 60,
		padding: 10,
		paddingTop: 8,
	},
	scrollview: {
		maxHeight: 180,
	},
	selected: {
		button: {
			alignItems: 'center',
			justifyContent: 'center',
			paddingLeft: 10,
			paddingRight: 10,
		},
		container: {
			alignItems: 'center',
			backgroundColor: '#D9D9D9',
			flexDirection: 'row',
			height: 45,
		},
		text: {
			color: '#7C7C7C',
		},
	},
	send: {
		alignItems: 'center',
		height: 40,
		justifyContent: 'center',
		marginTop: 2,
		width: 40,
	},
	textInput: {
		backgroundColor: 'white',
		borderColor: '#CCC',
		borderRadius: 5,
		borderWidth: 0.5,
		flex: 1,
		height: 45,
		marginBottom: 5,
		marginRight: 5,
		paddingHorizontal: 20,
		paddingLeft: 10,
		paddingRight: 10,
	},
}
