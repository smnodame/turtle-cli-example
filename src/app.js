import * as React from 'react'

import { persistor, store } from './redux'

import Main from './layout'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

export default function HybridApp() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Main />
			</PersistGate>
		</Provider>
	)
}