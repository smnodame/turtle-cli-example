import CB from 'expo-checkbox'
import React from 'react'

const Checkbox = ({ onChange, value, style }) => {
    return (
        <CB
            style={style}
            onValueChange={onChange}
            value={value}
        />
    )
}

export default Checkbox