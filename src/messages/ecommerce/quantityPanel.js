import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { connect } from 'react-redux'
import priceChar from '../../utils/priceChar'
import _ from 'lodash'
import actions from '../../redux/actions'
import { setVariables } from '../../modules/setVariables'
import { grobal_vars_id } from '../../constants'

class QuantityPanel extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            quantity: _.get(props.orders, `${props.editOrder._id}.quantity`, 0)
        }
    }

    updateOrders = () => {
        const { editOrder, orders, updateOrders, updateEditOrder, answers, variables, storeAnswers, runMessage } = this.props

		const newOrders = {
            ...orders,
            [editOrder._id]: {
				name: editOrder.name,
                quantity: this.state.quantity,
                price: editOrder.price
            }
        }
		
        const totalPrice = Object.values(newOrders).reduce((o, order) => {
            return o + (order.price * order.quantity)
        }, 0)

        const answer = {
			[grobal_vars_id]: {
                answer: {
					price: {
						value: totalPrice
					},
					orders: {
						value: newOrders,
					}
				},
				mode: 'GROBAL'
			},
		}
		
		setVariables(grobal_vars_id, variables, answer)
        updateOrders(newOrders)

		// store answers in store
		storeAnswers(
			{
				...answers,
				...answer,
			},
			answer
		)

		runMessage(editOrder?.currentMessage?.question?.trigger?.select)
        // clear panel
        updateEditOrder(undefined)
    }

    onIncrease = () => {
        this.setState({
            quantity: this.state.quantity + 1
        })
    }

    onDecrease = () => {
        if (this.state.quantity === 0) return

        this.setState({
            quantity: this.state.quantity - 1
        })
    }

	render = () => {
		const { editOrder } = this.props
		return (
			<View>
				<View style={styles.header}>
					<Text numberOfLines={1} style={styles.name}>
						{editOrder.name}	
					</Text>
					<Text style={styles.price}>
						{priceChar[editOrder.unit_price]}{editOrder.price*this.state.quantity}
					</Text>
				</View>
				<View style={styles.quantityContainer}>
					<TouchableOpacity
						style={styles.decrease}
                        onPress={this.onDecrease}
					>
						<Text style={styles.decreaseText}>-</Text>
					</TouchableOpacity>
					<View style={styles.quantityTextContainer}>
                        <Text style={styles.quantityText}>{this.state.quantity}</Text>
					</View>
					<TouchableOpacity
						style={styles.increase}
                        onPress={this.onIncrease}
					>
						<Text style={styles.increaseText}>+</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity style={styles.footer} onPress={this.updateOrders}>
					<Text numberOfLines={1} style={styles.footerText}>
						Update Item
					</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = {
	header: {
		height: 60,
		backgroundColor: '#FEFEFE',
		borderColor: '#EEE',
		borderBottomWidth: 1,
		flexDirection: 'row',
		display: 'flex',
		alignItems: 'center'
	},
	name:{
		flex: 1, fontWeight: 'bold', marginLeft: 22, color: '#444444', fontSize: 20
	},
	price: {
		fontWeight: 'bold', marginRight: 22, color: '#444444', fontSize: 20
	},
	footer: { 
		alignItems: 'center',
		backgroundColor: '#F8F8F8',
		borderColor: '#EEE',
		borderTopWidth: 1,
		borderWidth: 0.5,
		height: 60,
		justifyContent: 'center',
	},
	footerText: {
		color: '#4B4B4B',
		fontSize: 14,
	},
	increase: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 80,
	},
	decrease: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 80,
	},
	quantityContainer: {
		backgroundColor: '#FEFEFE',
		borderColor: '#EEE',
		borderTopWidth: 1,
		flexDirection: 'row',
		height: 60,
	},
	decreaseText: {
		color: '#9195F7',
		fontSize: 22,
		fontWeight: 'bold',
	},
	increaseText: {
		color: '#9195F7',
		fontSize: 22,
		fontWeight: 'bold',
	},
	quantityText: {
		color: '#7B7B7B',
		fontSize: 28,
		fontWeight: 'bold',
		textAlign: 'right',
	},
	quantityTextContainer: { 
		alignItems: 'center',
		display: 'flex',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center'
	}
}

const mapStateToProps = (state) => ({
	editOrder: state.chat.editOrder,
    orders: state.chat.orders,
    answers: state.chat.answers,
    currentAnswer: state.chat.currentAnswer,
	variables: state.chat.variables,
	currentQuestion: state.chat.currentQuestion
})

const mapDispatchToProps = (dispatch) => ({
    updateOrders: (orders) => {
        dispatch(actions.orders(orders))
    },
    updateEditOrder: (product) => {
        dispatch(actions.editOrder(product))
    },
    storeAnswers: (answers, answer) => {
		dispatch(actions.answers(answers, answer))
	},
	storeCurrentAnswer: (id, answer) => {
		dispatch(actions.currentAnswer(id, answer))
	},
	runMessage: (id) => {
		dispatch(actions.runMessage(id))
	}
})

const Container = connect(mapStateToProps, mapDispatchToProps)(QuantityPanel)

export default Container