import CB from 'react-native-check-box'
import { Image } from 'react-native'
import React from 'react'

const Checkbox = ({ onChange, value, style }) => {
    return (
        <CB
            style={style}
            onClick={onChange}
            isChecked={value}
            checkedImage={<Image source={require('./cb.png')} style={{ width: 22, height: 22 }} />}
            unCheckedImage={<Image source={require('./cb_outline.png')}  style={{ width: 22, height: 22 }} />}
        />
    )
}

export default Checkbox