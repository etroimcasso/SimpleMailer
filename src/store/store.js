import { createStore } from 'redux';
import connectionReducer from '../reducers/connection'

const store = createStore(
	connectionReducer
)

export default store
