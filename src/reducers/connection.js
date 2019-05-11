import { CONNECTION_ENABLE, CONNECTION_DISABLE } from '../constants/actionTypes' 

const INITIAL_STATE = {
	connection: false
}

export default function connectionReducer(state = INITIAL_STATE, action) {
	switch(action.type) {
		case CONNECTION_ENABLE:
			return { connection: true}
		case CONNECTION_DISABLE:
			return { connection: false }
		default: return state
	}
}
