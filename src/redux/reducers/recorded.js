import {SAVE_FILE, REMOVE_FILE} from '../../common/constant'

export default (state = [], action) => {
    switch (action.type) {
        case SAVE_FILE: {
            const recorded = action.payload
            return [...state, recorded]
        }
        case REMOVE_FILE: {
            const index = action.payload
            const recorded = state
            recorded.splice(index, 1)
            return [...recorded]
        }
        default:
            return state
    }
}