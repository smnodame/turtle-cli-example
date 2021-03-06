const axios = require('axios')
const config = require('../config.json')
const util = require('util')
const fs = require('fs')
const os = require('os')

const readFileAsync = util.promisify(fs.readFile)

async function updateStatus(status, reason, path='') {
    if (path) {
        reason = await readFileAsync(path, 'utf8')
    }
    
    return axios.post(`${process.env.INVENTORY_ENDPOINT}${process.env.SET_BUILD_STATUS_URL}`, {
        build_id: config.BUILD_ID,
        status: status,
        reason: reason
    }, {
        headers: {
          'Authorization': `Bearer ${config.TOKEN}` 
        }
    })
    .catch(function (error) {
        process.exitCode = 1
        console.log(error)
    })
}

module.exports = {
    updateStatus
}

if (require.main === module) {
    const args = process.argv.slice(2)
    if (args.length > 0) {
        updateStatus(...args)
    } else {
        console.log('Status arg is not defined')
    }
} 

