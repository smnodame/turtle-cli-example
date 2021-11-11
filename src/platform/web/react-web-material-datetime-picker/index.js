import 'material-datetime-picker/dist/material-datetime-picker.css'
import './style.css'

import MaterialDateTimePicker from 'material-datetime-picker'
import React from 'react'
import { View } from 'react-native'

export default class Calendar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: true,
		}
	}

	componentDidMount = () => {
		this.picker = new MaterialDateTimePicker()
			.on('submit', (val) => {
				this.props.onConfirm(val.format())
			})
			.on('open', () => console.log('opened'))
			.on('close', () => console.log('closed'))

		this.picker.open()
	}

	render() {
		return <View></View>
	}
}
