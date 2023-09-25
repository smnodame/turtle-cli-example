import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

class Orders extends React.Component {
	render = () => {
		const { orders, answers, question, runMessage } = this.props
		
		return (
			<View style={styles.container}>
				<Text style={styles.header}>Order</Text>
				<View 
					style={{
						display: 'flex'
					}}>
					{
						Object.values(orders).map((order) => (
							<View style={styles.orderContainer}>
								<Text style={styles.field}>{order.name}</Text>
								<Text style={styles.value}>x{order.quantity}</Text>
								<Text style={styles.value}>{order.price*order.quantity}</Text>
							</View>
						))
					}
					<View style={styles.hr}>
					</View>
					<View style={styles.footer}>
						<Text style={styles.field}>TOTAL</Text>
						<Text style={styles.value}>{_.get(answers, `ms_00000.answer.price.value`, 0)}</Text>
					</View>
				</View>
				<TouchableOpacity style={styles.checkout}>
					<Text numberOfLines={1} style={{ color: 'white', textAlign: 'center' }} onPress={() => runMessage(question?.trigger?.checkout)}>
						{_.get(question, 'config.checkout_label', 'Check Out')}
					</Text>
				</TouchableOpacity>
			</View>
		)
	}
}


const mapStateToProps = (state) => ({
    orders: state.chat.orders,
	answers: state.chat.answers
})

const mapDispatchToProps = (dispatch) => ({
	
})

const Container = connect(mapStateToProps, mapDispatchToProps)(Orders)

export default Container

const styles = {
	container: {
		padding: 10,
		backgroundColor: 'white',
		borderColor: '#EEE',
		borderRadius: 20,
		borderWidth: 1,
		margin: 5,
		overflow: 'hidden',
		width: 220,
	},
	header: {
		fontWeight: 'bold', fontSize: 18, marginBottom: 2
	},
	orderContainer: {
		display: 'flex', flexDirection: 'row', marginTop: 5, marginBottom: 5
	},
	footer: {
		display: 'flex', flexDirection: 'row', marginTop: 5, marginBottom: 5
	},
	hr: {
		flex: 1, height: 1, borderColor: '#EEEEEE', borderWidth: 1, marginTop: 10, marginBottom: 10
	},
	value: {
		flex: 1, textAlign: 'right'
	},
	field: {
		flex: 2
	},
	checkout: {
		marginTop: 12,
		display: 'flex',
		justifyContent: 'center',
		alignContent: 'center',
		borderRadius: 5,
		height: 40,
		backgroundColor: '#17c950'
	}
}