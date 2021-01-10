import './style.css'

import React from 'react'
import ReactLoading from 'react-loading'

const Bubbles = ({ isBot, color, height=10, width=50 }) => {
    return (
        <div className='bubble-loading'>
            <ReactLoading type={'bubbles'} color={color} height={height} width={width} />
        </div>
    )
}

export {
    Bubbles
}
