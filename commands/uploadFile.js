const axios = require('axios')
const config = require('../config.json')
const fs = require('fs')
const FormData = require('form-data')
const us = require('./updateStatus')

function uploadFile(platform, path) {
    const uploadUrl = platform === 'ios' ? process.env.SET_IOS_LINK_URL : process.env.SET_ANDROID_LINK_URL
    const url = `${process.env.INVENTORY_ENDPOINT}${uploadUrl}`

    const newFile = fs.createReadStream(path)
    const formData = new FormData()
    formData.append('file', newFile)
    formData.append('build_id', config.BUILD_ID)

    const request = {
        method: 'post',
        url: url,
        headers: {
          'Authorization': `Bearer ${config.TOKEN}`,
          ...formData.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        data: formData
    }

    return axios(request)
        .catch(function (err) {
            us.updateStatus('FAILED', err.message)
            process.exitCode = 1
        })
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