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
    
    return 1
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

