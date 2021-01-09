import * as DocumentPicker from 'expo-document-picker'

import React from 'react'
import { View } from 'react-native'

export const filePicker = () => DocumentPicker.getDocumentAsync()

export const view = () => (<View />)
