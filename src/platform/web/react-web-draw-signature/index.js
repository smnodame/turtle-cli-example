import './style.css'

import React from 'react'
import SignatureCanvas from 'react-signature-canvas'

const DrawPad = ({ getRef }) => {
    return (
        <div>
            <SignatureCanvas penColor='black' backgroundColor='white' canvasProps={{ className: 'sigCanvas'}} ref={getRef} />
        </div>
    )
}

export default DrawPad