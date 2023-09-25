// Redux
import { applyMiddleware, createStore } from 'redux'
// Redux persist
import { persistReducer, persistStore } from 'redux-persist'
// import { LogBox } from 'react-native'

// Reducers
import { chat as chatReducer } from './reducers'
import { combineReducers } from 'redux'
// Redux devtools extension
import { composeWithDevTools } from 'redux-devtools-extension'
import { encryptTransform } from 'redux-persist-transform-encrypt'
// Redux Saga
import createSagaMiddleware from 'redux-saga'
// Saga
import rootSaga from './sagas'
import storage from 'react-native-storage'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

// const encryptor = encryptTransform({
// 	secretKey: 'secret',
// 	onError: function (error) {
// 		// Handle the error.
// 	},
// })

// Storage persist config
const persistConfig = {
	key: 'root',
	storage,
	blacklist: ['chat'],
}

const chatPersistConfig = {
	key: 'secret',
	storage: storage,
	blacklist: ['pusherManager', 'isRetryingErrorMessage', 'startAppError', 'isLoadingRequireData'],
	transforms: [],
}

const rootReducer = combineReducers({
	chat: persistReducer(chatPersistConfig, chatReducer),
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

// mount it on the Store
export const store = createStore(
	persistedReducer,
	composeWithDevTools(applyMiddleware(sagaMiddleware))
)

export const persistor = persistStore(store)
sagaMiddleware.run(rootSaga)

function handleChange() {
	const currentValue = store.getState()
	window.store = currentValue
}

handleChange()

// // LogBox.ignoreAllLogs(true)

