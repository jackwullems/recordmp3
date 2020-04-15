import React from 'react'
import {View, Text} from 'react-native'

import colors from '../common/colors'

export default Splash = () => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{textAlign: 'center', fontSize: 30, color: colors.primary}}>Loading...</Text>
        </View>
    )
}