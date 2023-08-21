import { FlatList, View } from 'react-native'
import * as apis from '../../redux/apis'
import React from 'react'
import Card from './card'
import actions from '../../redux/actions'
import { connect } from 'react-redux'

class Ecommerce extends React.Component {
	state = {
		products: [],
		config: {}
	}

	componentDidMount = () => {
		const { question } = this.props
		return Promise.all([apis.requestProducts(question.config.products), apis.eCommerceConfig()]).then(([products, config]) => {
			this.setState({
				products,
				config
			})
		})
	}

	render = () => {
		const { question, selectProduct, currentMessage } = this.props
		const { products, config } = this.state
		return (
			<View style={styles.container}>
				<FlatList
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					data={products}
					renderItem={({ item, index }) => {
						return (
							<View style={{ flexDirection: 'row' }}>
								<Card 
									{...item} 
									index={index} 
									config={{
										...question.config,
										...config,
									}}
									product={item}
									selectProduct={selectProduct}
									currentMessage={currentMessage}
								/>
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


const mapStateToProps = (state) => ({
	currentQuestion: state.chat.currentQuestion
})

const mapDispatchToProps = (dispatch) => ({
	addToCart: (id) => {
		dispatch(actions.addToCart(id))
	},
	removeFromCart: (id) => {
		dispatch(actions.removeFromCart(id))
	},
	selectProduct: (product) => {
		dispatch(actions.editOrder(product))
	}
})

const Container = connect(mapStateToProps, mapDispatchToProps)(Ecommerce)

export default Container

const styles = {
	container: {
		flexDirection: 'row',
		flex: 1,
	},
}