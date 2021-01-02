import * as apis from '../../redux/apis'

import {
	ActivityIndicator,
	FlatList,
	TextInput as Input,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'

import { ContentHeader } from '../../layout/header'
import { FontAwesome } from 'hybrid-icon'
import Modal from 'react-native-full-modal'
import React from 'react'
import _ from 'lodash'
import generateMessage from '../../utils/generateMessage'

class ItemList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			items: [],
			results: [],
			isShowingPopup: true,
		}
	}

	componentDidMount = () => {
		const { question } = this.props
		this.fetchItems(question).then((results) => {
			this.setState({
				items: results,
				results: results,
			})
		})

		this.onSearchChange('')
	}

	fetchItems = (question) => {
		try {
			if (question.db.type === 'custom') {
				return new Promise((resolve) => resolve(question.input.items))
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
								name: _.get(item, '0'),
								number: _.get(item, '1'),
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

	getNumberWithOperation = (number) => {
		return number >= 0 ? `+${number}` : number
	}

	onSearchChange = (text) => {
		clearTimeout(this.timer)
		this.setState(
			{
				loading: true,
				text,
			},
			() => {
				this.timer = setTimeout(() => {
					this.filterItems(text)
				}, 100)
			}
		)
	}

	onSelect = (name, number, trigger) => {
		const { question, answers, storeAnswers, onSend } = this.props

		const answer = {
			[question.id]: {
				answer: {
					number: {
						value: number,
					},
					name: {
						value: name,
					},
					created_at: {
						value: new Date(),
					},
				},
				mode: question.mode,
			},
		}

		// store answers in store
		storeAnswers(
			{
				...answers,
				...answer,
			},
			answer
		)

		// generate answer and replace expression
		const message = generateMessage(question.answer || name, answers, answer)

		onSend(
			{
				text: message,
			},
			_.get(question, 'trigger.right')
		)
	}

	filterItems = (text) => {
		clearTimeout(this.timeout)
		const { items } = this.state
		const filter = items.filter((item) => {
			return item.name.toLowerCase().indexOf(text.toLowerCase()) > -1
		})

		this.setState({
			results: filter,
			loading: false,
		})
	}

	hideModel = () => {
		this.setState({
			isShowingPopup: false,
		})
	}

	showModal = () => {
		this.setState({
			isShowingPopup: true,
		})
	}

	render = () => {
		const { question } = this.props
		const { isShowingPopup, text: query } = this.state

		const placeholder = _.get(question, 'input.placeholder', 'SEARCH')
		const freeMessage = _.get(question, 'input.free_message', '')
		const noItemFound = _.get(question, 'input.no_item_found', 'No item found')

		if (!isShowingPopup) {
			return (
				<TouchableOpacity onPress={this.showModal} style={styles.button}>
					<Text numberOfLines={1} style={styles.text}>
						Continue
					</Text>
				</TouchableOpacity>
			)
		}

		return (
			<Modal animationType='slide' transparent={false} visible={isShowingPopup}>
				<View style={styles.container}>
					<ContentHeader onBackClick={this.hideModel} />
					<View style={styles.item}>
						<FontAwesome active name='search' size={20} style={{ color: '#999' }} />
						<Input
							style={styles.textinput}
							placeholderTextColor={'#999'}
							placeholder={placeholder || 'Search'}
							onChangeText={this.onSearchChange}
							underlineColorAndroid='transparent'
							value={query}
						/>
						{this.state.loading && (
							<ActivityIndicator size='small' style={styles.loading} />
						)}
					</View>
					{this.state.results.length > 0 && (
						<FlatList
							horizontal={false}
							data={this.state.results}
							renderItem={({ item, index }) => {
								const number =
									item.number === 0
										? freeMessage
										: this.getNumberWithOperation(item.number)
								return (
									<TouchableOpacity
										style={styles.item}
										onPress={() =>
											this.onSelect(item.name, item.number, item.trigger)
										}
									>
										<Text>{item.name}</Text>
										<View style={styles.flex}></View>
										<Text style={styles.number}>{number}</Text>
									</TouchableOpacity>
								)
							}}
							onEndReachedThreshold={1}
							onEndReached={({ distanceFromEnd }) => {}}
						/>
					)}
					{this.state.results.length === 0 && (
						<View style={{ padding: 25 }}>
							<Text style={{ color: '#999', textAlign: 'center' }}>
								{noItemFound}
							</Text>
						</View>
					)}
				</View>
			</Modal>
		)
	}
}

export default ItemList

const styles = {
	button: {
		alignItems: 'center',
		backgroundColor: '#F8F8F8',
		borderColor: '#EEE',
		borderTopWidth: 1,
		borderWidth: 0.5,
		height: 60,
		justifyContent: 'center',
	},
	container: {
		backgroundColor: 'white',
		flex: 1,
		height: '100%',
	},
	flex: {
		flex: 1,
	},
	item: {
		alignItems: 'center',
		borderBottomColor: '#f2f2f2',
		borderBottomWidth: 0.5,
		display: 'flex',
		flexDirection: 'row',
		height: 60,
		marginLeft: 5,
		padding: 10,
		paddingTop: 8,
	},
	loading: {
		marginRight: 15,
	},
	price: {
		color: '#999',
	},
	text: {
		color: '#4B4B4B',
		fontSize: 14,
	},
	textinput: {
		backgroundColor: 'white',
		borderRadius: 5,
		flex: 1,
		fontSize: 15,
		height: 40,
		marginBottom: 5,
		marginLeft: 4,
		marginRight: 5,
		marginTop: 6,
		outline: 'none',
		paddingHorizontal: 20,
		paddingLeft: 10,
		paddingRight: 10,
	},
}
