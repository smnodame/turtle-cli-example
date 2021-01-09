import React, { useEffect, useState } from 'react'
import { persistor, store } from './redux'

import Main from './layout'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import splashscreen from 'react-native-splash-screen'

export default function HybridApp() {
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		const asyncFunc = async () => {
			try {
				await splashscreen.preventAutoHideAsync()
			} catch (e) {
				console.error('Could not prevent auto hide splash')
			}
			setIsReady(true)
		}

		asyncFunc()
	}, [setIsReady])

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				{
					isReady && <Main />
				}
			</PersistGate>
		</Provider>
	)
}