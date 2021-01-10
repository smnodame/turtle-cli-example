import * as apis from '../../redux/apis'

import { FlatList, View } from 'react-native'

import React from 'react'
import WebCard from './card'
import _ from 'lodash'

class WebCardList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			items: [],
		}
	}

	componentDidMount = () => {
		const { question } = this.props
		this.fetchItems(question).then((items) => {
			try {
				this.setState({
					items: items,
				})
			} catch (e) {
				this.setState({
					items: [],
				})
			}
		})
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
								title: _.get(item, '0'),
								description: _.get(item, '1'),
								date: _.get(item, '2'),
								image: _.get(item, '3'),
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

	render = () => {
		const { items } = this.state
		return (
			<View style={styles.container}>
				<FlatList
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					data={items}
					renderItem={({ item, index }) => {
						return (
							<View style={{ flexDirection: 'row' }}>
								<WebCard {...item} index={index} />
							</View>
						)
					}}
					onEndReachedThreshold={1}
					onEndReached={({ distanceFromEnd }) => {}}
				/>
			</View>
		)
	}
}

export default WebCardList

const styles = {
	container: {
		flexDirection: 'row',
		flex: 1,
	},
}
