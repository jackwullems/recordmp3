import React, {useState, useEffect} from 'react'
import {SafeAreaView, View, Text, StyleSheet, Platform} from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import Entypo from 'react-native-vector-icons/Entypo'
import SwitchSelector from 'react-native-switch-selector'
import {useDispatch, useSelector} from 'react-redux'
import RNFetchBlob from 'rn-fetch-blob'

import styles from '../common/styles'
import colors from '../common/colors'
import {saveSettings} from '../redux/action'

export default Recordmp3 = () => {
    const handleBitrate = bitrate => {
        dispatch(saveSettings({...settings, bitrate}))
    }
    const settings = useSelector(state=>state.settings)
    console.log('settings:', settings)
    const dispatch = useDispatch()
    const handleSleep = disableSleep => {
        dispatch(saveSettings({...settings, disableSleep}))
    }
    const handleStorage = storage => {
        dispatch(saveSettings({...settings, storage}))
    }
    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.row}>
                <Text style={{flex: 1, fontWeight: 'bold'}}>Storage</Text>
                <RNPickerSelect
                    // placeholder={{}}
                    value={settings.storage}
                    style={{inputAndroid: styles.pickerBlackStyles, inputIOS: styles.pickerBlackStyles, iconContainer: {top: 15, right: 15}}}
                    onValueChange={handleStorage}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => {
                        return <Entypo color={colors.primary} size={15} name='chevron-down'/>;
                    }}
                    items={[
                        Platform.OS == 'android' && {label: RNFetchBlob.fs.dirs.SDCardDir+'/recordmp3', value: RNFetchBlob.fs.dirs.SDCardDir+'/recordmp3'},
                        {label: RNFetchBlob.fs.dirs.DocumentDir, value: RNFetchBlob.fs.dirs.DocumentDir},
                        Platform.OS == 'android' && {label: RNFetchBlob.fs.dirs.DownloadDir, value: RNFetchBlob.fs.dirs.DownloadDir},
                    ]}
                />

            </View>
            <View style={styles.row}>
                <Text style={{flex: 1, fontWeight: 'bold'}}>MP3 bitrate</Text>
                <RNPickerSelect
                    // placeholder={{}}
                    value={settings.bitrate}
                    style={{inputAndroid: styles.pickerBlackStyles, inputIOS: styles.pickerBlackStyles, iconContainer: {top: 15, right: 15}}}
                    onValueChange={handleBitrate}
                    useNativeAndroidPickerStyle={false}
                    Icon={() => {
                        return <Entypo color={colors.primary} size={15} name='chevron-down'/>;
                    }}
                    items={[
                        {label: '128kbps', value: 128},
                        {label: '256kbps', value: 256},
                    ]}
                />
            </View>
            <View style={styles.row}>
                <Text style={{flex: 1, fontWeight: 'bold'}}>Disable screen save/sleep</Text>
                <SwitchSelector
                    style={{ width: 70 }}
                    initial={settings.disableSleep?1:0}
                    height={30}
                    buttonColor={'gainsboro'}
                    valuePadding={2}
                    hasPadding={true}
                    options={[
                        { label: '', value: false, },
                        { label: '', value: true, activeColor: colors.primary},
                    ]}
                    onPress={handleSleep} />

            </View>
        </SafeAreaView>
    )
}
