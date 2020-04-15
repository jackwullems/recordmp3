import {SAVE_USER, RESET_USER} from '../../common/constant'

const default_user = {
    username: '',
    token: ''
}
export default (state = default_user, action) => {
    switch (action.type) {
        case SAVE_USER: {
            const {username, token} = action.payload
            return {
                username, token
            }
        }
        case RESET_USER:
            return default_user
        default:
            break
    }
    return state
}