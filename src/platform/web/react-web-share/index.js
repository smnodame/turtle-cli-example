import {
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from 'react-share'
import { Text, View } from 'react-native'

import React from 'react'

const Share = ({ url }) => {
    return (
        <View style={{ displey: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ marginLeft: 4, marginRight: 4, fontSize: 12 }}>Share via:</Text>
            <FacebookShareButton style={{ marginLeft: 4, marginRight: 4 }} url={url}>
                <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
            <LinkedinShareButton style={{ marginLeft: 4, marginRight: 4 }} url={url}>
                <LinkedinIcon size={32} round={true} />
            </LinkedinShareButton>
            <TwitterShareButton style={{ marginLeft: 4, marginRight: 4 }} url={url}>
                <TwitterIcon size={32} round={true} />
            </TwitterShareButton>
            <WhatsappShareButton style={{ marginLeft: 4, marginRight: 4 }} url={url}>
                <WhatsappIcon size={32} round={true} />
            </WhatsappShareButton>
        </View>
    )
}

export default Share