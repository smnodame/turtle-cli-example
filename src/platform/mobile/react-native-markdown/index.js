import Markdown from 'react-native-markdown-renderer'
import React from 'react'

var styles = (color) => {
    return {
        // The main container
        body: {},
        // Headings
        heading1: {
            flexDirection: 'row',
            fontSize: 32,
            color
        },
        heading2: {
            flexDirection: 'row',
            fontSize: 24,
            color
        },
        heading3: {
            flexDirection: 'row',
            fontSize: 18,
            color
        },
        heading4: {
            flexDirection: 'row',
            fontSize: 16,
            color
        },
        heading5: {
            flexDirection: 'row',
            fontSize: 13,
            color
        },
        heading6: {
            flexDirection: 'row',
            fontSize: 11,
            color
        },
      
        // Horizontal Rule
        hr: {
            backgroundColor: '#000000',
            height: 1,
        },
      
        // Emphasis
        strong: {
            fontWeight: 'bold',
            color
        },
        em: {
            fontStyle: 'italic',
            color
        },
        s: {
            textDecorationLine: 'line-through',
            color
        },
      
        // Blockquotes
        blockquote: {
            paddingHorizontal: 14,
            paddingVertical: 4,
            backgroundColor: '#CCCCCC',
        },
      
        // Lists
        bullet_list: {},
        ordered_list: {},
        list_item: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
        },
        // @pseudo class, does not have a unique render rule
        bullet_list_icon: {
            marginLeft: 10,
            marginRight: 10,
            ...Platform.select({
                android: {
                    marginTop: 5,
                },
                ios: {
                    marginTop: 0,
                },
                default: {
                    marginTop: 0,
                },
            }),
            ...Platform.select({
                ios: {
                    lineHeight: 36,
                },
                android: {
                    lineHeight: 30,
                },
                default: {
                    lineHeight: 36,
                },
            }),
        },
        // @pseudo class, does not have a unique render rule
        bullet_list_content: {
            flex: 1,
            flexWrap: 'wrap',
        },
        // @pseudo class, does not have a unique render rule
        ordered_list_icon: {
            marginLeft: 10,
            marginRight: 10,
            ...Platform.select({
                android: {
                    marginTop: 4,
                },
                default: {
                    marginTop: 0,
                },
            }),
            ...Platform.select({
                ios: {
                    lineHeight: 36,
                },
                android: {
                    lineHeight: 30,
                },
                default: {
                    lineHeight: 36,
                },
            }),
        },
        // @pseudo class, does not have a unique render rule
        ordered_list_content: {
            flex: 1,
            flexWrap: 'wrap',
        },
      
        // Code
        code_inline: {
            borderWidth: 1,
            borderColor: '#CCCCCC',
            backgroundColor: '#f5f5f5',
            padding: 10,
            borderRadius: 4,
            color
        },
        code_block: {
            borderWidth: 1,
            borderColor: '#CCCCCC',
            backgroundColor: '#f5f5f5',
            padding: 10,
            borderRadius: 4,
        },
        fence: {
            borderWidth: 1,
            borderColor: '#CCCCCC',
            backgroundColor: '#f5f5f5',
            padding: 10,
            borderRadius: 4,
        },
      
        // Tables
        table: {
            borderWidth: 1,
            borderColor: '#000000',
            borderRadius: 3,
            color
        },
        thead: {},
        tbody: {},
        th: {
            flex: 1,
            padding: 5,
        },
        tr: {
            borderBottomWidth: 1,
            borderColor: '#000000',
            flexDirection: 'row',
        },
        td: {
            flex: 1,
            padding: 5,
        },
      
        // Links
        link: {
            textDecorationLine: 'underline',
        },
        blocklink: {
            flex: 1,
            borderColor: '#000000',
            borderBottomWidth: 1,
        },
      
        // Images
        image: {
            flex: 1,
        },
      
        // Text Output
        text: {
            color,
            fontSize: 16
        },
        textgroup: {
            color
        },
        paragraph: {
            marginTop: 2,
            marginBottom: 2,
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '100%',
            color
        },
        hardbreak: {
            width: '100%',
            height: 1,
        },
        softbreak: {},
      
        // Believe these are never used but retained for completeness
        pre: {},
        inline: {},
        span: {},
    }
}

const MD = ({ source, color }) => {
    return (
        <Markdown style={styles(color)}>{source}</Markdown>
    )
}

export default MD