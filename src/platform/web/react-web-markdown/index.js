import React from 'react'
import ReactMarkdown from 'react-markdown'

const Markdown = ({ source, color }) => {
    return (
        <div style={{ color }}>
            <ReactMarkdown source={source}  />
        </div>
    )
}

export default Markdown