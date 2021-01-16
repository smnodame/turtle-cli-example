import { Image } from 'react-native'

function cacheImages(images) {
    return images.map(image => {
        if (typeof image === 'string') {
            return Image.prefetch(image)
        } else {
            // return Asset.fromModule(image).downloadAsync()
            return null;
        }
    })
}

export default cacheImages