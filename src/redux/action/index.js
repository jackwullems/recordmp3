import {SAVE_SETTINGS, SAVE_FILE, REMOVE_FILE, SAVE_USER} from '../../common/constant'

export const saveSettings = settings => {
    return {
        type: SAVE_SETTINGS,
        payload: settings
    }
}

export const saveFile = recorded => {
    return {
        type: SAVE_FILE,
        payload: recorded
    }
}

export const removeFile = index => {
    return {
        type: REMOVE_FILE,
        payload: index
    }
}

export const saveUser = (username, token) => {
    return {
        type: SAVE_USER,
        payload: {username, token}
    }
}