import React from 'react'

export const filePicker = (props) => {
    const accept = (props || {}).accept || ''
    return new Promise((resolve) => {
        let fileInput = document.getElementById('fileInput')
        fileInput.setAttribute('accept', accept)
        fileInput.click()

        // display file name if file has been selected
        fileInput.onchange = function() {
            const output = this.files[0]
            const recordedBlob = new Blob([output], { type: output.type })
            const url = URL.createObjectURL(recordedBlob)
            if (output) {
                resolve({
                    uri: url,
                    name: output.name
                })
            }
        }

    })
}

export const view = () => (<input id='fileInput' type='file' style={{ display : 'none' }} />)
