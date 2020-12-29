const axios = require('axios')
const config = require('../config.json')
const fs = require('fs')
const FormData = require('form-data')
const us = require('./updateStatus')

function uploadFile(platform, path) {
    const uploadUrl = platform === 'ios' ? process.env.SET_IOS_LINK_URL : process.env.SET_ANDROID_LINK_URL

    const newFile = fs.createReadStream(path)
    const formData = new FormData()
    formData.append('file', newFile)
    formData.append('build_id', config.BUILD_ID)

    const request = {
        method: 'post',
        url: `${process.env.INVENTORY_ENDPOINT}${uploadUrl}`,
        headers: {
          'Authorization': `Bearer ${config.TOKEN}`,
          'Content-Type': 'multipart/form-data'
        },
        data: formData
    }

    return axios(request)
        .then(function (response) {
            console.log(response)
        })
        .catch(function (err) {
            us.updateStatus('FAILED', err.message)
        })
}

module.exports = {
    uploadFile
}

if (require.main === module) {
    const args = process.argv.slice(2)
    if (args.length >= 2) {
        uploadFile(args[0], args[1]).catch(() => {
            process.exitCode = 1
        })
    } else {
        console.log('Status arg is not defined')
    }
} 