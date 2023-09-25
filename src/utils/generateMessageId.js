// generate to nano unix to make it compatiable with backend from go
const generateMessageId = () => {
    return new Date().getTime()*1000000
}

export default generateMessageId
