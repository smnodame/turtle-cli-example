import { setVariables } from '../../modules/setVariables'
import { grobal_vars_id } from '../../constants'


const ClearCart = ({ answers, storeAnswers, variables, updateOrders }) => {
	return new Promise((resolve) => {
        const newOrders = {}
		
		const answer = {
			[grobal_vars_id]: {
                answer: {
					price: {
						value: 0
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
		
        resolve('success')
	})
}

export default ClearCart
