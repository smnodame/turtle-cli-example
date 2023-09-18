import BotProfile from '../../../messages/botProfile'
import ContactInfo from '../../../messages/contactInfo'
import GoodBye from '../../../messages/goodBye'
import ImageChoices from '../../../messages/imageChoices'
import ECommerce from '../../../messages/ecommerce'
import React from 'react'
import { View } from 'react-native'
import Vote from '../../../messages/vote'
import WebCard from '../../../messages/webCard'
import Orders from '../../../messages/ecommerce/orders'
import FlexSimulator from '../../../messages/flexSimulator'
import _ from 'lodash'

const CustomSystem = (props) => {
	const { currentMessage, runMessage, currentQuestion } = props
	const mode = _.get(currentMessage, 'question.mode', '').split('/')[0]

	return (
		<View>
			{mode === 'FLEX' && (
				<FlexSimulator {...props} question={currentMessage.question} runMessage={runMessage} />
			)}
			{mode === 'BOT-PROFILE' && (
				<BotProfile {...props} question={currentMessage.question} runMessage={runMessage} />
			)}
			{mode === 'ORDERS-TEMPLATE' &&
				<Orders {...props} question={currentMessage.question} runMessage={runMessage} />
			}
			{mode === 'WEB-CARD' && (
				<WebCard {...props} question={currentMessage.question} runMessage={runMessage} />
			)}
			{mode === 'CONTACT-INFO' && (
				<ContactInfo
					{...props}
					question={currentMessage.question}
					runMessage={runMessage}
				/>
			)}
			{mode === 'RATING' && (
				<Vote {...props} question={currentMessage.question} runMessage={runMessage} />
			)}
			{mode === 'GOOD-BYE' && (
				<GoodBye {...props} question={currentMessage.question} runMessage={runMessage} />
			)}
			{mode === 'PICTURE-CHOICE' &&
				currentQuestion.mode === 'PICTURE-CHOICE' &&
				currentMessage.question.id === currentQuestion.id && (
					<ImageChoices
						{...props}
						question={currentMessage.question}
						runMessage={runMessage}
					/>
				)}
			{mode === 'PRODUCT-CAROUSEL-TEMPLATE' && <ECommerce {...props} question={currentMessage.question} runMessage={runMessage} />}
			<View style={{ height: 15 }} />
		</View>
	)
}

export default CustomSystem
