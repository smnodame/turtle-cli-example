const axios = require('axios')
const config = require('../config.json')
const fs = require('fs')
const FormData = require('form-data')
const us = require('./updateStatus')

function uploadFile(platform, path) {
    
}

module.exports = {
    uploadFile
}

if (require.main === module) {
    const args = process.argv.slice(2)
    console.log(args)
    if (args.length >= 2) {
        uploadFile(...args)
    } else {
        console.log('Status arg is not defined')
    }
} 