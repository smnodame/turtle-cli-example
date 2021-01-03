import { Share, Text, TouchableOpacity, View } from 'react-native'
import { facebook, linkin, twitter, whatsapp } from '../../../images'

import React from 'react'
import SvgImage from 'react-native-svg-image'

const ShareComponent = ({ url }) => {
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: url
            })
    
          if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
          } else if (result.action === Share.dismissedAction) {
                
          }
        } catch (error) {
            
        }
    }

    return (
        <TouchableOpacity 
            style={{ displey: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
            onPress={onShare}
        >
            <Text style={{ marginLeft: 4, marginRight: 4, fontSize: 12 }}>Share via:</Text>
            <View style={{ marginLeft: 4, marginRight: 4 }}>
                <SvgImage
                    width='30'
                    height='30'
                    svgXmlData={facebook}
                />
            </View>
            <View style={{ marginLeft: 4, marginRight: 4 }}>
                <SvgImage
                    width='30'
                    height='30'
                    svgXmlData={linkin}
                />
            </View>
            <View style={{ marginLeft: 4, marginRight: 4 }}>
                <SvgImage
                    width='30'
                    height='30'
                    svgXmlData={twitter}
                />
            </View>
            <View style={{ marginLeft: 4, marginRight: 4 }}>
                <SvgImage
                    width='30'
                    height='30'
                    svgXmlData={whatsapp}
                />
            </View>
        </TouchableOpacity>
    )
}

export default ShareComponent