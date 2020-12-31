const axios = require('axios')
const config = require('../config.json')
const util = require('util')
const fs = require('fs')
const os = require('os')

const readFileAsync = util.promisify(fs.readFile)

function updateStatus(status, reason, path='') {
    if (path) {
        const stdout = readFileAsync(path, 'utf8')
        // workaround to check the error from turtle build
        if (stdout.includes('Failed to build standalone app')) {
            reason = stdout.split('\n')[1].trim().split(':').splice(1).join('')
        }
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

