const axios = require('axios')
const config = require('../config.json')
const fs = require('fs')
const FormData = require('form-data')
const us = require('./updateStatus')

function uploadFile(platform, path) {
    const uploadUrl = platform === 'ios' ? process.env.SET_IOS_LINK_URL : process.env.SET_ANDROID_LINK_URL
    const url = `${process.env.INVENTORY_ENDPOINT}${uploadUrl}`

    console.info(url)
    console.log(config)

    const newFile = fs.createReadStream(path)
    const formData = new FormData()
    formData.append('file', newFile)
    formData.append('build_id', config.BUILD_ID)

    const request = {
        method: 'post',
        url: url,
        headers: {
          'Authorization': `Bearer ${config.TOKEN}`,
          'Content-Type': 'multipart/form-data'
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
    if (args.length >= 2) {
        uploadFile(args[0], args[1])
    } else {
        console.log('Status arg is not defined')
    }
} 