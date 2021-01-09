import React from 'react'
import SVGInline from 'react-svg-inline'

const SvgUri = (props) => {
    const { width, height, svgXmlData } = props
    const style = props.style || {}

    return (
        <div style={style}>
            <SVGInline svg={svgXmlData} width={width} height={height} />
        </div>
    )
}

export default SvgUri