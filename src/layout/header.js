import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'

import { Constants } from 'hybrid-expo'
import { MaterialCommunityIcons } from 'hybrid-icon'
import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'

export const MainHeader = ({ app, askConfirmRestart, design, isRestarting }) => {
	if (design.colors.header.selected === 'hide') {
		return <View></View>
	}

	const header =
		design.header.selected === 'default'
			? {
					description: app.description,
					logo: app.icon,
					name: app.name,
			  }
			: {
					description: _.get(design, 'header.custom.brandTagline'),
					logo: _.get(design, 'header.custom.logo'),
					name: _.get(design, 'header.custom.brandName'),
			  }

	const textColor = _.get(
		design,
		`colors.header['${design.colors.header.selected}'].textColor`,
		'#0B4359'
	)
	return (
		<View
			className='app-header'
			style={{
				backgroundColor: _.get(
					design,
					`colors.header['${design.colors.header.selected}'].backgroundColor`,
					'#FFF'
				),
				...mainHeaderStyles.header,
			}}
		>
			<View
				style={{
					height: Constants.statusBarHeight,
				}}
			/>
			<View style={mainHeaderStyles.body}>
				<Image
					source={{ uri: header.logo }}
					style={{
						...mainHeaderStyles.logo,
						backgroundImage: `url(${header.logo})`,
						backgroundPosition: 'center',
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
					}}
				/>
				<Text
					className='app-header-brand-name'
					style={{ ...mainHeaderStyles.brandName, color: textColor }}
					numberOfLines={1}
				>
					{header.name}
				</Text>
				<Text
					style={{ ...mainHeaderStyles.brandDescription, color: textColor }}
					numberOfLines={1}
				>
					{header.description}
				</Text>
				<View style={{ flex: 1 }}></View>
				<View>
					<TouchableOpacity
						onPress={askConfirmRestart}
						disabled={isRestarting}
						style={{ cursor: 'pointer' }}
					>
						{!isRestarting && (
							<MaterialCommunityIcons name='restart' color={textColor} size={27} />
						)}
						{isRestarting && <ActivityIndicator size='small' color={textColor} />}
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

const mainHeaderStyles = {
	brandDescription: {
		color: 'rgb(11, 67, 89)',
		fontSize: 14,
		marginRight: 12,
		maxWidth: '30%',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		transition: 'border-color .75s, color .75s',
		whiteSpace: 'nowrap',
	},
	brandName: {
		color: 'rgb(11, 67, 89)',
		fontSize: 20,
		fontWeight: '700',
		marginRight: 12,
		maxWidth: '30%',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		transition: 'border-color .75s, color .75s',
		whiteSpace: 'nowrap',
	},
	header: {
		borderBottomColor: 'rgba(255, 255, 255, 0.4)',
		borderBottomWidth: 0.5,
		justifyContent: 'center',
	},
	logo: {
		height: 36,
		marginRight: 12,
		maxHeight: 36,
		maxWidth: 36,
		width: 36,
	},
	body: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		marginLeft: 30,
		marginRight: 30,
		height: 60,
	},
}

class ContentHeader extends React.Component {
	render = () => {
		const { onBackClick, onDoneClick } = this.props
		return (
			<View style={contentHeaderStyles.header}>
				<View
					style={{
						height: Constants.statusBarHeight,
					}}
				/>
				<View style={contentHeaderStyles.body}>
					<TouchableOpacity style={contentHeaderStyles.back} onPress={onBackClick}>
						<Text style={contentHeaderStyles.buttonText}>CLOSE</Text>
					</TouchableOpacity>
					<Text style={contentHeaderStyles.title}>{''}</Text>
					{!!onDoneClick && (
						<TouchableOpacity style={contentHeaderStyles.right} onPress={onDoneClick}>
							<Text style={contentHeaderStyles.buttonText}>DONE</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
	design: state.chat.design,
	app: state.chat.app,
	isRestarting: state.chat.isRestarting,
})

const mapDispatchToProps = (dispatch, ownProps) => ({})

const Container = connect(mapStateToProps, mapDispatchToProps)(ContentHeader)

export { Container as ContentHeader }

const contentHeaderStyles = {
	back: {
		paddingLeft: 10,
		paddingRight: 10,
		textAlign: 'center',
		width: 80,
	},
	body: {
		alignItems: 'center',
		flexDirection: 'row',
		height: 60,
	},
	header: {
		backgroundColor: '#F7F7F7',
		borderBottomColor: '#E7E7E7',
		borderBottomWidth: 0.5,
		justifyContent: 'center',
	},
	right: {
		paddingLeft: 10,
		paddingRight: 10,
		textAlign: 'center',
		width: 80,
	},
	title: {
		flex: 1,
	},
	buttonText: {
		textAlign: 'center',
	},
}
