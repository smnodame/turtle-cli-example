const axios = require('axios')
const config = require('../config.json')

module.exports = function updateStatus(status) {
    return axios.post(process.env.SET_BUILD_STATUS_URL, {
        build_id: config.BUILD_ID,
        status: status
    }, {
        headers: {
          'Authorization': `Bearer ${config.TOKEN}` 
        }
    })
    .then(function (response) {
        console.log(response)
    })
    .catch(function (error) {
        console.log(error)
    })
}

if (require.main === module) {
    const args = process.argv.slice(2)
    if (args.length > 0) {
        updateStatus(args[0])
    } else {
        console.log('Status arg is not defined')
    }
} 

