export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (location) => {
                resolve({
                    latitude: location.coords.latitude,
					longitude: location.coords.longitude,
                })
            },
            () => {
                reject('Permission to access location was denied')
            }
        )
    })
}