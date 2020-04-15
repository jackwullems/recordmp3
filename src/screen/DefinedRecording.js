import React, {useState, useEffect, useRef, useContext} from 'react'
import {SafeAreaView,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    TextInput,
    PermissionsAndroid,
    ImageBackground
} from 'react-native'
import { Col, Row, Grid } from "react-native-easy-grid"
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient'
import RNPickerSelect from 'react-native-picker-select'
import Entypo from 'react-native-vector-icons/Entypo'
import SoundRecorder from 'react-native-sound-recorder'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {useSelector, useDispatch} from 'react-redux'
import Spinner from "react-native-loading-spinner-overlay"
import {NavigationContext} from 'react-navigation'
import {AudioRecorder, AudioUtils} from 'react-native-audio'
import { transcode } from 'react-native-audio-transcoder'
import Toast from 'react-native-simple-toast'
import RNFS from 'react-native-fs'
import {Button} from 'react-native-elements'

import colors from '../common/colors'
import styles from '../common/styles'
import {saveFile} from '../redux/action'

export default DefinedRecording = props => {
    const navigation = useContext(NavigationContext)
    const subject = navigation.getParam('subject', '')
    const [recording, setRecording] = useState(null)
    const [random, setRandom] = useState(1)
    const [duration, setDuration] = useState(0)
    const settings = useSelector(state=>state.settings)
    const dispatch = useDispatch()
    const [spining, setSpining] = useState(false)
    const [exit, setExit] = useState(false)
    useEffect(()=>{
        return () => {
            setExit(true)
        }
    },[])
    useEffect(()=>{
        console.log(exit, recording)
        if (recording) {
            AudioRecorder.onProgress = handleProgress
        } else {
            AudioRecorder.onProgress = null
        }
        return async ()=>{
            console.log('exit, recording:', exit, recording)
            if (exit && recording) {
                await AudioRecorder.stopRecording()
            }
        }
    }, [exit, recording])
    const handleProgress = data => {
        // console.log(data)
        setDuration(Math.floor(data.currentTime*1000))
        // setRandom(1-Math.log(100)/Math.log(data.currentMetering+100))
        setRandom((data.currentMetering+160)/160)
    }
    const handlePause = () => {
        if (recording == false) {
            AudioRecorder.resumeRecording().then(()=>{
                console.log('resume...')
                setRecording(!recording)
            })
        } else if (recording == true) {
            AudioRecorder.pauseRecording().then(()=>{
                console.log('pause...')
                setRecording(!recording)
            })
        }
    }
    const start = () => {
        RNFS.mkdir(settings.storage).then(()=>{
            filePath.current = settings.storage + `/${Date.now()}.aac`
            AudioRecorder.prepareRecordingAtPath(filePath.current, {
                SampleRate: settings.bitrate*1000,
                Channels: 1,
                AudioQuality: "Low",
                AudioEncoding: "aac",
                currentMetering: true
            }).then(()=>{
                setDuration(0)
                setSpining(true)
                AudioRecorder.onProgress = handleProgress
                AudioRecorder.startRecording().then(()=>{
                    console.log('start...')
                    setSpining(false)
                    setRecording(true)
                })
            })
        })
    }
    const handleStart = () => {
        if (recording == null) {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO).then(granted=>{
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Toast.show('You have to accept permission to record audio.')
                    return
                }
                if (Platform.OS == 'android') {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(granted=>{
                        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                            Toast.show('You have to accept permission to write audio file.')
                            return
                        }
                        start()
                    })
                    return
                }
                start()
            })
        }
    }
    const handleStop = () => {
        if (recording == true) {
            setSpining(true)
            AudioRecorder.stopRecording().then(()=>{
                console.log('stop...')
                setRandom(1)
                setRecording(null)
                setSpining(false)
            })
        }
    }
    const filePath = useRef()
    const minutes = Math.floor(duration/60000)
    const secs = Math.floor((duration%60000)/1000)
    const handleSave = () => {
        if (recording == null && filePath.current) {
            if (recording == null && filePath.current) {
                const myFilePath = filePath.current
                const myNewFile = myFilePath.replace('aac', 'mp3')
                setSpining(true)
                transcode(myFilePath, myNewFile).then(() => {
                    RNFS.unlink(myFilePath)
                    setSpining(false)
                    dispatch(saveFile({
                        type: 'defined',
                        path: myNewFile,
                        duration,
                        subject,
                    }))
                    navigation.pop()
                }).catch(error=>{
                    setSpining(false)
                    console.log(error.message)
                    Toast.show(error.message)
                })
            }
        }
    }
    const handleCancel = () => {
        navigation.pop()
    }
    return (
        <SafeAreaView style={{flex: 1}}>
            {/* <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}> */}
                {/* <View style={{alignItems: 'center', justifyContent: 'center', margin: 20}}>
                    <TouchableOpacity
                        onPress={handleStart}>
                        <Image source={require('../../asset/recordmp3.png')} style={{width: 45, height: 45}}/>
                    </TouchableOpacity>
                </View>
                <View style={{margin: 20, flexDirection: 'row', justifyContent: 'space-around'}}>
                    <FontAwesome name={recording?'pause-circle':'play-circle'} size={50} color={recording==null?'grey':colors.primary}
                    onPress={handlePause}/>
                    <FontAwesome name='stop-circle' size={50} color={recording?colors.primary:'grey'}
                    onPress={handleStop}/>
                </View> */}
                <View style={{backgroundColor: colors.primary, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, flex: 1}}>
                <ImageBackground source={require('./../../asset/topImage.png')} style={{width: '100%', height: 230}}>
                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center', padding: 10}}>NEW RECORDING</Text>
                </ImageBackground>
                <Text style={{textAlign: 'center', color: 'white', fontSize: 24, fontWeight: 'bold'}}>{minutes.toString().padStart(2, '0')+':'+secs.toString().padStart(2, '0')}</Text>
                <View style={{margin: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <LinearGradient
                        colors={['#1BBD29', '#44C127', '#6DC921', '#A2D11E', '#DCD118', '#DCD118', '#E6A311', '#E6A311', '#030003']}
                        start={{x: 0, y: 0}} end={{x: random, y: 0}}
                        style={{width: '100%', height: 30, borderColor: colors.primary, borderWidth: 1}}/>
                </View>
                <View style={{margin: 20, flexDirection: 'row', justifyContent: 'space-around'}}>
                    <FontAwesome name='pause-circle' size={50} color={recording==null?'grey':'white'}
                    onPress={handlePause}/>
                    <FontAwesome name='play-circle' size={50} color={recording==null?'white':'grey'}
                    onPress={handleStart}/>
                    <FontAwesome name='stop-circle' size={50} color={recording==true?'white':'grey'}
                    onPress={handleStop}/>
                </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 20, justifyContent: 'space-around'}}>
                    <Button
                        title='CANCEL'
                        type='outline'
                        containerStyle={{width: 150}}
                        titleStyle={{color: '#AAAAAA', fontSize: 14}}
                        onPress={handleCancel}
                    />
                    <Button
                        title='SAVE'
                        containerStyle={{width: 150}}
                        titleStyle={{fontSize: 14}}
                        buttonStyle={{backgroundColor: colors.primary}}
                        onPress={handleSave}
                    />
                </View>
                <Spinner visible={spining} />
            {/* </KeyboardAwareScrollView> */}
        </SafeAreaView>
    )
}
