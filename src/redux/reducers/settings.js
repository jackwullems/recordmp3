import RNFetchBlob from 'rn-fetch-blob'

import {SAVE_SETTINGS} from '../../common/constant'
const initSettings = {
    bitrate: 128,
    disableSleep: true,
    storage: RNFetchBlob.fs.dirs.SDCardDir+'/recordmp3'
}

export default (state = initSettings, action) => {
    switch (action.type) {
        case SAVE_SETTINGS: {
            const settings = action.payload

            return {
                ...settings
            }
        }
            
        default:
            return state
    }
}